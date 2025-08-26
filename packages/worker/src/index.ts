// Define the structure for the environment variables Cloudflare will provide
interface Env {
  BOT_TOKEN: string;
  TARGET_ID: string;
  ADMIN_ID: string;
}

// Define the structure of an incoming Telegram message
interface Message {
  message_id: number;
  from: {
    id: number;
  };
}

// Define the structure of the overall update from Telegram
interface Update {
  message?: Message;
}

// This is the main function that runs when the bot receives a message
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Only respond to POST requests from Telegram's webhook
    if (request.method === 'POST') {
      const update = await request.json<Update>();
      // Check if the update is a valid message and has a sender
      if (update.message && update.message.from) {
        // Run the main logic for handling the update
        await handleUpdate(update, env);
      }
    }
    // Always return a 200 OK response to Telegram
    return new Response('OK', { status: 200 });
  },
};

// This function contains the bot's core logic
async function handleUpdate(update: Update, env: Env) {
  const message = update.message!;
  const senderId = String(message.from.id); // Get the sender's ID as a string
  const adminId = env.ADMIN_ID; // Get the configured Admin ID

  // --- Authorization Check ---
  // If the message is from the authorized admin, forward it
  if (senderId === adminId) {
    await forwardMessage(env.BOT_TOKEN, env.TARGET_ID, message);
  }
}

// This function calls the Telegram API to forward the message
async function forwardMessage(botToken: string, targetId: string, message: Message) {
  const url = `https://api.telegram.org/bot${botToken}/forwardMessage`;
  const payload = {
    chat_id: targetId,
    from_chat_id: message.from.id,
    message_id: message.message_id,
  };

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
