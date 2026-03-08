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
            systemInstruction: `You are the official AI assistant for Romblon State University - Laboratory Science High School (RSU-LSHS). 
            
            CORE RULES:
            1. Speak naturally. Respond in the same language the user uses (English, Tagalog, or Taglish). DO NOT translate your answers into both languages.
            2. Keep your answers concise, direct, and easy to read. Use bullet points if listing items.
            3. Never guess or make up dates. If you don't know the exact answer to a specific question, politely tell the user to check the official RSU-LSHS Facebook page or visit the Registrar's office.

            KNOWLEDGE BASE (Use this data to answer questions):
            - Upcoming School Year: 2026-2027
            - General Admission Requirements: PSA Birth Certificate (Original & Photocopy), Form 138 (Report Card), Certificate of Good Moral Character, 2x2 ID Pictures, and a Photocopy of the Parent/Guardian's Valid ID.
            - Enrollment Schedule: Usually announced around May to July via the official Facebook page.
            - Entrance Exam: Required for incoming Grade 7 students.
            `,
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