const express = require('express');
const { Groq } = require('groq-sdk');
const Reflection = require('../models/Reflection');
const { createReflectionBackup } = require('../utils/retention');
const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function normalizeShortReply(text) {
  if (!text) return text;
  const cleaned = text.trim().replace(/\s+/g, ' ');
  const rawParts = cleaned.split(/([.!?])/);
  const sentences = [];
  for (let i = 0; i < rawParts.length; i += 2) {
    const sentence = rawParts[i].trim();
    const punctuation = rawParts[i + 1] || '';
    if (!sentence) continue;
    sentences.push(`${sentence}${punctuation}`.trim());
    if (sentences.length >= 6) break;
  }

  let questionCount = 0;
  const filtered = [];
  for (const sentence of sentences) {
    if (sentence.endsWith('?')) {
      questionCount += 1;
      if (questionCount > 1) continue;
    }
    filtered.push(sentence);
    if (filtered.length >= 4) break;
  }

  let reply = filtered.join(' ').trim();
  if (!reply) {
    return cleaned.slice(0, 280).trim();
  }

  const finalParts = reply.split(/([.!?])/);
  const finalSentences = [];
  for (let i = 0; i < finalParts.length; i += 2) {
    const sentence = finalParts[i].trim();
    const punctuation = finalParts[i + 1] || '';
    if (!sentence) continue;
    finalSentences.push(`${sentence}${punctuation}`.trim());
    if (finalSentences.length >= 4) break;
  }

  return finalSentences.join(' ').trim();
}

/**
 * @route   POST /api/reflect
 * @desc    Generate a calm, supportive AI response to user reflection
 * @access  Public (or Private if userId provided)
 */
router.post('/', async (req, res) => {
  try {
    const { message, userId, persona } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Retrieve previous conversations for memory (if not anonymous)
    let historyMessages = [];
    if (userId && userId !== 'anonymous') {
      try {
        const pastReflections = await Reflection.find({ userId })
          .sort({ timestamp: -1 }) // get latest first
          .limit(4) // fetch last 4 reflections (2 turns of conversation)
          .lean()
          .select('message reply timestamp');
        
        // Reverse to restore chronological order
        const chronological = pastReflections.reverse();
        chronological.forEach(ref => {
          historyMessages.push({ role: "user", content: ref.message });
          historyMessages.push({ role: "assistant", content: ref.reply });
        });
      } catch (dbError) {
        console.error('Error fetching chat history from DB:', dbError);
      }
    }

    // Dynamic Persona Customization Guidelines
    let personaInstruction = "";
    if (persona === 'Emotional') {
      personaInstruction = `\n\nSpecific Persona Style: EMOTIONAL. Be warm, gentle, and validating. Use simple, human language without dramatic imagery or poetic flourishes.`;
    } else if (persona === 'Deep') {
      personaInstruction = `\n\nSpecific Persona Style: DEEP. Be reflective and calm, with clear, grounded language. Keep it thoughtful without becoming elaborate.`;
    } else {
      // Default: Supportive
      personaInstruction = `\n\nSpecific Persona Style: SUPPORTIVE. Be warm, reassuring, encouraging, and calm. Use plain language and keep it easy to read.`;
    }

    const systemPrompt = `You are NIRVAHA AI, a calm and supportive wellness guide. Speak like a caring friend: concise, gentle, and emotionally attuned. Keep replies short, usually 2–4 lines. Avoid long paragraphs, elaborate wording, or dramatic phrasing.

Core Persona & Tone:
- Calm, warm, grounded, and supportive.
- Validate feelings first, then offer a simple kind insight.
- Use clear, natural language and avoid poetic or dramatic wording.
- Keep replies emotionally supportive and easy to read.

Response Length Guidelines:
1. Prefer short, conversational replies.
2. Keep sentences short and simple.
3. Ask at most one gentle follow-up question.
4. If the user sounds overwhelmed, stay especially brief and kind.

Conversational Guidance:
- Prioritize listening and gentle reflection.
- Suggest wellness support only when it fits naturally (e.g., breathing, grounding, sleep, gentle movement).
- Never mention "Community" or community features.
- Close with a calm invitation or one soft question when appropriate.`;

    let reply = "";

    try {
      const messagesPayload = [
        {
          role: "system",
          content: systemPrompt
        },
        ...historyMessages,
        {
          role: "user",
          content: message
        }
      ];

      const completion = await groq.chat.completions.create({
        messages: messagesPayload,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 220,
      });

      reply = normalizeShortReply(completion.choices[0]?.message?.content || "I'm here for you. Take a deep breath. How are you feeling right now?");
    } catch (aiError) {
      console.error('Groq AI Error:', aiError);
      // Fallback response logic if AI fails
      if (message.toLowerCase().includes('stress')) {
        reply = normalizeShortReply("I understand. Stress can feel heavy. Breathe slowly and know you're doing your best.");
      } else {
        reply = normalizeShortReply("I hear you. Thank you for sharing. I'm here to listen and support you in this moment.");
      }
    }

    // Save to MongoDB (Bonus)
    const retentionDays = Number(process.env.REFLECTION_RETENTION_DAYS) || 90;
    const newReflection = new Reflection({
      userId: userId || 'anonymous',
      message,
      reply,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000),
    });

    await newReflection.save();

    res.json({ reply });
  } catch (error) {
    console.error('Reflection Route Error:', error);
    res.status(500).json({ reply: "I'm sorry, I'm having a little trouble connecting right now. But I'm still here with you. Take a deep breath." });
  }
});

// GET /api/reflect/history - Retrieve stored reflections for a logged-in user
router.get('/history', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || userId === 'anonymous') {
      return res.status(400).json({ error: 'Valid userId required for history retrieval' });
    }

    const reflections = await Reflection.find({ userId })
      .sort({ timestamp: 1 })
      .lean()
      .select('message reply timestamp');

    const messages = reflections.flatMap((reflection) => [
      {
        type: 'user',
        content: reflection.message,
        timestamp: reflection.timestamp ? reflection.timestamp.toISOString() : new Date().toISOString(),
      },
      {
        type: 'ai',
        content: reflection.reply,
        timestamp: reflection.timestamp ? reflection.timestamp.toISOString() : new Date().toISOString(),
      },
    ]);

    const sessions = [];
    if (messages.length) {
      sessions.push({
        id: `backend-chat-history-${userId}`,
        title: reflections[0]?.message?.slice(0, 30) || 'Reflection History',
        messages,
        createdAt: reflections[0]?.timestamp ? new Date(reflections[0].timestamp).getTime() : Date.now(),
        updatedAt: reflections[reflections.length - 1]?.timestamp ? new Date(reflections[reflections.length - 1].timestamp).getTime() : Date.now(),
      });
    }

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Reflection history retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve reflection history' });
  }
});

// DELETE /api/reflect/clear - Clear chat history database records for a user
router.delete('/clear', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || userId === 'anonymous') {
      return res.status(400).json({ error: 'Valid userId required for deletion' });
    }
    await Reflection.deleteMany({ userId });
    res.json({ success: true, message: 'Reflection history cleared successfully.' });
  } catch (error) {
    console.error('Clear reflection history error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const { userId, since, until } = req.query;
    const backupResult = await createReflectionBackup({ userId, since, until });
    res.json({ success: true, ...backupResult });
  } catch (error) {
    console.error('Reflection export error:', error);
    res.status(500).json({ error: 'Failed to export reflections', details: error.message });
  }
});

module.exports = router;
