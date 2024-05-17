import TelegramUser from './TelegramUser.js';

type TelegramMessageEntity = {
	type: string;
	offset: number;
	length: number;
	url?: string;
	user?: TelegramUser;
	language?: string;
};
export default TelegramMessageEntity;
