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

        // 2. Call YOUR laptop via ngrok
        // 🚨 CRITICAL: Replace the link below with your currently active ngrok link!
        // Make sure you keep the /api/chat at the very end.
        const ngrokUrl = 'https://postdysenteric-nasir-nonyielding.ngrok-free.dev -> http://localhost:11434';

        const response = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // Bypasses the 403 Forbidden error
            },
            body: JSON.stringify({
                model: 'phi3', // Upgraded to the faster, lightweight model
                messages: [
                    // The "Brain": Hidden instructions so it remembers your school
                    {
                        role: 'system',
                        content: 'You are the official assistant for Romblon State University - Laboratory Science High School (RSU-LSHS). You help students with questions about the STEM, ABM, and HUMSS strands, school location, and enrollment requirements. Keep your answers concise, friendly, and highly relevant to the school.'
                    },
                    // The actual question from the user
                    {
                        role: 'user',
                        content: message
                    }
                ],
                stream: false
            })
        });

        const data = await response.json();
        
        // 3. Send the AI's reply back to your frontend
        res.status(200).json({ reply: data.message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Local AI server is unreachable. Make sure Ollama and ngrok are running!" });
    }
};