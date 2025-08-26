// We are hardcoding variables for the final test.
const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
const ADMIN_ID = "YOUR_ADMIN_ID_HERE";
const TARGET_ID = "YOUR_TARGET_ID_HERE";

// Define interfaces for Telegram updates
interface User { id: number; }
interface Message { message_id: number; from: User; }
interface Update { message?: Message; }

export default {
    async fetch(request: Request): Promise<Response> {
        try {
            if (request.method !== 'POST') {
                return new Response('Expected POST', { status: 405 });
            }

            const body = await request.json<Update>();
            if (!body.message || !body.message.from) {
                return new Response('OK', { status: 200 });
            }

            const message = body.message;
            const senderId = message.from.id;

            // Authorization check using the hardcoded ADMIN_ID
            if (String(senderId) !== ADMIN_ID) {
                return new Response('Forbidden', { status: 403 });
            }

            // Forward the original message using the hardcoded variables
            const forwardUrl = `https://api.telegram.org/bot${BOT_TOKEN}/forwardMessage`;
            const forwardPayload = {
                chat_id: TARGET_ID,
                from_chat_id: senderId,
                message_id: message.message_id,
            };

            await fetch(forwardUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(forwardPayload),
            });

        } catch (e: any) {
            // If there's an error, it will be caught here.
            // We will return a response containing the error message.
            return new Response(`Error: ${e.toString()}`, { status: 500 });
        }

        // Always return a 200 OK to Telegram
        return new Response('OK', { status: 200 });
    },
};
