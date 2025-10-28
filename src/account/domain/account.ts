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
  private readonly _id: AccountId | null;

  private readonly baselineBalance: Money;

  private readonly _activityWindow: ActivityWindow;

  constructor(
    id: AccountId | null,
    baselineBalance: Money,
    activityWindow: ActivityWindow,
  ) {
    this._id = id;
    this.baselineBalance = baselineBalance;
    this._activityWindow = activityWindow;
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
    if (!this._id) {
      throw new Error("Cannot calculate balance for account without ID");
    }

    return Money.add(
      this.baselineBalance,
      this._activityWindow.calculateBalance(this._id),
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
      this._id!,
      this._id!,
      targetAccountId,
      new Date(),
      money,
    );

    this._activityWindow.addActivity(withdrawal);
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
      this._id!,
      sourceAccountId,
      this._id!,
      new Date(),
      money,
    );

    this._activityWindow.addActivity(deposit);
    return true;
  }

  public getId(): AccountId | null {
    return this._id;
  }

  public getActivityWindow(): ActivityWindow {
    return this._activityWindow;
  }
}
