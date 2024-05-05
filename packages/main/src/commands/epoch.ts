import TelegramBot from "../telegram_bot";
import { TelegramUpdate, TelegramInlineQueryResultArticle } from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate
): Promise<Response> =>
  ((seconds) =>
    update.inline_query
      ? self.answerInlineQuery(
          update.inline_query.id,
          [new TelegramInlineQueryResultArticle(seconds)],
          0
        )
      : self.sendMessage(update.message?.chat.id ?? 0, seconds))(
    Math.floor(Date.now() / 1000).toString()
  );
