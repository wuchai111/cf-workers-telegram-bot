import TelegramBot from "../telegram_bot";
import { TelegramUpdate, TelegramInlineQueryResultArticle } from "../types";

export default async (
  self: TelegramBot,
  update: TelegramUpdate,
  args: string[]
): Promise<Response> =>
  ((outcome, message) =>
    update.inline_query
      ? self.answerInlineQuery(update.inline_query.id, [
          new TelegramInlineQueryResultArticle(
            message(
              update.inline_query.from.username,
              update.inline_query.from.first_name,
              outcome
            )
          ),
        ])
      : self.sendMessage(
          update.message?.chat.id ?? 0,
          message(
            update.message?.from.username ?? "",
            update.message?.from.first_name ?? "",
            outcome
          )
        ))(
    Math.floor(Math.random() * (parseInt(args[1]) || 6 - 1 + 1) + 1),
    (username: string, first_name: string, outcome: number) =>
      `${first_name ?? username} rolled a ${
        parseInt(args[1]) || 6
      } sided die. it landed on ${outcome}`
  );
