import BotApi from '../bot_api';
import { Update } from './Update';

export type Command = (bot: BotApi, update: Update, args: string[]) => Promise<Response>;
