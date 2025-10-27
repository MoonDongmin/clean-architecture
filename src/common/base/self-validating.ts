import { validate, ValidationError } from "class-validator";

/**
 * SelfValidating Base Class
 * - class-validator를 사용하여 자동 검증
 * - Command 객체가 상속받아 사용
 */
export abstract class SelfValidating {
  /**
   * 인스턴스 검증
   * @throws ValidationError 검증 실패 시
   */
  protected async validateSelf(): Promise<void> {
    const errors: ValidationError[] = await validate(this);

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join("; ");

      throw new Error(`Validation failed: ${messages}`);
    }
  }

  /**
   * 동기 검증 (생성자에서 사용)
   */
  protected validateSelfSync(): void {
    validate(this).then((errors) => {
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}).join(", "))
          .join("; ");
        throw new Error(`Validation failed: ${messages}`);
      }
    });
  }
}
