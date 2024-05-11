import { WebhookCommands } from './types';

export default class Webhook {
	api: URL;
	token: string;
	url: URL;
	commands: WebhookCommands;

	constructor(api: URL, token: string, url: URL) {
		this.api = api;
		this.token = token;
		this.url = url;
		this.commands = {
			default: async () => new Response('Invalid command'),
		};
	}

	process = async (url: URL): Promise<Response> => this.commands[url.searchParams.get('command') ?? '']?.() ?? this.commands.default();
}
