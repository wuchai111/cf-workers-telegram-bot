import TelegramApi from './telegram_api.js';
import TelegramBot from './telegram_bot.js';
import SerializableData from './types/SerializableData.js';
import TelegramInlineQueryResultArticle from './types/TelegramInlineQueryResultArticle.js';
import TelegramInlineQueryResultPhoto from './types/TelegramInlineQueryResultPhoto.js';
import TelegramUpdate from './types/TelegramUpdate.js';
import TelegramInlineQueryResultVideo from './types/TelegramInlineQueryResultVideo.js';

export default class TelegramExecutionContext {
	bot: TelegramBot;
	update: TelegramUpdate;
	update_type = '';
	api = new TelegramApi();

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
		return this.update.message?.text ?? this.update.inline_query?.query ?? '';
	}

	next() {
		return new Response('ok');
	}

	setData(key: string, value: SerializableData) {
		this.data[key] = value;
		return this;
	}

	getData(key: string) {
		return this.data[key];
	}

	async replyVideo(video: string, options: Record<string, SerializableData> = {}) {
		switch (this.update_type) {
			case 'message':
				return await this.api.sendVideo(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					video,
				});
			case 'inline':
				return await this.api.answerInline(this.bot.api.toString(), {
					...options,
					inline_query_id: this.update.inline_query?.id.toString() ?? '',
					results: [new TelegramInlineQueryResultVideo(video)],
				});

			default:
				break;
		}
	}

	async getFile(file_id: string) {
		return await this.api.getFile(this.bot.api.toString(), { file_id }, this.bot.token);
	}

	async replyPhoto(photo: string, caption = '', options: Record<string, SerializableData> = {}) {
		switch (this.update_type) {
			case 'photo':
				return await this.api.sendPhoto(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					photo,
					caption,
				});
			case 'message':
				return await this.api.sendPhoto(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					photo,
					caption,
				});
			case 'inline':
				return await this.api.answerInline(this.bot.api.toString(), {
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
				return await this.api.sendMessage(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					text: message,
					parse_mode,
				});
			case 'photo':
				return await this.api.sendMessage(this.bot.api.toString(), {
					...options,
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					text: message,
					parse_mode,
				});
			case 'inline':
				return await this.api.answerInline(this.bot.api.toString(), {
					inline_query_id: this.update.inline_query?.id.toString() ?? '',
					results: [new TelegramInlineQueryResultArticle(message)],
				});
			default:
				break;
		}
	}
}
