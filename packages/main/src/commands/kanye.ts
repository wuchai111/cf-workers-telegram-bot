import { responseToJSON } from "../libs";
import TelegramBot from "../telegram_bot";
import { TelegramUpdate, TelegramInlineQueryResultArticle } from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate
): Promise<Response> =>
  fetch("https://api.kanye.rest")
    .then((response) => responseToJSON(response))
    .then((json) =>
      ((message) =>
        update.inline_query
          ? self.answerInlineQuery(update.inline_query.id, [
              new TelegramInlineQueryResultArticle(message),
            ])
          : self.sendMessage(update.message?.chat.id ?? 0, message))(
        `Kanye says... ${json.quote}`
      )
    )
    .catch(() => new Response("Failed to parse JSON"));
