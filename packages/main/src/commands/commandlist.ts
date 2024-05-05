import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	self.sendMessage(update.message?.chat.id ?? 0, `${Object.keys(self.commands).join('\n')}`, 'HTML');
