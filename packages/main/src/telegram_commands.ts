import { TelegramCommand } from './types';

export default class TelegramCommands {
	static ping: TelegramCommand = async (bot, update, args) => bot.ping(bot, update, args);
	static toss: TelegramCommand = async (bot, update) => bot.toss(bot, update);
	static epoch: TelegramCommand = async (bot, update) => bot.epoch(bot, update);
	static kanye: TelegramCommand = async (bot, update) => bot.kanye(bot, update);
	static bored: TelegramCommand = async (bot, update) => bot.bored(bot, update);
	static joke: TelegramCommand = async (bot, update) => bot.joke(bot, update);
	static dog: TelegramCommand = async (bot, update) => bot.dog(bot, update);
	static roll: TelegramCommand = async (bot, update, args) => bot.roll(bot, update, args);
	static duckduckgo: TelegramCommand = async (bot, update, args) => bot.duckduckgo(bot, update, args);
	static question: TelegramCommand = async (bot, update, args) => bot.question(bot, update, args);
	static sean: TelegramCommand = async (bot, update, args) => bot.sean(bot, update, args);
	static clear: TelegramCommand = async (bot, update) => bot.clear(bot, update);
	static code: TelegramCommand = async (bot, update) => bot.code(bot, update);
	static commandList: TelegramCommand = async (bot, update) => bot.commandList(bot, update);
	static image: TelegramCommand = async (bot, update, args) => bot.image(bot, update, args);
	static translate: TelegramCommand = async (bot, update, args) => bot.translate(bot, update, args);
	static start: TelegramCommand = async (bot, update) => bot.start(bot, update);
	static ban: TelegramCommand = async (bot, update) => bot.ban(bot, update);
	static mute: TelegramCommand = async (bot, update) => bot.mute(bot, update);
}
