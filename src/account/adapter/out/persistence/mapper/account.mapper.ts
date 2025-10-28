import { Injectable } from "@nestjs/common";
import { AccountEntity } from "@/account/adapter/out/persistence/entity/account.entity";
import { ActivityEntity } from "@/account/adapter/out/persistence/entity/activity.entity";
import { Account } from "@/account/domain/account";
import { Money } from "@/account/domain/value-object/money";
import { AccountId } from "@/account/domain/value-object/account-id";
import { ActivityWindow } from "@/account/domain/activity-window";
import { Activity } from "@/account/domain/activity";
import { ActivityId } from "@/account/domain/value-object/activity-id";
/**
 * AccountMapper
 * - ORM Entity ↔ Domain Entity 변환
 */
@Injectable()
export class AccountMapper {
  /**
   * ORM Entity → Domain Entity
   */
  mapToDomainEntity(
    account: AccountEntity,
    activities: ActivityEntity[],
    withdrawalBalance: number,
    depositBalance: number,
  ): Account {
    const baselineBalance = Money.subtract(
      Money.of(depositBalance),
      Money.of(withdrawalBalance),
    );

    return Account.withId(
      new AccountId(account.id),
      baselineBalance,
      this.mapToActivityWindow(activities),
    );
  }

  /**
   * ActivityOrmEntity[] → ActivityWindow
   */
  private mapToActivityWindow(activities: ActivityEntity[]): ActivityWindow {
    const mappedActivities: Activity[] = activities.map((activity) =>
      Activity.withId(
        new ActivityId(activity.id),
        new AccountId(activity.ownerAccountId),
        new AccountId(activity.sourceAccountId),
        new AccountId(activity.targetAccountId),
        activity.timestamp,
        Money.of(BigInt(activity.amount)),
      ),
    );

    return new ActivityWindow(mappedActivities);
  }

  /**
   * Domain Activity → ORM Entity
   */
  mapToOrmEntity(activity: Activity): ActivityEntity {
    const entity = new ActivityEntity();

    entity.id = activity.getId()?.getValue() ?? 0; // null이면 0
    entity.timestamp = activity.getTimestamp();
    entity.ownerAccountId = activity.getOwnerAccountId().getValue();
    entity.sourceAccountId = activity.getSourceAccountId().getValue();
    entity.targetAccountId = activity.getTargetAccountId().getValue();
    entity.amount = activity.getMoney().getAmount().toString();

    return entity;
  }
}
