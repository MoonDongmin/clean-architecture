import { Controller, Inject, Param, ParseIntPipe, Post } from "@nestjs/common";
import {
  SEND_MONEY_USE_CASE,
  type SendMoneyUseCase,
} from "@/account/application/port/in/send-money.usecase";
import { SendMoneyCommand } from "@/account/application/port/in/send-money.command";
import { AccountId } from "@/account/domain/value-object/account-id";
import { Money } from "@/account/domain/value-object/money";

/**
 * SendMoneyController
 * - REST API 엔드포인트
 */
@Controller("accounts")
export class SendMoneyController {
  constructor(
    @Inject(SEND_MONEY_USE_CASE)
    private readonly sendMoneyUseCase: SendMoneyUseCase,
  ) {}

  @Post("send/:sourceAccountId/:targetAccountId/:amount")
  async sendMoney(
    @Param("sourceAccountId", new ParseIntPipe()) sourceAccountId: number,
    @Param("targetAccountId", new ParseIntPipe()) targetAccountId: number,
    @Param("amount", new ParseIntPipe()) amount: number,
  ): Promise<void> {
    const command = new SendMoneyCommand(
      new AccountId(sourceAccountId),
      new AccountId(targetAccountId),
      Money.of(amount),
    );

    await this.sendMoneyUseCase.sendMoney(command);
  }
}
