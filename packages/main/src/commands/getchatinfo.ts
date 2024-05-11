import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	self.sendMessage(update.message?.chat.id ?? 0, `<pre>${JSON.stringify(update.message?.chat ?? 0)}</pre>`, 'HTML');
