const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
    // CORS Setup: Ito ang nag-aallow sa GitHub Pages mo na kumausap sa Vercel backend mo
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are the official AI assistant for Romblon State University - Laboratory Science High School. Answer questions about the school, curriculum, and admissions helpfully and accurately in English and Tagalog.",
        });

        const { message } = req.body;
        const result = await model.generateContent(message);
        const text = result.response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error("API Error:", error);
        // This sends the exact Google rejection reason straight to your frontend
        res.status(500).json({ error: `Google API Error: ${error.message}` });
    }
};