import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityEntity } from "@/account/adapter/out/persistence/entity/activity.entity";

/**
 * ActivityRepository
 * - Custom query methods
 */
@Injectable()
export class ActivityRepository {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly repository: Repository<ActivityEntity>,
  ) {}

  // 특정 계좌의 특정 시간 이후 활동 조회
  async findByOwnerSince(
    ownerAccountId: number,
    since: Date,
  ): Promise<ActivityEntity[]> {
    return this.repository
      .createQueryBuilder("activity")
      .where("activity.ownerAccountId = :ownerAccountId", { ownerAccountId })
      .andWhere("activity.timestamp >= :since", { since })
      .getMany();
  }

  // 특정 시간까지의 입금 총액
  async getDepositBalanceUntil(
    accountId: number,
    until: Date,
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("activity")
      .select("SUM(activity.amount)", "sum")
      .where("activity.targetAccountId = :accountId", { accountId })
      .andWhere("activity.ownerAccountId = :accountId", { accountId })
      .andWhere("activity.timestamp < :until", { until })
      .getRawOne();

    console.log(result);

    return result?.sum ? parseInt(result.sum, 10) : 0;
  }

  // 특정 시간까지의 출금 총액
  async getWithdrawBalanceUntil(
    accountId: number,
    until: Date,
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("activity")
      .select("SUM(activity.amount)", "sum")
      .where("activity.sourceAccountId = :accountId", { accountId })
      .andWhere("activity.ownerAccountId = :accountId", { accountId })
      .andWhere("activity.timestamp < :until", { until })
      .getRawOne();

    return result?.sum ? parseInt(result.sum, 10) : 0;
  }

  // Activity 저장
  async save(activity: ActivityEntity): Promise<ActivityEntity> {
    return this.repository.save(activity);
  }
}
