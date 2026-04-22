module.exports = async function handler(req, res) {
    // 1. CORS Setup
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
        const userText = message.toLowerCase().trim();

        // ==========================================
        // 2. THE INSTANT DATA FILE
        // ==========================================
        const fastAnswers = {
            "enrollment requirements": "For the upcoming school year, the general admission requirements are:\n- PSA Birth Certificate (Original & Photocopy)\n- Form 138 (Report Card)\n- Certificate of Good Moral Character\n- 2x2 ID Pictures",
            "enrollment deadline": "The enrollment deadline is usually two weeks before the official start of the school year. Please check our official Facebook pages for exact dates.",
            "entrance exam": "Yes, applicants must take and pass the LSHS entrance exam. Details regarding registration are posted on our official Facebook pages.",
            "tuition fee": "While public schools generally have no tuition fee, there is a miscellaneous fee of around ₱3,000 per semester, which may vary slightly depending on your chosen strand.",
            "transfer student": "Yes, transferees are accepted! You will need to submit your latest grade slip (Form 138) along with a Certificate of Good Moral Character for evaluation.",
            "available strands": "RSU-LSHS proudly offers STEM, ABM, HUMSS, and the General Academic Strand (GAS).",
            "stem subjects": "The STEM strand includes core subjects alongside specialized mathematics and science courses such as Pre-Calculus, Basic Calculus, General Physics, and General Biology.",
            "abm subjects": "The ABM strand focuses on business and finance, featuring specialized subjects like Fundamentals of Accountancy, Business Math, and Principles of Marketing.",
            "humss subjects": "The HUMSS strand focuses on social sciences and communication, with specialized subjects such as Philippine Politics, Creative Writing, and Ideas in the Social Sciences.",
            "other strands": "Aside from STEM, ABM, and HUMSS, we also offer the General Academic Strand (GAS).",
            "class hours": "Due to limited room availability, class schedules run in shifts ranging from 5:30 AM to 8:00 PM. Your exact class hours will depend on your specific section.",
            "school calendar": "The official start of classes usually aligns with the national academic calendar. Please monitor our Facebook pages for the exact start date.",
            "school uniform": "The standard school uniform consists of a white polo/shirt, proper pants, and closed shoes. Detailed uniform guidelines will be provided during enrollment.",
            "school location": "Romblon State University - Laboratory Science High School is located at the main campus in Odiongan, Romblon.",
            "facebook page": "You can follow our official announcements on the 'RSU-LSHS Student Government' Facebook page, or check out 'The Harrow' for our campus journal!"
        };

        if (fastAnswers[userText]) {
            return res.status(200).json({ reply: fastAnswers[userText] });
        }

        // ==========================================
        // 3. THE HEAVY AI (Fallback to your laptop)
        // ==========================================
        // 🚨 CRITICAL: Update this ngrok link every time you restart ngrok!
        const ngrokUrl = 'https://postdysenteric-nasir-nonyielding.ngrok-free.dev -> http://localhost:11434/api/chat';

        const response = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                model: 'phi3', 
                messages: [
                    {
                        role: 'system',
                        content: 'You are the official assistant for Romblon State University - Laboratory Science High School (RSU-LSHS). You help students with questions about the STEM, ABM, and HUMSS strands, school location, and enrollment requirements. Keep your answers concise, friendly, and highly relevant to the school.'
                    },
                    { role: 'user', content: message }
                ],
                stream: false
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Local AI server is unreachable. Make sure Ollama and ngrok are running!" });
    }
};