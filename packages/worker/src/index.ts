interface Env {
  BOT_TOKEN: string;
  TARGET_ID: string;
  ADMIN_ID: string;
}
interface Message {
  message_id: number;
  from: { id: number; };
}
interface Update {
  message?: Message;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST') {
      const update = await request.json<Update>();
      if (update.message && update.message.from) {
        if (String(update.message.from.id) === env.ADMIN_ID) {
          await forwardMessage(env, update.message);
        }
      }
    }
    return new Response('OK');
  },
};

async function forwardMessage(env: Env, message: Message) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/forwardMessage`;
  const payload = {
    chat_id: env.TARGET_ID,
    from_chat_id: message.from.id,
    message_id: message.message_id,
  };
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
