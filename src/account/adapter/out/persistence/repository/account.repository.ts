import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccountEntity } from "@/account/adapter/out/persistence/entity/account.entity";

/**
 * AccountRepository
 * - Spring Data JPA의 SpringDataAccountRepository에 해당
 */
@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}

  async findById(id: number): Promise<AccountEntity | null> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }
}
