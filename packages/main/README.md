# cf-workers-telegram-bot

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/codebam/cf-workers-telegram-bot)

![screenshot of cf-workers-telegram-bot](/screenshot.png)

serverless telegram bot on cf workers

To get continuous conversation with AI working make sure you add a database
to your wrangler.toml and initailize it with the schema.sql

```sh
npm i @codebam/cf-workers-telegram-bot
```

See `worker.ts` and follow the instructions below.

---

To use the deploy button:

- Click the deploy button
- Navigate to your new **GitHub repository &gt; Settings &gt; Secrets** and add the following secrets:

  ```yaml
  - Name: CLOUDFLARE_API_TOKEN  (should be added automatically)
  - Name: CLOUDFLARE_ACCOUNT_ID (should be added automatically)

  - Name: SECRET_TELEGRAM_API_TOKEN
  - Value: your-telegram-bot-token
  ```

- Push to `master` to trigger a deploy

To fork this repo and use wrangler:

- Click fork
- `npm i -g wrangler`
- `wrangler secret put SECRET_TELEGRAM_API_TOKEN` and set it to your telegram
  bot token
- `wrangler d1 create llama2`
- put the database block from the command in your wrangler.toml
- `wrangler d1 execute --remote llama2 --file ./schema.sql`
- `wrangler deploy`
- Done!

## Getting started with cf-workers-telegram-bot

Once you've deployed the bot you can get your Webhook command URL by calling `await bot.webhook.set()`
