import { AccountId } from "@/account/domain/value-object/account-id";
import { Money } from "@/account/domain/value-object/money";

/**
 * GetAccountBalanceQuery (Incoming Port)
 * - 잔액 조회 Query 인터페이스
 */
export interface GetAccountBalanceQuery {
  getAccountBalance(accountId: AccountId): Promise<Money>;
}

export const GET_ACCOUNT_BALANCE_QUERY = Symbol("GetAccountBalanceQuery");
