import TelegramApi from './telegram_api.js';
import TelegramBot from './telegram_bot.js';
import { SerializableData, TelegramInlineQueryResultArticle, TelegramInlineQueryResultPhoto, TelegramUpdate } from './types.js';
import TelegramInlineQueryResultVideo from './types/TelegramInlineQueryResultVideo.js';

export default class TelegramExecutionContext {
	bot: TelegramBot;
	update: TelegramUpdate;
	update_type = '';

	private data: Record<string, SerializableData> = {};

	constructor(bot: TelegramBot, update: TelegramUpdate) {
		this.bot = bot;
		this.update = update;

		if (this.update.message?.photo) {
			this.update_type = 'photo';
		} else if (this.update.message?.text) {
			this.update_type = 'message';
		} else if (this.update.inline_query?.query) {
			this.update_type = 'inline';
		}
	}

	getText() {
		return this.update.message?.text || this.update.inline_query?.query || '';
	}

	next() {
		return new Response('ok');
	}

	setData(key: string, value: SerializableData) {
		this.data[key] = value;
		return this;
	}

	deleteData(key: string) {
		delete this.data[key];
		return this;
	}

	getData(key: string) {
		return this.data[key];
	}

	async replyVideo(video: string, options: Record<string, SerializableData> = {}) {
		switch (this.update_type) {
			case 'message':
				return await TelegramApi.sendVideo(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					video,
				});
			case 'inline':
				return await TelegramApi.answerInline(this.bot.api.toString(), {
					...options,
					inline_query_id: this.update.inline_query?.id.toString() ?? '',
					results: [new TelegramInlineQueryResultVideo(video)],
				});

			default:
				break;
		}
	}

	async getFile(file_id: string) {
		return await TelegramApi.getFile(this.bot.api.toString(), { file_id }, this.bot.token);
	}

	async replyPhoto(photo: string, caption = '', options: Record<string, SerializableData> = {}) {
		switch (this.update_type) {
			case 'photo':
				return await TelegramApi.sendPhoto(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					photo,
					caption,
				});
			case 'message':
				return await TelegramApi.sendPhoto(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					photo,
					caption,
				});
			case 'inline':
				return await TelegramApi.answerInline(this.bot.api.toString(), {
					inline_query_id: this.update.inline_query?.id.toString() ?? '',
					results: [new TelegramInlineQueryResultPhoto(photo)],
				});

			default:
				break;
		}
	}

	async reply(message: string, parse_mode = '', options: Record<string, SerializableData> = {}) {
		switch (this.update_type) {
			case 'message':
				return await TelegramApi.sendMessage(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					text: message,
					parse_mode,
				});
			case 'photo':
				return await TelegramApi.sendMessage(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					text: message,
					parse_mode,
				});
			case 'inline':
				return await TelegramApi.answerInline(this.bot.api.toString(), {
					inline_query_id: this.update.inline_query?.id.toString() ?? '',
					results: [new TelegramInlineQueryResultArticle(message)],
				});
			default:
				break;
		}
	}
}
