import { Money } from "@/account/domain/value-object/money";

/**
 * MoneyTransferProperties
 * - 송금 설정 (최대 송금 한도 등)
 */
export class MoneyTransferProperties {
  constructor(
    private readonly maximumTransferThreshold: Money = Money.of(1_000_000),
  ) {}

  getMaximumTransferThreshold(): Money {
    return this.maximumTransferThreshold;
  }
}
