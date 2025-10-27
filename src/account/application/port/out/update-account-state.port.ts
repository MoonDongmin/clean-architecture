import { Account } from "@/account/domain/account";

/**
 * UpdateAccountStatePort (Outgoing Port)
 * - 계좌 상태 업데이트 인터페이스
 */
export interface UpdateAccountStatePort {
  updateActivities(account: Account): Promise<void>;
}

export const UPDATE_ACCOUNT_STATE_PORT = Symbol("UpdateAccountStatePort");
