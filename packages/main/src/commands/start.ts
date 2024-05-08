import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	self.sendMessage(update.message?.chat.id ?? 0, `Hello, send me a message to start chatting with ${self.chat_model}`);
