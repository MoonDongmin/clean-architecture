import { Controller } from "@nestjs/common";

/**
 * @WebAdapter Decorator
 * - Web 어댑터를 명시적으로 표시
 */
export const WebAdapter = (path?: string) => {
  return path ? Controller(path) : Controller();
};
