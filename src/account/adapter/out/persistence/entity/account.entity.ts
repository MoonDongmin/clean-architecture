import { Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * AccountOrmEntity
 * - TypeORM 엔티티 (DB 테이블 매핑)
 */
@Entity("account")
export class AccountEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
}
