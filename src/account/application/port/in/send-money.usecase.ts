import { SendMoneyCommand } from "@/account/application/port/in/send-money.command";

/**
 * SendMoneyUseCase (Incoming Port)
 * - 송금 Use Case 인터페이스
 */
export interface SendMoneyUseCase {
  sendMoney(command: SendMoneyCommand): Promise<boolean>;
}

export const SEND_MONEY_USE_CASE = Symbol("SendMoneyUseCase");
