import { SelfValidating } from "@/common/base/self-validating";
import { IsNotEmpty } from "class-validator";
import { AccountId } from "@/account/domain/value-object/account-id";
import { Money } from "@/account/domain/value-object/money";

/**
 * SendMoneyCommand
 * - 송금 Use Case의 입력 데이터
 * - 생성 시 자동 검증 (SelfValidating)
 */
export class SendMoneyCommand extends SelfValidating {
  @IsNotEmpty()
  private readonly _sourceAccountId: AccountId;
  @IsNotEmpty()
  private readonly _targetAccountId: AccountId;

  @IsNotEmpty()
  private readonly _money: Money;

  constructor(
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    money: Money,
  ) {
    super();
    this._sourceAccountId = sourceAccountId;
    this._targetAccountId = targetAccountId;
    this._money = money;

    this.validateSelfSync();
  }

  public getSourceAccountId(): AccountId {
    return this._sourceAccountId;
  }

  public getTargetAccountId(): AccountId {
    return this._targetAccountId;
  }

  public getMoney(): Money {
    return this._money;
  }
}
