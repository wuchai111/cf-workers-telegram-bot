import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> => {
	const chat_id = update.message?.reply_to_message?.chat.id;
	const user_id = update.message?.reply_to_message?.from.id;
	if (chat_id && user_id) {
		return self.restrictChatMember(chat_id, user_id, { can_send_messages: false }, false, 0);
	}
	return new Response('ok');
};
