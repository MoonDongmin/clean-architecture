/**
 * ThresholdExceededException
 * - 송금 한도 초과 예외
 */
import { Money } from "@/account/domain/value-object/money";

export class ThresholdExceededException extends Error {
  constructor(threshold: Money, actual: Money) {
    super(
      `Maximum threshold for transferring money exceeded: tried to transfer ${actual.toString()} but threshold is ${threshold.toString()}!`,
    );

    this.name = "ThresholdExceededException";
  }
}
