import TelegramBot from '../telegram_bot';
import { TelegramUpdate, Bored, TelegramInlineQueryResultArticle } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	fetch('https://boredapi.com/api/activity/')
		.then((response) => response.json())
		.then((json) => json as Bored)
		.then((bored_response) =>
			update.inline_query
				? self.answerInlineQuery(update.inline_query.id, [new TelegramInlineQueryResultArticle(bored_response.activity)], 0)
				: self.sendMessage(update.message?.chat.id ?? 0, bored_response.activity),
		);
