import API from './api';
import { TelegramInlineQueryResultArticle, TelegramUpdate } from './types';

export default class TelegramBot {
	token: string;
	webhook: Webhook;
	update: TelegramUpdate;
	api: URL;
	update_type: string;

	constructor(token: string) {
		this.token = token;
		this.webhook = new Webhook('', new Request('http://127.0.0.1'));
		this.update = new TelegramUpdate({});
		this.api = new URL('https://api.telegram.org/bot' + token);
		this.update_type = '';
	}

	on(event: string, callback: () => Promise<Response>) {
		if (event !== 'on') {
			// eslint-disable-next-line
			// @ts-ignore TS7053
			this[event] = callback;
		}
		return this;
	}

	async handle(request: Request) {
		this.webhook = new Webhook(this.token, request);
		if (request.method === 'POST') {
			this.update = await request.json();
		}
		const url = new URL(request.url);
		if (`/${this.token}` === url.pathname) {
			switch (url.searchParams.get('command')) {
				case 'set':
					return this.webhook.set();
				default:
					break;
			}
			console.log(this.update);
			if (this.update.message?.text) {
				this.update_type = 'message';
			} else if (this.update.inline_query?.query) {
				this.update_type = 'inline';
			}
			let command = 'default';
			let args: string[] = [];
			switch (this.update_type) {
				case 'message': {
					// @ts-expect-error already checked above
					args = this.update.message.text.split(' ');
					break;
				}
				case 'inline': {
					// @ts-expect-error already checked above
					args = this.update.inline_query.query.split(' ');
					break;
				}
				default:
					break;
			}
			if (args.at(0)?.startsWith('/')) {
				// @ts-expect-error already checked above
				command = args.at(0).slice(1);
			}
			// eslint-disable-next-line
			// @ts-ignore
			if (!this[command] || command === 'on') {
				command = 'default';
			}
			// eslint-disable-next-line
			// @ts-ignore
			return this[command]?.();
		}
		return new Response('ok');
	}

	async reply(message: string) {
		switch (this.update_type) {
			case 'message': {
				await API.sendMessage(this.api.toString(), {
					chat_id: this.update.message?.chat.id.toString() ?? '',
					reply_to_message_id: this.update.message?.message_id.toString() ?? '',
					text: message,
				});
				break;
			}
			case 'inline': {
				await API.answerInline(this.api.toString(), {
					inline_query_id: this.update.inline_query?.id.toString() ?? '',
					results: new TelegramInlineQueryResultArticle(message),
				});
				break;
			}
			default:
				break;
		}
	}
}

class Webhook {
	api: URL;
	webhook: URL;

	constructor(token: string, request: Request) {
		this.api = new URL('https://api.telegram.org/bot' + token);
		this.webhook = new URL(new URL(request.url).origin + `/${token}`);
	}

	async set() {
		const url = new URL(`${this.api.origin}${this.api.pathname}/setWebhook`);
		const params = url.searchParams;
		params.append('url', this.webhook.toString());
		params.append('max_connections', '100');
		params.append('allowed_updates', JSON.stringify(['message', 'inline_query']));
		params.append('drop_pending_updates', 'true');
		return await fetch(`${url}?${params}`);
	}
}
