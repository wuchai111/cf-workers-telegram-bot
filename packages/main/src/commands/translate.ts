import TelegramBot from '../telegram_bot';
import { TelegramUpdate, TelegramInlineQueryResultArticle } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate, args: string[]): Promise<Response> => {
	if (self.ai === undefined) {
		return new Response('ok');
	}
	let _prompt: string;
	if (args[0][0] === '/') {
		_prompt = args.slice(1).join(' ');
	} else {
		_prompt = args.join(' ');
	}
	if (_prompt === '') {
		_prompt = '';
	}
	const langs = ['french'];
	const inline_articles = await Promise.all(
		langs.map(async (lang) => {
			const response = await self.ai.run('@cf/meta/m2m100-1.2b', {
				text: _prompt,
				source_lang: lang,
				target_lang: 'english',
			});
			return new TelegramInlineQueryResultArticle(response.translated_text as string, response.translated_text);
		}),
	);
	return self.answerInlineQuery(update.inline_query?.id ?? 0, inline_articles);
};
