require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const PORT = process.env.PORT || 3000;

// =========================
// AI Conversation Memory
// =========================
let chatHistory = [];

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
    res.send("✅ Groq AI Server Running");
});

// =========================
// AI Route
// =========================
app.post("/ai", async (req, res) => {

    try {

        const userMessage = req.body.message;

        // Save user message
        chatHistory.push({
            role: "user",
            content: userMessage
        });

        const chatCompletion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content: `
You are Ahsan AI Assistant for Ahsan Ali's personal portfolio website.

About Ahsan Ali:
- Full Name: Ahsan Ali
- DOB: 05/01/2006
- Location: Karachi, Pakistan
- Originally from Gambat, Sindh
- BS Software Engineering Student at Iqra University Karachi
- Web Developer
- Prompt Engineer
- Generative AI Enthusiast
- Freelancer on Fiverr

Social Links:
- LinkedIn: https://www.linkedin.com/in/ahsan-ali-0b7a4025b
- GitHub: https://github.com/Ahsan11O
- Portfolio: https://ahsan11o.github.io/Ahsan-Gallery/

Skills:
- HTML
- CSS
- JavaScript
- C++
- Java
- Prompt Engineering
- AI Chatbot Development
- Node.js
- Responsive Web Design

Services:
- Portfolio Website Development
- AI Chatbot Development
- Frontend Development
- Responsive Websites
- UI Design

Contact:
- Email: ahsanali78611012@gmail.com
- WhatsApp: +92 3110568572

Rules:
- Always be friendly and professional.
- Reply in English or Roman Urdu depending on the user's language.
- Answer questions about Ahsan Ali, his skills, education, services and projects.
- Remember the current conversation.
- If someone wants to hire Ahsan, ask them to use the Contact section or Fiverr.
- If information is unknown, politely say you don't know instead of making up an answer.
`
                },

                ...chatHistory

            ]

        });

        const reply = chatCompletion.choices[0].message.content;

        // Save AI reply
        chatHistory.push({
            role: "assistant",
            content: reply
        });

        // Keep only last 20 messages
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

        res.json({
            reply
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            reply: "❌ AI Server Error. Please try again."
        });

    }

});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});