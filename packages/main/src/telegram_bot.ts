export default class TelegramBot {
	token: string;
	webhook: Webhook;

	constructor(token: string) {
		this.token = token;
		this.webhook = new Webhook('', new Request('http://127.0.0.1'));
	}

	on = (event: string, callback: BotCallback) => {
		// this[event] = callback;
		return this;
	};

	handle = (request: Request) => {
		this.webhook = new Webhook(this.token, request);
		const url = new URL(request.url);
		if (`/${this.token}` === url.pathname && url.searchParams.get('command') === 'set') {
			return this.webhook.set();
		}
		return new Response('ok');
	};
}
type BotCallback = () => Response;

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
