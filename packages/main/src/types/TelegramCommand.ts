import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from './TelegramUpdate';

export type TelegramCommand = (bot: TelegramBot, update: TelegramUpdate, args: string[]) => Promise<Response>;
