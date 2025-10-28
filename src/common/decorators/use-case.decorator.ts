import { Injectable } from "@nestjs/common";

/**
 * @UseCase Decorator
 * - Application Service를 명시적으로 표시
 */
export const UseCase = () => Injectable();
