import TelegramBot from '../../main/src/telegram_bot';

interface Environment {
	SECRET_TELEGRAM_API_TOKEN: string;
	KV_GET_SET: KVNamespace;
	KV_UID_DATA: KVNamespace;

	SECRET_TELEGRAM_API_TOKEN2: string;

	SECRET_TELEGRAM_API_TOKEN3: string;

	SECRET_TELEGRAM_API_TOKEN4: string;

	SECRET_TELEGRAM_API_TOKEN5: string;

	AI: Ai;

	DB: D1Database;

	R2: R2Bucket;

	CHAT_MODEL: string;
}

export default {
	fetch: async (request: Request, env: Environment) => {
		const bot = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN);
		return bot
			.on('default', async () => {
				await bot.reply('ok');
				return new Response('ok');
			})
			.on('b', async () => new Response('ok'))
			.on('c', async () => new Response('ok'))
			.on('d', async () => new Response('ok'))
			.handle(request);
	},
};
