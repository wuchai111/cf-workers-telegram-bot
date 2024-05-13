import { TelegramInlineQueryResultArticle, TelegramUpdate } from './types';
import ExecutionContext from './ctx';
import Webhook from './webhook';

export default class TelegramBot {
	token: string;
	webhook: Webhook;
	api: URL;
	update: TelegramUpdate;
	update_type: string;

	commands: Record<string, (ctx: ExecutionContext) => Promise<Response>> = {};

	constructor(token: string) {
		this.token = token;
		this.webhook = new Webhook('', new Request('http://127.0.0.1'));
		this.api = new URL('https://api.telegram.org/bot' + token);
		this.update = new TelegramUpdate({});
		this.update_type = '';
	}

	on(event: string, callback: (ctx: ExecutionContext) => Promise<Response>) {
		if (event !== 'on') {
			// eslint-disable-next-line
			// @ts-ignore TS7053
			this.commands[event] = callback;
		}
		return this;
	}

	async reply(message: string) {
		switch (this.update_type) {
			case 'message': {
				const request = new URL(this.api + '/sendMessage');
				const params = new URLSearchParams();
				params.append('chat_id', this.update.message?.chat.id.toString() ?? '');
				params.append('reply_to_message_id', this.update.message?.message_id.toString() ?? '');
				params.append('text', message);
				console.log(`${request}?${params}`);
				await fetch(`${request}?${params}`);
				break;
			}
			case 'inline': {
				const inline_request = new URL(this.api + '/answerInlineQuery');
				const inline_params = new URLSearchParams();
				inline_params.append('inline_query_id', this.update.inline_query?.id.toString() ?? '');
				inline_params.append('results', JSON.stringify([new TelegramInlineQueryResultArticle(message)]));
				console.log(`${inline_request}?${inline_params}`);
				await fetch(`${inline_request}?${inline_params}`);
				break;
			}
			default:
				break;
		}
	}

	async handle(request: Request): Promise<Response> {
		this.webhook = new Webhook(this.token, request);
		if (request.method === 'POST') {
			this.update = await request.json();
		} else {
			this.update = new TelegramUpdate({});
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
			let command = 'default';
			let args: string[] = [];
			const ctx = new ExecutionContext(this, this.update);
			switch (ctx.update_type) {
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
			this.commands['any']?.(ctx);
			// eslint-disable-next-line
			// @ts-ignore
			if (!this.commands[command]) {
				command = 'default';
			}
			// eslint-disable-next-line
			// @ts-ignore
			return await this.commands[command]?.(ctx);
		}
		return new Response('ok');
	}
}
