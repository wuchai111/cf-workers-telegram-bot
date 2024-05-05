import TelegramBot from "../telegram_bot";
import { TelegramUpdate, TelegramInlineQueryResultPhoto } from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate
): Promise<Response> =>
  fetch("https://shibe.online/api/shibes")
    .then((response) => response.json())
    .then((json) => json as [string])
    .then((shibe_response) =>
      update.inline_query
        ? self.answerInlineQuery(
            update.inline_query.id,
            [new TelegramInlineQueryResultPhoto(shibe_response[0])],
            0
          )
        : self.sendPhoto(update.message?.chat.id ?? 0, shibe_response[0])
    );
