export class WebhookCommands {
	[key: string]: () => Promise<Response>;
}
