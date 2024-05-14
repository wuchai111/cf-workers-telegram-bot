import { SerializableData, TelegramInlineQueryResultArticle, TelegramInlineQueryResultPhoto } from './types';
import TelegramInlineQueryResultVideo from './types/TelegramInlineQueryResultVideo';

export default class API {
	static getApiUrl(botApi: string, slug: string, data: Record<string, SerializableData>) {
		const request = new URL(botApi + (slug.startsWith('/') || botApi.endsWith('/') ? '' : '/') + slug);
		const params = new URLSearchParams();
		for (const i in data) {
			params.append(i, data[i].toString());
		}
		return new Request(`${request}?${params}`);
	}

	static async sendMessage(
		botApi: string,
		data: {
			reply_to_message_id: number | string;
			chat_id: number | string;
			text: string;
		},
	) {
		const url = this.getApiUrl(botApi, 'sendMessage', data);
		return await fetch(url);
	}

	static async sendVideo(
		botApi: string,
		data: {
			reply_to_message_id: number | string;
			chat_id: number | string;
			video: string;
		},
	) {
		const url = this.getApiUrl(botApi, 'sendVideo', data);
		return await fetch(url);
	}

	static async sendPhoto(
		botApi: string,
		data: {
			reply_to_message_id: number | string;
			chat_id: number | string;
			photo: string;
		},
	) {
		const url = this.getApiUrl(botApi, 'sendPhoto', data);
		return await fetch(url);
	}

	static async answerInline(
		botApi: string,
		data: {
			inline_query_id: number | string;
			results: TelegramInlineQueryResultArticle[] | TelegramInlineQueryResultPhoto[] | TelegramInlineQueryResultVideo[];
		},
	) {
		const url = this.getApiUrl(botApi, 'answerInlineQuery', {
			inline_query_id: data.inline_query_id,
			results: JSON.stringify(data.results),
		});
		return await fetch(url);
	}
}
