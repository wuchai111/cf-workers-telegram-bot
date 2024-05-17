import { SerializableData, TelegramInlineQueryResultArticle, TelegramInlineQueryResultPhoto } from './types.js';
import TelegramInlineQueryResultVideo from './types/TelegramInlineQueryResultVideo.js';

export default class TelegramApi {
	static getApiUrl(botApi: string, slug: string, data: Record<string, SerializableData>) {
		const request = new URL(botApi + (slug.startsWith('/') || botApi.endsWith('/') ? '' : '/') + slug);
		const params = new URLSearchParams();
		for (const i in data) {
			params.append(i, data[i].toString());
		}
		return new Request(`${request}?${params}`);
	}

	static async getFile(botApi: string, data: { file_id: string }, token: string) {
		const url = this.getApiUrl(botApi, 'getFile', data);
		const response = await fetch(url);
		const json = (await response.json()) as { result: { file_path: string } };
		const file_path = json.result.file_path;
		const file_response = await fetch(`https://api.telegram.org/file/bot${token}/${file_path}`);
		return await file_response.arrayBuffer();
	}

	static async sendMessage(
		botApi: string,
		data: {
			reply_to_message_id: number | string;
			chat_id: number | string;
			text: string;
			parse_mode: string;
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
			caption: string;
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
