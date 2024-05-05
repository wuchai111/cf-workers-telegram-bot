import TelegramBot from '../telegram_bot';
import { TelegramUpdate } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate, args: string[]): Promise<Response> => {
	let _prompt: string;
	if (args[0][0] === '/') {
		_prompt = args.slice(1).join(' ');
	} else {
		_prompt = args.join(' ');
	}
	if (_prompt === '') {
		_prompt = '';
	}
	const inputs = { prompt: _prompt, num_steps: 20 };
	await self.sendMessage(update.message?.chat.id ?? 0, 'image is processing. please wait...');
	const response = await self.ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);
	const id = crypto.randomUUID();
	await self.r2.put(id, response);
	const url = 'https://r2.seanbehan.ca/' + id;
	return self.sendPhoto(update.message?.chat.id ?? 0, url);
};
