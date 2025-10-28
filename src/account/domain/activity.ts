import { ActivityId } from "@/account/domain/value-object/activity-id";
import { AccountId } from "@/account/domain/value-object/account-id";
import { Money } from "@/account/domain/value-object/money";

/**
 * Activity 엔티티
 * - 계좌 간 송금 활동을 나타냄
 * - Immutable 객체
 */
export class Activity {
  private readonly id: ActivityId | null;

  private readonly ownerAccountId: AccountId;

  private readonly sourceAccountId: AccountId;

  private readonly targetAccountId: AccountId;

  private readonly timestamp: Date;

  private readonly money: Money;

  constructor(
    id: ActivityId | null,
    ownerAccountId: AccountId,
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    timestamp: Date,
    money: Money,
  ) {
    if (!ownerAccountId) throw new Error(`ownerAccountId is required`);
    if (!sourceAccountId) throw new Error("sourceAccountId is required");
    if (!targetAccountId) throw new Error("targetAccountId is required");
    if (!timestamp) throw new Error("timestamp is required");
    if (!money) throw new Error("money is required");

    this.id = id;
    this.ownerAccountId = ownerAccountId;
    this.sourceAccountId = sourceAccountId;
    this.targetAccountId = targetAccountId;
    this.timestamp = timestamp;
    this.money = money;
  }

  // 팩토리 메서드
  public static withoutId(
    ownerAccountId: AccountId,
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    timestamp: Date,
    money: Money,
  ): Activity {
    return new Activity(
      null,
      ownerAccountId,
      sourceAccountId,
      targetAccountId,
      timestamp,
      money,
    );
  }

  public static withId(
    id: ActivityId,
    ownerAccountId: AccountId,
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    timestamp: Date,
    money: Money,
  ) {
    return new Activity(
      id,
      ownerAccountId,
      sourceAccountId,
      targetAccountId,
      timestamp,
      money,
    );
  }

  public getId(): ActivityId | null {
    return this.id;
  }

  public getOwnerAccountId(): AccountId {
    return this.ownerAccountId;
  }

  public getSourceAccountId(): AccountId {
    return this.sourceAccountId;
  }

  public getTargetAccountId(): AccountId {
    return this.targetAccountId;
  }

  public getMoney(): Money {
    return this.money;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }
}
