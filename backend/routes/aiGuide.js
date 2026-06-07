const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/chat', async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are Nirvaha AI, a warm wellness assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm here to help. Could you rephrase that?";
    res.json({ reply });

  } catch (error) {
    console.error('AI Guide error:', error);
    res.status(500).json({ error: 'AI service unavailable', reply: "I'm having a moment — please try again shortly 🙏" });
  }
});

module.exports = router;
