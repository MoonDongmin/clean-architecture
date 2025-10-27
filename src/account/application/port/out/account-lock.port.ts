import { AccountId } from "@/account/domain/value-object/account-id";

/**
 * AccountLock (Outgoing Port)
 * - 계좌 잠금 인터페이스 (동시성 제어)
 */
export interface AccountLock {
  lockAccount(accountId: AccountId): Promise<void>;
  releaseAccount(accountId: AccountId): Promise<void>;
}

export const ACCOUNT_LOCK = Symbol("AccountLock");
