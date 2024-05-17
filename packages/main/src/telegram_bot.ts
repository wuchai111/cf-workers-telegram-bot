import { TelegramUpdate } from './types.js';
import TelegramExecutionContext from './telegram_execution_context.js';
import Webhook from './webhook.js';

export default class TelegramBot {
	token: string;
	api: URL;
	webhook: Webhook = new Webhook('', new Request('http://127.0.0.1'));
	update: TelegramUpdate = new TelegramUpdate({});
	commands: Record<string, (ctx: TelegramExecutionContext) => Promise<Response>> = {};
	currentContext!: TelegramExecutionContext;

	constructor(token: string) {
		this.token = token;
		this.api = new URL('https://api.telegram.org/bot' + token);
	}

	on(event: string, callback: (ctx: TelegramExecutionContext) => Promise<Response>) {
		if (['on', 'handle'].indexOf(event) === -1) {
			this.commands[event] = callback;
		}
		return this;
	}

	async handle(request: Request): Promise<Response> {
		this.webhook = new Webhook(this.token, request);
		const url = new URL(request.url);
		if (`/${this.token}` === url.pathname) {
			switch (request.method) {
				case 'POST': {
					this.update = await request.json();
					console.log(this.update);
					let command = 'default';
					let args: string[] = [];
					const ctx = new TelegramExecutionContext(this, this.update);
					this.currentContext = ctx;
					switch (ctx.update_type) {
						case 'message': {
							args = this.update.message?.text?.split(' ') ?? [];
							break;
						}
						case 'inline': {
							args = this.update.inline_query?.query.split(' ') ?? [];
							break;
						}
						case 'photo': {
							command = ':photo';
							break;
						}
						default:
							break;
					}
					if (args.at(0)?.startsWith('/')) {
						command = args.at(0)?.slice(1) ?? 'default';
					}
					this.commands['any']?.(ctx);
					if (!this.commands[command]) {
						command = 'default';
					}
					return await this.commands[command]?.(ctx);
				}
				case 'GET': {
					switch (url.searchParams.get('command')) {
						case 'set':
							return this.webhook.set();

						default:
							break;
					}
					break;
				}

				default:
					break;
			}
		}
		return new Response('ok');
	}
}
