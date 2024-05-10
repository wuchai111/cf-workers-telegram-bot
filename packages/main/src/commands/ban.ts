import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate, args: string[]): Promise<Response> => {
	const chat_id = update.message?.reply_to_message?.chat.id;
	const user_id = update.message?.reply_to_message?.from.id;
	if (chat_id && user_id) {
		return self.banChatMember(chat_id, user_id, 0, true);
	}
	return new Response('ok');
};
