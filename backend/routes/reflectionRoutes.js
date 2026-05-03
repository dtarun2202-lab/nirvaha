const express = require('express');
const { Groq } = require('groq-sdk');
const Reflection = require('../models/Reflection');
const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * @route   POST /api/reflect
 * @desc    Generate a calm, supportive AI response to user reflection
 * @access  Public (or Private if userId provided)
 */
router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    let reply = "";

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are NIRVAHA AI, the spiritual and mental wellness guide for the Nirvaha application. Your tone is peaceful, empathetic, and deeply caring. You help users reflect on their journey towards inner peace. \n\nAbout Nirvaha:\n- It is a comprehensive wellness platform offering Meditation, Sound Healing, a supportive Community, and a curated Marketplace.\n- Users can also find 'Companions' (mentors/experts) for personalized guidance.\n- Your goal is to provide a safe space for reflection.\n\nGuidelines:\n1. Be non-judgmental and validating.\n2. Keep responses concise but meaningful.\n3. If a user asks about meditation or stress, suggest checking the Nirvaha Meditation or Sound Healing sections.\n4. Always maintain a zen, calm vibe."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 500,
      });

      reply = completion.choices[0]?.message?.content || "I'm here for you. Take a deep breath. How are you feeling right now?";
    } catch (aiError) {
      console.error('Groq AI Error:', aiError);
      // Fallback response logic if AI fails
      if (message.toLowerCase().includes('stress')) {
        reply = "I understand. Stress can be heavy. Take a moment to just breathe with me. You're doing your best.";
      } else {
        reply = "I hear you. Thank you for sharing that with me. I am here to listen and support you in your journey of reflection.";
      }
    }

    // Save to MongoDB (Bonus)
    const newReflection = new Reflection({
      userId: userId || 'anonymous',
      message,
      reply,
      timestamp: new Date()
    });

    await newReflection.save();

    res.json({ reply });
  } catch (error) {
    console.error('Reflection Route Error:', error);
    res.status(500).json({ reply: "I'm sorry, I'm having a little trouble connecting right now. But I'm still here with you. Take a deep breath." });
  }
});

module.exports = router;
