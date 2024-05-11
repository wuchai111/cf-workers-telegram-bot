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

	on = (event: string, callback: () => Promise<Response>) => {
		// eslint-disable-next-line
		// @ts-ignore TS7053
		this[event] = callback;
		return this;
	};

	handle = async (request: Request) => {
		this.webhook = new Webhook(this.token, request);
		this.update = await request.json();
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
				case 'message':
					// @ts-expect-error already checked above
					args = this.update.message.text.split(' ');
					break;
				case 'inline':
					// @ts-expect-error already checked above
					args = this.update.inline_query.query.split(' ');
					break;
				default:
					break;
			}
			if (args.at(0)?.startsWith('/')) {
				// @ts-expect-error already checked above
				command = args.at(0).slice(1);
			}
			// eslint-disable-next-line
			// @ts-ignore
			return this[command]?.();
		}
		return new Response('ok');
	};

	reply = async (message: string) => {
		switch (this.update_type) {
			case 'message':
				const request = new URL(this.api + '/sendMessage');
				const params = new URLSearchParams();
				params.append('chat_id', this.update.message?.chat.id.toString() ?? '');
				params.append('reply_to_message_id', this.update.message?.message_id.toString() ?? '');
				params.append('text', message);
				console.log(`${request}?${params}`);
				await fetch(`${request}?${params}`);
				break;
			case 'inline':
				const inline_request = new URL(this.api + '/answerInlineQuery');
				const inline_params = new URLSearchParams();
				inline_params.append('inline_query_id', this.update.inline_query?.id.toString() ?? '');
				inline_params.append('results', JSON.stringify([new TelegramInlineQueryResultArticle(message)]));
				console.log(`${inline_request}?${inline_params}`);
				await fetch(`${inline_request}?${inline_params}`);
				break;
			default:
				break;
		}
	};
}

class Webhook {
	api: URL;
	webhook: URL;

	constructor(token: string, request: Request) {
		this.api = new URL('https://api.telegram.org/bot' + token);
		this.webhook = new URL(new URL(request.url).origin + `/${token}`);
	}

	set = async () => {
		const url = new URL(`${this.api.origin}${this.api.pathname}/setWebhook`);
		const params = url.searchParams;
		params.append('url', this.webhook.toString());
		params.append('max_connections', '100');
		params.append('allowed_updates', JSON.stringify(['message', 'inline_query']));
		params.append('drop_pending_updates', 'true');
		return await fetch(`${url}?${params}`);
	};
}
