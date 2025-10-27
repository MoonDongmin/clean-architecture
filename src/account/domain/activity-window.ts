import { Activity } from "@/account/domain/activity";
import { AccountId } from "@/account/domain/value-object/account-id";
import { Money } from "@/account/domain/value-object/money";

/**
 * ActivityWindow
 * - 특정 시간대의 Activity 목록을 관리
 * - 잔액 계산 로직 포함
 */
export class ActivityWindow {
  private readonly activities: Array<Activity>;

  constructor(activities: Activity | Array<Activity>) {
    if (Array.isArray(activities)) {
      this.activities = [...activities];
    } else {
      this.activities = [activities];
    }
  }

  // 윈도우 시작 시간 (가장 오래된 Activity의 timestamp)
  public getStartTimestamp(): Date {
    if (this.activities.length === 0) {
      throw new Error(`Can't get start timestamp from empty ActivityWindow`);
    }

    return this.activities.reduce((earliest, activity) => {
      return activity.getTimestamp() < earliest
        ? activity.getTimestamp()
        : earliest;
    }, this.activities[0].getTimestamp());
  }

  // 윈도우 종료 시간 (가장 최근 Activity의 timestamp)
  getEndTimestamp(): Date {
    if (this.activities.length === 0) {
      throw new Error("Can't get end timestamp from empty ActivityWindow");
    }

    return this.activities.reduce((latest, activity) => {
      return activity.getTimestamp() > latest
        ? activity.getTimestamp()
        : latest;
    }, this.activities[0].getTimestamp());
  }

  /**
   * 특정 계좌의 잔액 계산
   * - 입금(deposit): targetAccountId가 accountId와 일치
   * - 출금(withdrawal): sourceAccountId가 accountId와 일치
   */
  calculateBalance(accountId: AccountId): Money {
    const depositBalance = this.activities
      .filter((a) => a.getTargetAccountId().equals(accountId))
      .map((a) => a.getMoney())
      .reduce((sum, money) => Money.add(sum, money), Money.ZERO);

    const withdrawalBalance = this.activities
      .filter((a) => a.getSourceAccountId().equals(accountId))
      .map((a) => a.getMoney())
      .reduce((sum, money) => Money.add(sum, money), Money.ZERO);

    return Money.add(depositBalance, withdrawalBalance.negate());
  }

  // Activities 조회 (불변 리스트 반환)
  public getActivities(): readonly Activity[] {
    return [...this.activities];
  }

  // Activity 추가 (mutable operation)
  addActivity(activity: Activity): void {
    this.activities.push(activity);
  }
}
