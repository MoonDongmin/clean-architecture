/**
 * ActivityId 값 객체
 * - Activity의 고유 식별자
 */
export class ActivityId {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error(`ActivityId must be positive`);
    }
    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: ActivityId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
