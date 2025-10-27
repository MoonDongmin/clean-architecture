import { AccountId } from "@/account/domain/value-object/account-id";
import { Account } from "@/account/domain/account";

/**
 * LoadAccountPort (Outgoing Port)
 * - 계좌 로드 인터페이스
 */
export interface LoadAccountPort {
  loadAccount(accountId: AccountId, baselineDate: Date): Promise<Account>;
}

export const LOAD_ACCOUNT_PORT = Symbol("LoadAccountPort");
