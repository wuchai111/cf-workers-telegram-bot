interface Env {
    BOT_TOKEN: string;
    TARGET_ID: string;
    ADMIN_ID: string;
}

// Helper function to send a message back to the admin
async function sendMessage(token: string, chatId: string, text: string) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: `[Worker Status]\n${text}`,
    };
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // This script ONLY checks variables and sends a status report.

        let report = "";

        if (env.BOT_TOKEN) {
            report += "✅ BOT_TOKEN is loaded.\n";
        } else {
            report += "❌ ERROR: BOT_TOKEN is MISSING!\n";
        }

        if (env.ADMIN_ID) {
            report += `✅ ADMIN_ID is loaded. Value: ${env.ADMIN_ID}\n`;
        } else {
            report += "❌ ERROR: ADMIN_ID is MISSING!\n";
        }

        if (env.TARGET_ID) {
            report += `✅ TARGET_ID is loaded. Value: ${env.TARGET_ID}\n`;
        } else {
            report += "❌ ERROR: TARGET_ID is MISSING!\n";
        }

        // Try to send the report to the configured ADMIN_ID
        if (env.BOT_TOKEN && env.ADMIN_ID) {
            await sendMessage(env.BOT_TOKEN, env.ADMIN_ID, report);
        }

        return new Response('Variable check complete.', { status: 200 });
    },
};
