import TelegramBot from '../telegram_bot';
import { TelegramUpdate, TelegramInlineQueryResultArticle } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> => {
	const { success } = await self.db
		.prepare('DELETE FROM Messages WHERE userId=?')
		.bind(update.inline_query ? update.inline_query.from.id : update.message?.from.id)
		.run();
	if (success) {
		if (update.inline_query) {
			return self.answerInlineQuery(update.inline_query.id, [new TelegramInlineQueryResultArticle('_')]);
		}
		return self.sendMessage(update.message?.chat.id ?? 0, '_');
	}
	return self.sendMessage(update.message?.chat.id ?? 0, 'failed');
};
