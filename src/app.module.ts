import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "@/account/adapter/out/persistence/entity/account.entity";
import { ActivityEntity } from "@/account/adapter/out/persistence/entity/activity.entity";
import { AccountModule } from "@/account/account.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres", // 또는 'mysql'
      host: "localhost",
      port: 15432,
      username: process.env.USER_NAME || "postgres",
      password: process.env.PASSWORD || "postgres",
      database: process.env.DATABASE || "postgres",
      entities: [AccountEntity, ActivityEntity],
      synchronize: true, // 개발 환경에서만 true (운영에서는 false)
    }),
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
