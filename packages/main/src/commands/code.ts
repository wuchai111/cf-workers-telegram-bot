import TelegramBot from '../telegram_bot';
import { TelegramUpdate, TelegramInlineQueryResultArticle } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	((url) =>
		update.inline_query
			? self.answerInlineQuery(update.inline_query.id, [new TelegramInlineQueryResultArticle(url)])
			: self.sendMessage(update.message?.chat.id ?? 0, url))('https://github.com/codebam/cf-workers-telegram-bot');
