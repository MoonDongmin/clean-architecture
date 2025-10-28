/**
 * ActivityOrmEntity
 * - TypeORM 엔티티 (DB 테이블 매핑)
 */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("activity")
export class ActivityEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @Column({ name: "owner_account_id", type: "bigint" })
  ownerAccountId: number;

  @Column({ name: "source_account_id", type: "bigint" })
  sourceAccountId: number;

  @Column({ name: "target_account_id", type: "bigint" })
  targetAccountId: number;

  @Column({ type: "bigint" })
  amount: string; // BigInt는 string으로 저장
}
