<h3 align="center">
<img src="https://raw.githubusercontent.com/codebam/cf-workers-telegram-bot/main/assets/logo.png" width="100" />
<br/>
CF workers telegram bot
<br/>
</h3>

<h6 align="center">
<a href="https://github.com/codebam/cf-workers-telegram-bot/wiki">Wiki</a>
 · 
<a  href="https://codebam.github.io/cf-workers-telegram-bot-docs/">Docs</a>
</h6>

<p  align="center">
<a href="https://github.com/codebam/cf-workers-telegram-bot/stargazers">  <img src="https://img.shields.io/github/stars/codebam/cf-workers-telegram-bot?style=for-the-badge&logo=starship&color=111111&logoColor=ffffff&labelColor=000000" alt="GitHub stars"/></a>
<a href="https://github.com/codebam/cf-workers-telegram-bot/issues">
  <img src="https://img.shields.io/github/issues/codebam/cf-workers-telegram-bot?style=for-the-badge&logo=gitbook&color=111111&logoColor=ffffff&labelColor=000000" alt="GitHub issues"/></a>
<a href="https://github.com/codebam/cf-workers-telegram-bot">  <img src="https://img.shields.io/github/forks/codebam/cf-workers-telegram-bot?style=for-the-badge&logo=git&color=111111&logoColor=ffffff&labelColor=000000" alt="GitHub forks"/></a>
<a href="https://www.npmjs.com/package/rayous">  <img src="https://img.shields.io/npm/v/rayous?style=for-the-badge&logo=npm&color=111111&logoColor=ffffff&labelColor=000000" alt="npm version" /></a>
</p>

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
