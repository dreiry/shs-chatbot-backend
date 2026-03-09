module.exports = async function handler(req, res) {
    // 1. CORS Setup (Allows your frontend to talk to this backend)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { message } = req.body;

        // 2. Call YOUR laptop via ngrok instead of Google Gemini
        const response = await fetch('https://postdysenteric-nasir-nonyielding.ngrok-free.dev/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // This fixes the 403 Forbidden error!
            },
            body: JSON.stringify({
                model: 'llama3',
                messages: [
                    // This is the hidden instruction only the bot sees
                    { 
                        role: 'system', 
                        content: 'You are the official chatbot for Romblon State University - Laboratory Science High School (RSU-LSHS). You answer questions about STEM, ABM, and HUMSS strands, and enrollment requirements. Be concise.' 
                    },
                    // This is the actual question from the user
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                stream: false // Waits for the full message before replying
            })
        });

        const data = await response.json();
        
        // 3. Send Llama 3's reply back to your frontend
        res.status(200).json({ reply: data.message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Local AI server is unreachable. Make sure Ollama and ngrok are running!" });
    }
};