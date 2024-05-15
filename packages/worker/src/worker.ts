import TelegramExecutionContext from '../../main/src/ctx';
import TelegramBot from '../../main/src/telegram_bot';
import { marked } from 'marked';

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

async function markdown_to_html(s: string) {
	const parsed = await marked.parse(s);
	return parsed.replace(/<p>/g, '').replace(/<\/p>/g, '');
}

export default {
	fetch: async (request: Request, env: Environment, ctx: ExecutionContext) => {
		const tuxrobot = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN);
		const duckduckbot = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN2);
		const translatepartybot = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN3);
		await Promise.all([
			tuxrobot
				.on('code', async function (bot: TelegramExecutionContext) {
					switch (bot.update_type) {
						case 'message': {
							const prompt = bot.update.message?.text?.toString().split(' ').slice(1).join(' ') ?? '';
							const messages = [{ role: 'user', content: prompt }];
							let response: AiTextGenerationOutput;
							try {
								response = await env.AI.run('@hf/thebloke/deepseek-coder-6.7b-instruct-awq', { messages });
							} catch (e) {
								console.log(e);
								await bot.reply(`Error: ${e}`);
								return new Response('ok');
							}
							if ('response' in response) {
								await bot.reply(await markdown_to_html(response.response ?? ''), 'HTML');
							}
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.on(':photo', async function (bot: TelegramExecutionContext) {
					const file_id = bot.update.message?.photo?.pop()?.file_id;
					const blob = await bot.getFile(file_id as string);
					const input = {
						image: [...new Uint8Array(blob)],
						prompt: 'Generate a caption for this image',
						max_tokens: 512,
					};
					let response: AiImageToTextOutput;
					try {
						response = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', input);
					} catch (e) {
						console.log(e);
						await bot.reply(`Error: ${e}`);
						return new Response('ok');
					}
					await bot.replyPhoto(file_id as string, response.description);
					return new Response('ok');
				})
				.on('photo', async function (bot: TelegramExecutionContext) {
					switch (bot.update_type) {
						case 'message': {
							const prompt = bot.update.message?.text?.toString() ?? '';
							let photo: AiTextToImageOutput;
							try {
								photo = await env.AI.run('@cf/lykon/dreamshaper-8-lcm', { prompt });
							} catch (e) {
								console.log(e);
								await bot.reply(`Error: ${e}`);
								return new Response('ok');
							}
							const photo_file = new File([await new Response(photo).blob()], 'photo');
							const id = crypto.randomUUID();
							await env.R2.put(id, photo_file);
							await bot.replyPhoto(`https://r2.seanbehan.ca/${id}`);
							ctx.waitUntil(wrapPromise(async () => await env.R2.delete(id), 500));
							break;
						}
						case 'inline': {
							const prompt = bot.update.inline_query?.query.toString().split(' ').slice(1).join(' ') ?? '';
							let photo: AiTextToImageOutput;
							try {
								photo = await env.AI.run('@cf/lykon/dreamshaper-8-lcm', { prompt });
							} catch (e) {
								console.log(e);
								await bot.reply(`Error: ${e}`);
								return new Response('ok');
							}
							const photo_file = new File([await new Response(photo).blob()], 'photo');
							const id = crypto.randomUUID();
							await env.R2.put(id, photo_file);
							await bot.replyPhoto(`https://r2.seanbehan.ca/${id}`);
							ctx.waitUntil(wrapPromise(async () => await env.R2.delete(id), 500));
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.on('clear', async function (bot: TelegramExecutionContext) {
					switch (bot.update_type) {
						case 'message':
							await env.DB.prepare('DELETE FROM Messages WHERE userId=?').bind(bot.update.message?.from.id).run();
							await bot.reply('history cleared');
							break;

						default:
							break;
					}
					return new Response('ok');
				})
				.on('default', async function (bot: TelegramExecutionContext) {
					switch (bot.update_type) {
						case 'message': {
							const prompt = bot.update.message?.text?.toString() ?? '';
							const { results } = await env.DB.prepare('SELECT * FROM Messages WHERE userId=?')
								.bind(bot.update.inline_query ? bot.update.inline_query.from.id : bot.update.message?.from.id)
								.all();
							const message_history = results.map((col) => ({ role: 'system', content: col.content as string }));
							const messages = [
								...message_history,
								{
									role: 'user',
									content: prompt,
								},
							];
							let response: AiTextGenerationOutput;
							try {
								response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages, max_tokens: 150 });
							} catch (e) {
								console.log(e);
								await bot.reply(`Error: ${e}`);
								return new Response('ok');
							}
							if ('response' in response) {
								await bot.reply(await markdown_to_html(response.response ?? ''), 'HTML');
							}
							await env.DB.prepare('INSERT INTO Messages (id, userId, content) VALUES (?, ?, ?)')
								.bind(
									crypto.randomUUID(),
									bot.update.inline_query ? bot.update.inline_query.from.id : bot.update.message?.from.id,
									`'[INST] ${prompt} [/INST] \n ${response}`,
								)
								.run();
							break;
						}
						case 'inline': {
							const messages = [
								{
									role: 'user',
									content: bot.update.inline_query?.query.toString() ?? '',
								},
							];
							let response: AiTextGenerationOutput;
							try {
								response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages, max_tokens: 100 });
							} catch (e) {
								console.log(e);
								await bot.reply(`Error: ${e}`);
								return new Response('ok');
							}
							if ('response' in response) {
								await bot.reply(response.response ?? '');
							}
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.handle(request.clone()),
			duckduckbot
				.on('default', async function (bot: TelegramExecutionContext) {
					switch (bot.update_type) {
						case 'message': {
							await bot.reply('https://duckduckgo.com/?q=' + encodeURIComponent(bot.update.message?.text?.toString() ?? ''));
							break;
						}
						case 'inline': {
							await bot.reply('https://duckduckgo.com/?q=' + encodeURIComponent(bot.update.inline_query?.query ?? ''));
							break;
						}

						default:
							break;
					}
					return new Response('ok');
				})
				.handle(request.clone()),
			translatepartybot
				.on('default', async function (bot: TelegramExecutionContext) {
					switch (bot.update_type) {
						case 'inline': {
							const translated_text = await fetch(
								'https://translate.googleapis.com/translate_a/single?sl=auto&tl=en&dt=t&dj=1&prev=input&ie=utf-8&oe=utf-8&client=gtx&q=' +
									encodeURIComponent(bot.update.inline_query?.query.toString() ?? ''),
							)
								.then((r) => r.json())
								.then((json) => (json as { sentences: [{ trans: string; orig: string; backend: number }] }).sentences[0].trans);
							await bot.reply(translated_text ?? '');
							break;
						}
						case 'message':
							await bot.reply('Use me in inline mode by typing @TranslatePartyBot and the text you want to translate.');
							break;

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
