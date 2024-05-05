import { TelegramInlineQueryType } from './TelegramInlineQueryType';

export class TelegramInlineQueryResult {
	type: TelegramInlineQueryType;
	id: string;
	constructor(type: TelegramInlineQueryType) {
		this.type = type;
		this.id = crypto.randomUUID();
	}
}
