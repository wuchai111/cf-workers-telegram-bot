import TelegramExecutionContext from '../../main/src/ctx';
import TelegramBot from '../../main/src/telegram_bot';

export interface Environment {
	SECRET_TELEGRAM_API_TOKEN: string;
	SECRET_TELEGRAM_API_TOKEN2: string;
	SECRET_TELEGRAM_API_TOKEN3: string;
	AI: Ai;
	DB: D1Database;
	R2: R2Bucket;
}

type promiseFunc<T> = (resolve: (result: T) => void, reject: (e?: Error) => void) => Promise<T>;

function wrapPromise<T>(func: promiseFunc<T>, time = 1000) {
	return new Promise((resolve, reject) => {
		return setTimeout(() => {
			func(resolve, reject);
		}, time);
	});
}

export default {
	fetch: async (request: Request, env: Environment, ctx: ExecutionContext) => {
		const bot = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN);
		const bot2 = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN2);
		const bot3 = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN3);
		await Promise.all([
			bot
				.on('photo', async function (context: TelegramExecutionContext) {
					switch (context.update_type) {
						case 'message': {
							const prompt = context.update.message?.text?.toString() ?? '';
							const photo = await env.AI.run('@cf/lykon/dreamshaper-8-lcm', { prompt });
							const photo_file = new File([await new Response(photo).blob()], 'photo');
							const id = crypto.randomUUID();
							await env.R2.put(id, photo_file);
							await context.replyPhoto(`https://r2.seanbehan.ca/${id}`);
							ctx.waitUntil(wrapPromise(async () => await env.R2.delete(id), 5000));
							break;
						}
						case 'inline': {
							const prompt = context.update.inline_query?.query.toString().split(' ').slice(1).join(' ') ?? '';
							const photo = await env.AI.run('@cf/lykon/dreamshaper-8-lcm', { prompt });
							const photo_file = new File([await new Response(photo).blob()], 'photo');
							const id = crypto.randomUUID();
							await env.R2.put(id, photo_file);
							await context.replyPhoto(`https://r2.seanbehan.ca/${id}`);
							ctx.waitUntil(wrapPromise(async () => await env.R2.delete(id), 5000));
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.on('clear', async function (context: TelegramExecutionContext) {
					switch (context.update_type) {
						case 'message':
							await env.DB.prepare('DELETE FROM Messages WHERE userId=?').bind(context.update.message?.from.id).run();
							await context.reply('history cleared');
							break;

						default:
							break;
					}
					return new Response('ok');
				})
				.on('default', async function (context: TelegramExecutionContext) {
					switch (context.update_type) {
						case 'message': {
							const prompt = context.update.message?.text?.toString() ?? '';
							const { results } = await env.DB.prepare('SELECT * FROM Messages WHERE userId=?')
								.bind(context.update.inline_query ? context.update.inline_query.from.id : context.update.message?.from.id)
								.all();
							const message_history = results.map((col) => ({ role: 'system', content: col.content as string }));
							const messages = [
								...message_history,
								{
									role: 'user',
									content: prompt,
								},
							];
							const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });
							if ('response' in response) {
								await context.reply(response.response ?? '');
							}
							await env.DB.prepare('INSERT INTO Messages (id, userId, content) VALUES (?, ?, ?)')
								.bind(
									crypto.randomUUID(),
									context.update.inline_query ? context.update.inline_query.from.id : context.update.message?.from.id,
									'[INST] ' + prompt + ' [/INST]' + '\n' + response,
								)
								.run();
							break;
						}
						case 'inline': {
							const inline_messages = [
								{ role: 'system', content: 'You are a friendly assistant' },
								{
									role: 'user',
									content: context.update.inline_query?.query.toString() ?? '',
								},
							];
							const inline_response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages: inline_messages, max_tokens: 50 });
							if ('response' in inline_response) {
								await context.reply(inline_response.response ?? '');
							}
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.handle(request.clone()),
			bot2
				.on('default', async function (context: TelegramExecutionContext) {
					switch (context.update_type) {
						case 'message': {
							await context.reply('https://duckduckgo.com/?q=' + encodeURIComponent(context.update.message?.text?.toString() ?? ''));
							break;
						}
						case 'inline': {
							await context.reply('https://duckduckgo.com/?q=' + encodeURIComponent(context.update.inline_query?.query ?? ''));
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.handle(request.clone()),
			bot3
				.on('default', async function (context: TelegramExecutionContext) {
					switch (context.update_type) {
						case 'inline': {
							const translated_text = await fetch(
								'https://clients5.google.com/translate_a/t?client=at&sl=auto&tl=en&q=' +
									encodeURIComponent(bot3.update.inline_query?.query.toString() ?? ''),
							)
								.then((r) => r.json())
								.then((json) => (json as [string[]])[0].slice(0, -1).join(' '));
							await context.reply(translated_text ?? '');
							break;
						}

						default:
							break;
					}

					return new Response('ok');
				})
				.handle(request.clone()),
		]);

		return new Response('ok');
	},
};
