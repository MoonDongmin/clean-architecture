import { Injectable, NotFoundException } from "@nestjs/common";
import { LoadAccountPort } from "@/account/application/port/out/load-account.port";
import { UpdateAccountStatePort } from "@/account/application/port/out/update-account-state.port";
import { AccountId } from "@/account/domain/value-object/account-id";
import { Account } from "@/account/domain/account";
import { AccountRepository } from "@/account/adapter/out/persistence/repository/account.repository";
import { ActivityRepository } from "@/account/adapter/out/persistence/repository/activity.repository";
import { AccountMapper } from "@/account/adapter/out/persistence/mapper/account.mapper";
import { AccountEntity } from "@/account/adapter/out/persistence/entity/account.entity";

/**
 * AccountPersistenceAdapter
 * - LoadAccountPort, UpdateAccountStatePort 구현
 * - TypeORM을 사용한 영속성 관리
 */
@Injectable()
export class AccountPersistenceAdapter
  implements LoadAccountPort, UpdateAccountStatePort
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly accountMapper: AccountMapper,
  ) {}

  /**
   * 계좌 로드 (baselineDate 이후의 활동만 포함)
   */
  async loadAccount(
    accountId: AccountId,
    baselineDate: Date,
  ): Promise<Account> {
    const account: AccountEntity | null = await this.accountRepository.findById(
      accountId.getValue(),
    );

    if (!account) {
      throw new NotFoundException(
        `Account with ID ${accountId.getValue()} not found`,
      );
    }

    const activities = await this.activityRepository.findByOwnerSince(
      accountId.getValue(),
      baselineDate,
    );

    const withdrawalBalance =
      await this.activityRepository.getWithdrawBalanceUntil(
        accountId.getValue(),
        baselineDate,
      );

    const depositBalance = await this.activityRepository.getDepositBalanceUntil(
      accountId.getValue(),
      baselineDate,
    );

    return this.accountMapper.mapToDomainEntity(
      account,
      activities,
      withdrawalBalance,
      depositBalance,
    );
  }

  /**
   * 계좌 활동 업데이트 (새로운 Activity만 저장)
   */
  async updateActivities(account: Account): Promise<void> {
    for (const activity of account.getActivityWindow().getActivities()) {
      if (activity.getId() === null) {
        const ormEntity = this.accountMapper.mapToOrmEntity(activity);
        await this.activityRepository.save(ormEntity);
      }
    }
  }
}
