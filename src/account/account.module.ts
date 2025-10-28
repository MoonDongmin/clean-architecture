import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "@/account/adapter/out/persistence/entity/account.entity";
import { ActivityEntity } from "@/account/adapter/out/persistence/entity/activity.entity";
import { SendMoneyController } from "@/account/adapter/in/web/send-money.controller";
import { SEND_MONEY_USE_CASE } from "@/account/application/port/in/send-money.usecase";
import { SendMoneyService } from "@/account/application/service/send-money.service";
import { GET_ACCOUNT_BALANCE_QUERY } from "@/account/application/port/in/get-account-balance.query";
import { GetAccountBalanceService } from "@/account/application/service/get-account-balance.service";
import { MoneyTransferProperties } from "@/account/application/service/money-transfer.properties";
import { LOAD_ACCOUNT_PORT } from "@/account/application/port/out/load-account.port";
import { AccountPersistenceAdapter } from "@/account/adapter/out/persistence/account.persistence.adapter";
import { UPDATE_ACCOUNT_STATE_PORT } from "@/account/application/port/out/update-account-state.port";
import { ACCOUNT_LOCK } from "@/account/application/port/out/account-lock.port";
import { NoOpAccountLock } from "@/account/adapter/out/persistence/no-op-account-lock";
import { AccountRepository } from "@/account/adapter/out/persistence/repository/account.repository";
import { ActivityRepository } from "@/account/adapter/out/persistence/repository/activity.repository";
import { AccountMapper } from "@/account/adapter/out/persistence/mapper/account.mapper";

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, ActivityEntity])],
  controllers: [SendMoneyController],
  providers: [
    // Application Services
    {
      provide: SEND_MONEY_USE_CASE,
      useClass: SendMoneyService,
    },
    {
      provide: GET_ACCOUNT_BALANCE_QUERY,
      useClass: GetAccountBalanceService,
    },
    MoneyTransferProperties,

    // Outgoing Port Implementations
    {
      provide: LOAD_ACCOUNT_PORT,
      useClass: AccountPersistenceAdapter,
    },
    {
      provide: UPDATE_ACCOUNT_STATE_PORT,
      useClass: AccountPersistenceAdapter,
    },
    {
      provide: ACCOUNT_LOCK,
      useClass: NoOpAccountLock,
    },

    AccountPersistenceAdapter,
    AccountRepository,
    ActivityRepository,
    AccountMapper,
  ],
})
export class AccountModule {}
