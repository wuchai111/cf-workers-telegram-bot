import TelegramBot from '../telegram_bot';
import { TelegramUpdate, Joke, TelegramInlineQueryResultArticle } from '../types';

export default async (self: TelegramBot, update: TelegramUpdate): Promise<Response> =>
	fetch('https://v2.jokeapi.dev/joke/Any?safe-mode')
		.then((response) => response.json())
		.then((joke) => joke as Joke)
		.then((joke_response) =>
			((message) =>
				update.inline_query
					? self.answerInlineQuery(
							update.inline_query.id,
							[new TelegramInlineQueryResultArticle(message, joke_response.joke ?? joke_response.setup, 'HTML')],
							0,
						)
					: self.sendMessage(update.message?.chat.id ?? 0, message, 'HTML'))(
				joke_response.joke ?? `${joke_response.setup}\n\n<tg-spoiler>${joke_response.delivery}</tg-spoiler>`,
			),
		);
