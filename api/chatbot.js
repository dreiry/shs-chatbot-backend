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
            1. ONLY answer questions using the information in the KNOWLEDGE BASE below. 
            2. If a user asks a question that is NOT covered in the Knowledge Base, DO NOT guess or make up an answer. Instead, reply exactly with: "I'm sorry, I don't have that specific information. Please contact the RSU-LSHS Registrar's Office or visit our official Facebook page for help."
            3. Be conversational, polite, and concise. 
            4. Speak in English, Tagalog, or Taglish depending on how the user speaks to you. Do not translate your answer into both languages.
            5. DO NOT use markdown formatting like asterisks (**). Output plain text only.

            KNOWLEDGE BASE:
            [ENROLLMENT & ADMISSIONS]
            - Upcoming School Year: 2026-2027
            - General Admission Requirements: Form 137, Form 138, and Certificate of Good Moral Character.
            - Entrance Exam: Applicants must take and pass a specific LSHS entrance exam.
            - Admission Quota: A maximum of around 700 students are accepted per year.

            [ACADEMICS & STRANDS]
            - Senior High School Strands Offered: STEM (Science, Technology, Engineering, and Mathematics), ABM (Accountancy, Business, and Management), HUMSS (Humanities and Social Sciences), and GAS (General Academic Strand).
            - Grade levels: Senior High School (Grade 11 and Grade 12).
            - Retention Policy: Students must maintain a minimum grade of 85 to stay enrolled.

            [SCHOOL INFO & POLICIES]
            - Location: Romblon State University, Liwanag, Odiongan, Romblon.
            - Tuition & Fees: Free tuition and free laboratories. Miscellaneous fees apply only for items like the school uniform.
            - Academic Calendar: Follows the RSU college academic calendar rather than the standard DepEd calendar.
            - Dress Code: No official uniform is required at this time. Students must wear a plain white shirt, pants (no shorts allowed), and closed shoes.
            - Facilities: LSHS students are allowed to use the university gymnasium, field, and library.
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