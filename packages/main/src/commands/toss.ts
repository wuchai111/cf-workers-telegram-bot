import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	self.sendMessage(update.message?.chat.id ?? 0, Math.floor(Math.random() * 2) == 0 ? 'heads' : 'tails');
