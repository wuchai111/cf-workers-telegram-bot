import { TelegramUser } from './TelegramUser';

export type TelegramMessageEntity = {
	type: string;
	offset: number;
	length: number;
	url?: string;
	user?: TelegramUser;
	language?: string;
};
