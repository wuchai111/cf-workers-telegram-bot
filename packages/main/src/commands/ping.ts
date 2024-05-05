import TelegramBot from "../telegram_bot";
import { TelegramUpdate } from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate,
  args: string[]
): Promise<Response> =>
  self.sendMessage(
    update.message?.chat.id ?? 0,
    args.length === 1 ? "pong" : args.slice(1).join(" ")
  );
