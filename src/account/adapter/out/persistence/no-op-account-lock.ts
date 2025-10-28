import { Injectable } from "@nestjs/common";
import { AccountId } from "@/account/domain/value-object/account-id";
/**
 * NoOpAccountLock
 * - AccountLock의 기본 구현 (아무것도 하지 않음)
 * - 실제 프로덕션에서는 Redis 등을 사용한 분산 락 구현 필요
 */
@Injectable()
export class NoOpAccountLock {
  async lockAccount(accountId: AccountId): Promise<void> {
    // do nothing
  }

  async releaseAccount(accountId: AccountId): Promise<void> {
    // do nothing
  }
}
