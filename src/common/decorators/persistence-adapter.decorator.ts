import { Injectable } from "@nestjs/common";

/**
 * @PersistenceAdapter Decorator
 * - Persistence 어댑터를 명시적으로 표시
 */
export const PersistenceAdapter = () => Injectable();
