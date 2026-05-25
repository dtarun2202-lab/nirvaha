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
    const { message, userId, problemContext } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build a problem-specific system prompt so each problem type gets unique AI responses
    const problemGuides = {
      "Burnout": "The user is dealing with burnout — emotional and physical exhaustion from prolonged stress. Focus on energy recovery, boundary setting, rest practices, and gentle encouragement. Suggest Nirvaha's burnout recovery audio and meditation sessions.",
      "Stress": "The user is experiencing chronic stress. Focus on stress management techniques, breathing exercises, mindfulness, and cortisol reduction. Suggest Nirvaha's stress relief audio and calming nature sounds.",
      "Sleep Issues": "The user is struggling with sleep problems. Focus on sleep hygiene, evening routines, delta wave therapy, and calming the mind before bed. Suggest Nirvaha's deep sleep audio and binaural beats.",
      "High Anxiety": "The user is experiencing high anxiety. Focus on grounding techniques, present-moment awareness, crystal bowl therapy, and safety reassurance. Suggest Nirvaha's anxiety relief audio and grounding frequency sessions.",
      "Mood Swings": "The user is dealing with mood swings and emotional fluctuations. Focus on emotional regulation, chakra balancing, journaling, and heart-centered practices. Suggest Nirvaha's mood stabilization audio and heart balance frequency.",
      "Feeling Isolated": "The user is feeling isolated and disconnected. Focus on community connection, belonging, compassion practices, and gentle social re-engagement. Suggest Nirvaha's community circles and companion chat sessions."
    };

    const problemSpecificGuide = problemContext && problemGuides[problemContext]
      ? `\n\nCurrent Context: ${problemGuides[problemContext]}`
      : "";

    let reply = "";

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are NIRVAHA AI, the spiritual and mental wellness guide for the Nirvaha application. Your tone is peaceful, empathetic, and deeply caring. You help users reflect on their journey towards inner peace. \n\nAbout Nirvaha:\n- It is a comprehensive wellness platform offering Meditation, Sound Healing, a supportive Community, and a curated Marketplace.\n- Users can also find 'Companions' (mentors/experts) for personalized guidance.\n- Your goal is to provide a safe space for reflection.\n\nGuidelines:\n1. Be non-judgmental and validating.\n2. Keep responses concise but meaningful (2-4 sentences).\n3. If a user asks about meditation or stress, suggest checking the Nirvaha Meditation or Sound Healing sections.\n4. Always maintain a zen, calm vibe.${problemSpecificGuide}`
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
      // Fallback responses specific to each problem type
      const fallbacks = {
        "Burnout": "I understand you're running on empty. Take a moment to just breathe with me. Rest is not laziness — it's recovery. You're doing your best.",
        "Stress": "I understand. Stress can be heavy. Take a moment to just breathe with me. You're doing your best.",
        "Sleep Issues": "Rest is so important for healing. Try a simple wind-down routine tonight — dim lights, deep breaths, and gentle sounds. You deserve peaceful sleep.",
        "High Anxiety": "I hear you. Anxiety can feel overwhelming, but you are safe right now. Place your feet firmly on the ground, take a slow breath in, and exhale gently.",
        "Mood Swings": "Emotional waves are natural. Acknowledge what you're feeling without judgment. Your emotions are valid, and finding balance takes time.",
        "Feeling Isolated": "You are not alone in this. Connection begins with one small step. I'm here with you right now, and that matters."
      };
      reply = (problemContext && fallbacks[problemContext]) || "I hear you. Thank you for sharing that with me. I am here to listen and support you in your journey of reflection.";
    }

    // Save to MongoDB — but don't let a DB failure prevent the AI response
    try {
      const newReflection = new Reflection({
        userId: userId || 'anonymous',
        message,
        reply,
        problemContext: problemContext || 'general',
        timestamp: new Date()
      });
      await newReflection.save();
    } catch (dbError) {
      console.error('MongoDB save failed (non-blocking):', dbError.message);
      // Continue — the AI reply is still valid
    }

    res.json({ reply });
  } catch (error) {
    console.error('Reflection Route Error:', error);
    res.status(500).json({ reply: "I'm sorry, I'm having a little trouble connecting right now. But I'm still here with you. Take a deep breath." });
  }
});

module.exports = router;
