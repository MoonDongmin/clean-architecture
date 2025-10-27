import { AccountId } from "@/account/domain/value-object/account-id";
import { Money } from "@/account/domain/value-object/money";
import { ActivityWindow } from "@/account/domain/activity-window";
import { Activity } from "@/account/domain/activity";

/**
 * Account 엔티티 (Aggregate Root)
 * - 계좌 도메인의 핵심 엔티티
 * - 입출금 비즈니스 로직 포함
 * - ActivityWindow를 통해 최근 활동만 메모리에 유지
 */
export class Account {
  private readonly id: AccountId | null;

  private readonly baselineBalance: Money;

  private readonly activityWindow: ActivityWindow;

  constructor(
    id: AccountId | null,
    baselineBalance: Money,
    activityWindow: ActivityWindow,
  ) {
    this.id = id;
    this.baselineBalance = baselineBalance;
    this.activityWindow = activityWindow;
  }

  // 팩터리 메서드
  public static withoutId(
    baselineBalance: Money,
    activityWindow: ActivityWindow,
  ): Account {
    return new Account(null, baselineBalance, activityWindow);
  }

  static withId(
    accountId: AccountId,
    baselineBalance: Money,
    activityWindow: ActivityWindow,
  ): Account {
    return new Account(accountId, baselineBalance, activityWindow);
  }

  /**
   * 현재 총 잔액 계산
   * = baselineBalance + activityWindow의 잔액
   */
  calculateBalance(): Money {
    if (!this.id) {
      throw new Error("Cannot calculate balance for account without ID");
    }

    return Money.add(
      this.baselineBalance,
      this.activityWindow.calculateBalance(this.id),
    );
  }

  /**
   * 출금 (withdraw)
   * - 잔액이 충분하면 출금 Activity 생성
   * @returns 성공 여부
   */
  withdraw(money: Money, targetAccountId: AccountId): boolean {
    if (!this.mayWithdraw(money)) {
      return false;
    }

    const withdrawal = Activity.withoutId(
      this.id!,
      this.id!,
      targetAccountId,
      new Date(),
      money,
    );

    this.activityWindow.addActivity(withdrawal);
    return true;
  }

  /**
   * 출금 가능 여부 확인 (private)
   */
  private mayWithdraw(money: Money): boolean {
    return Money.add(
      this.calculateBalance(),
      money.negate(),
    ).isPositiveOrZero();
  }

  /**
   * 입금 (deposit)
   * - 무조건 성공 (입금에는 제한이 없음)
   * @returns 성공 여부 (항상 true)
   */
  deposit(money: Money, sourceAccountId: AccountId): boolean {
    const deposit = Activity.withoutId(
      this.id!,
      sourceAccountId,
      this.id!,
      new Date(),
      money,
    );

    this.activityWindow.addActivity(deposit);
    return true;
  }
}
