import BotApi from '../bot_api';
import Update from './Update';

type Command = (bot: BotApi, update: Update, args: string[]) => Promise<Response>;
export default Command;
