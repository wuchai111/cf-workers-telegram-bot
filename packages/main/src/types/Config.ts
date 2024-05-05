import { Command } from './Command';
import { Kv } from './Kv';
import BotApi from '../bot_api';
import Handler from '../handler';
import Webhook from '../webhook';
import { localhost } from './localhost';

export class Config {
	bot_name: string;
	api: typeof BotApi;
	webhook: Webhook;
	commands: Record<string, Command>;
	kv: Kv;
	url: URL;
	handler: Handler;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ai: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	db: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	r2: any;
	chat_model: string;

	constructor(config: Partial<Config> = {}) {
		this.bot_name = config.bot_name || '';
		this.api = config.api || BotApi;
		this.webhook = config.webhook || new Webhook(localhost, '', localhost);
		this.commands = config.commands || {};
		this.kv = config.kv;
		this.url = config.url || new URL(localhost);
		this.handler = config.handler || new Handler([]);
		this.ai = config.ai;
		this.db = config.db;
		this.r2 = config.r2;
		this.chat_model = config.chat_model as string;
	}
}
