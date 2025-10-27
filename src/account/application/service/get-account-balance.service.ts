import { Inject, Injectable } from "@nestjs/common";
import { GetAccountBalanceQuery } from "@/account/application/port/in/get-account-balance.query";
import {
  LOAD_ACCOUNT_PORT,
  type LoadAccountPort,
} from "@/account/application/port/out/load-account.port";
import { Money } from "@/account/domain/value-object/money";
import { AccountId } from "@/account/domain/value-object/account-id";

@Injectable()
export class GetAccountBalanceService implements GetAccountBalanceQuery {
  constructor(
    @Inject(LOAD_ACCOUNT_PORT)
    private readonly loadAccount: LoadAccountPort,
  ) {}

  async getAccountBalance(accountId: AccountId): Promise<Money> {
    const account = await this.loadAccount.loadAccount(accountId, new Date());

    return account.calculateBalance();
  }
}
