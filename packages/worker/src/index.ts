export default {
    async fetch(request: Request): Promise<Response> {
        
        if (request.method === 'POST') {
            try {
                const body = await request.json();
                
                // Log the entire message structure from Telegram
                console.log("--- MESSAGE DETECTED ---");
                console.log(JSON.stringify(body, null, 2)); 
                
            } catch (e: any) {
                console.error("Error parsing body:", e.toString());
            }
        }
        
        // Always return a 200 OK to Telegram
        return new Response('OK', { status: 200 });
    },
};
