/**
 * Money 값 객체
 * - BigInt를 사용하여 정밀한 금액 계산 지원
 * - Immutable: 모든 연산은 새로운 인스턴스 반환
 */
export class Money {
  static readonly ZERO = new Money(BigInt(0));

  private readonly amount: bigint;

  constructor(amount: bigint) {
    this.amount = amount;
  }

  // 팰터리 메서드: number 또는 bigint로 Money 생성
  static of(value: number | bigint): Money {
    return new Money(BigInt(value));
  }

  // BigInt 값 반환
  public getAmount(): bigint {
    return this.amount;
  }

  // 양수 또는 0인지 확인
  public isPositiveOrZero(): boolean {
    return this.amount >= BigInt(0);
  }

  // 음수인지 확인
  public isNegative(): boolean {
    return this.amount < BigInt(0);
  }

  // 양수인지 확인
  public isPositive(): boolean {
    return this.amount > BigInt(0);
  }

  // 다른 Money보다 크거나 같은지 확인
  public isGreaterThanOrEqualTo(money: Money): boolean {
    return this.amount >= money.amount;
  }

  // 다른 Money보다 큰지 확인
  public isGreaterThan(money: Money): boolean {
    return this.amount > money.amount;
  }

  // 두 Money를 더한 새로운 Money 반환 (정적 메서드)
  public static add(a: Money, b: Money): Money {
    return new Money(a.amount + b.amount);
  }

  //다른 Money를 뺀 새로운 Money 반환
  public minus(money: Money): Money {
    return new Money(this.amount - money.amount);
  }

  // 다른 Money를 더한 새로운 Money 반환
  public plus(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  // 두 Money를 뺀 새로운 Money 반환 (정적 메서드)
  public static subtract(a: Money, b: Money): Money {
    return new Money(a.amount - b.amount);
  }

  // 부호를 반전한 새로운 Money 반환
  public negate(): Money {
    return new Money(-this.amount);
  }

  // 동등성 비교
  public equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  // 문자열 표현 (디버깅용)
  public toString(): string {
    return this.amount.toString();
  }
}
