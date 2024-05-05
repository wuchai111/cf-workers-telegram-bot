import { preTagString, prettyJSON } from "../libs";
import TelegramBot from "../telegram_bot";
import { TelegramUpdate } from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate
): Promise<Response> =>
  self.sendMessage(
    update.message?.chat.id ?? 0,
    preTagString(prettyJSON(update.message?.chat ?? 0)),
    "HTML"
  );
