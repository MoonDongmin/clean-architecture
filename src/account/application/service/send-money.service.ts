import { SendMoneyUseCase } from "@/account/application/port/in/send-money.usecase";
import { SendMoneyCommand } from "@/account/application/port/in/send-money.command";
import { Inject } from "@nestjs/common";
import {
  LOAD_ACCOUNT_PORT,
  type LoadAccountPort,
} from "@/account/application/port/out/load-account.port";
import {
  ACCOUNT_LOCK,
  type AccountLock,
} from "@/account/application/port/out/account-lock.port";
import {
  UPDATE_ACCOUNT_STATE_PORT,
  type UpdateAccountStatePort,
} from "@/account/application/port/out/update-account-state.port";
import { MoneyTransferProperties } from "@/account/application/service/money-transfer.properties";
import { ThresholdExceededException } from "@/account/application/service/threshold-exceeded.exception";
import { Account } from "@/account/domain/account";
import { AccountId } from "@/account/domain/value-object/account-id";
import { UseCase } from "@/common/decorators/use-case.decorator";

/**
 * SendMoneyService (Use Case Implementation)
 * - 송금 비즈니스 로직 구현
 * - Transaction 관리
 */
@UseCase()
export class SendMoneyService implements SendMoneyUseCase {
  constructor(
    @Inject(LOAD_ACCOUNT_PORT)
    private readonly loadAccountPort: LoadAccountPort,
    @Inject(ACCOUNT_LOCK)
    private readonly accountLock: AccountLock,
    @Inject(UPDATE_ACCOUNT_STATE_PORT)
    private readonly updateAccountStatePort: UpdateAccountStatePort,
    private readonly moneyTransferProperties: MoneyTransferProperties,
  ) {}

  async sendMoney(command: SendMoneyCommand): Promise<boolean> {
    // 1. 송금 한도 확인
    this.checkThreshold(command);

    // 2. 기준 날짜 설정(10일 전)
    const baselineDate = new Date();
    baselineDate.setDate(baselineDate.getDate() - 10);

    // 3. 출발/도착 계좌 로드
    const sourceAccount = await this.loadAccountPort.loadAccount(
      command.getSourceAccountId(),
      baselineDate,
    );

    const targetAccount = await this.loadAccountPort.loadAccount(
      command.getTargetAccountId(),
      baselineDate,
    );

    const sourceAccountId = this.getAccountId(sourceAccount, "source");
    const targetAccountId = this.getAccountId(targetAccount, "target");

    // 4. 출발 계좌 잠금 및 출금 시도
    await this.accountLock.lockAccount(sourceAccountId);

    if (!sourceAccount.withdraw(command.getMoney(), targetAccountId)) {
      await this.accountLock.releaseAccount(sourceAccountId);

      return false;
    }

    // 5. 도착 계좌 잠금 및 입금 시도
    await this.accountLock.lockAccount(targetAccountId);

    if (!targetAccount.deposit(command.getMoney(), sourceAccountId)) {
      await this.accountLock.releaseAccount(sourceAccountId);
      await this.accountLock.releaseAccount(targetAccountId);

      return false;
    }

    // 6. 상태 업데이트(영속화)
    await this.updateAccountStatePort.updateActivities(sourceAccount);
    await this.updateAccountStatePort.updateActivities(targetAccount);

    // 7. 잠금 해제
    await this.accountLock.releaseAccount(sourceAccountId);
    await this.accountLock.releaseAccount(targetAccountId);

    return true;
  }

  // 송금 한도 확인
  private checkThreshold(command: SendMoneyCommand): void {
    if (
      command
        .getMoney()
        .isGreaterThan(
          this.moneyTransferProperties.getMaximumTransferThreshold(),
        )
    ) {
      throw new ThresholdExceededException(
        this.moneyTransferProperties.getMaximumTransferThreshold(),
        command.getMoney(),
      );
    }
  }

  // AccountID 추출(null 체크)
  private getAccountId(account: Account, type: string): AccountId {
    const accountId = account.getId();

    if (!accountId) {
      throw new Error(`Expected ${type} account ID not to be empty`);
    }

    return accountId;
  }
}
