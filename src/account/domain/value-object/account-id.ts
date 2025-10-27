/**
 * AccountId 값 객체
 * - Account의 고유 식별자
 */
export class AccountId {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error(`AccountId must be positive`);
    }
    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: AccountId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
