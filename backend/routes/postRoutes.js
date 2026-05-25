const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');
const Hashtag = require('../models/Hashtag');

const router = express.Router();

// ── Auto Category Detection ──────────────────────────────────────────
function detectCategories(text) {
  const categories = [];
  const lowercaseText = (text || "").toLowerCase();
  
  const mindfulnessKeywords = [
    "meditat", "mindful", "breathe", "breath", "calm", "relax", "presence", "zen", 
    "now", "gratitude", "focus", "journal", "awareness", "conscious", "silent", 
    "silence", "stillness", "salutation", "peace"
  ];
  
  const healingKeywords = [
    "heal", "recover", "anxiety", "depress", "stress", "trauma", "pain", "sad", 
    "grief", "reiki", "chakra", "energy", "therapy", "sound", "music", "frequency", 
    "ayurveda", "ashwagandha", "self-care", "self care", "loss", "recovery"
  ];
  
  const hasMindfulness = mindfulnessKeywords.some(kw => lowercaseText.includes(kw));
  const hasHealing = healingKeywords.some(kw => lowercaseText.includes(kw));
  
  if (hasMindfulness) categories.push("mindfulness");
  if (hasHealing) categories.push("healing");
  
  if (categories.length === 0) {
    categories.push("healing"); // default to at least one category to maintain platform intent
  }
  
  return categories;
}

// ── Auto Hashtag Generation ───────────────────────────────────────────
function generateHashtags(text) {
  const lowercaseText = (text || "").toLowerCase();
  const generated = new Set();
  
  const hashtagMapping = {
    "#healing": ["heal", "recover", "trauma", "reiki", "therapy", "ayurveda", "ashwagandha", "self-care", "self care", "grief", "loss"],
    "#mindfulness": ["meditat", "mindful", "breathe", "breath", "presence", "zen", "now", "awareness", "conscious", "silent", "silence"],
    "#peace": ["peace", "calm", "relax", "serene", "stillness", "harmony", "quiet"],
    "#anxiety": ["anxiety", "stress", "depress", "overwhelm", "fear", "panic", "tension"],
    "#wellness": ["wellness", "health", "habit", "ritual", "gratitude", "kindness", "happiness", "joy"]
  };
  
  for (const [tag, keywords] of Object.entries(hashtagMapping)) {
    if (keywords.some(kw => lowercaseText.includes(kw))) {
      generated.add(tag);
    }
  }
  
  // Also extract hashtags written explicitly by user
  const userHashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
  userHashtags.forEach(tag => generated.add(tag.toLowerCase()));
  
  return Array.from(generated);
}

// ── Realtime Hashtag Synchronization ──────────────────────────────
async function syncHashtagCounts() {
  const now = new Date();
  
  // 1. Get active counts from posts
  const activeCounts = await Post.aggregate([
    { $match: { expiresAt: { $gt: now } } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } }
  ]);
  
  // 2. Set existing tag counts to 0
  await Hashtag.updateMany({}, { count: 0 });
  
  // 3. Upsert active ones
  for (const item of activeCounts) {
    const tag = item._id.startsWith('#') ? item._id : `#${item._id}`;
    await Hashtag.findOneAndUpdate(
      { tag: tag.toLowerCase() },
      { count: item.count },
      { upsert: true, new: true }
    );
  }
}

async function getTrendingHashtags() {
  await syncHashtagCounts();
  const result = await Hashtag.find({}).sort({ count: -1, tag: 1 }).limit(10);
  return result.map(h => ({
    title: h.tag,
    count: h.count > 999 ? `${(h.count / 1000).toFixed(1)}k` : String(h.count),
    rawCount: h.count
  }));
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilterRegex(keywords = []) {
  if (!Array.isArray(keywords) || !keywords.length) return null;
  return new RegExp(`\\b(?:${keywords.map(escapeRegExp).join("|")})\\b`, "i");
}

// ── Seed data ──────────────────────────────────────────────────────────────
const SEED_POSTS = [
  { userName: 'Priya Sharma', userRole: 'Meditation Guide', avatarColor: '#7c3aed', hashtags: ['#meditation', '#mindfulness', '#healing'], likes: 312, body: 'Just completed a 21-day silent meditation retreat 🙏 The silence taught me more than years of reading. Gratitude fills every breath. #meditation #mindfulness', title: 'Silent Retreat — 21 Days of Transformation' },
  { userName: 'Arjun Mehta', userRole: 'Yoga Instructor', avatarColor: '#0891b2', hashtags: ['#yoga', '#wellness', '#breathwork'], likes: 198, body: 'Morning yoga flow at sunrise is the most underrated ritual. 15 minutes of sun salutations and your entire day shifts. Try it tomorrow 🌅 #yoga #wellness', title: 'Sunrise Yoga — The Ultimate Morning Reset' },
  { userName: 'Kavya Nair', userRole: 'Sound Healer', avatarColor: '#be185d', hashtags: ['#soundhealing', '#healing', '#tibetanbowls'], likes: 445, body: 'Crystal singing bowls at 432 Hz literally rewire your nervous system. I\'ve seen clients release years of stored trauma in a single session 🔮 #soundhealing #healing', title: '432 Hz — The Frequency That Changes Everything' },
  { userName: 'Rohan Das', userRole: 'Breathwork Coach', avatarColor: '#b45309', hashtags: ['#breathwork', '#anxiety', '#healing'], likes: 267, body: 'Box breathing: 4 counts in, 4 hold, 4 out, 4 hold. Do this for 5 minutes when anxiety hits. Your nervous system will thank you 💨 #breathwork #anxiety', title: 'Box Breathing — Your Instant Anxiety Reset' },
  { userName: 'Ananya Iyer', userRole: 'Wellness Coach', avatarColor: '#047857', hashtags: ['#wellness', '#habits', '#happiness'], likes: 523, body: 'The secret to lasting happiness isn\'t big achievements — it\'s tiny daily rituals. Morning gratitude, evening reflection, and one act of kindness. That\'s it. #wellness #happiness', title: 'The Tiny Rituals That Build Lasting Happiness' },
  { userName: 'Vikram Patel', userRole: 'Ayurveda Practitioner', avatarColor: '#7c3aed', hashtags: ['#ayurveda', '#healing', '#wellness'], likes: 189, body: 'Ashwagandha + warm milk before bed has transformed my sleep quality. Ancient wisdom backed by modern science. Ayurveda never disappoints 🌿 #ayurveda #healing', title: 'Ashwagandha — Ancient Herb, Modern Science' },
  { userName: 'Meera Krishnan', userRole: 'Mindfulness Teacher', avatarColor: '#0891b2', hashtags: ['#mindfulness', '#meditation', '#presence'], likes: 634, body: 'You don\'t need 30 minutes to meditate. Even 3 conscious breaths between tasks is mindfulness. Start where you are. Use what you have. Do what you can 🌸 #mindfulness', title: '3 Breaths — The Micro-Meditation That Works' },
  { userName: 'Siddharth Rao', userRole: 'Energy Healer', avatarColor: '#be185d', hashtags: ['#energyhealing', '#chakras', '#healing'], likes: 156, body: 'Your chakras are like spinning wheels of energy. When one is blocked, you feel it — fatigue, anxiety, disconnection. Reiki helped me understand my own energy map 🌀 #energyhealing #chakras', title: 'Understanding Your Chakra Energy Map' },
  { userName: 'Divya Menon', userRole: 'Yoga Therapist', avatarColor: '#b45309', hashtags: ['#yoga', '#stress', '#wellness'], likes: 289, body: 'Restorative yoga is not "easy yoga" — it\'s the most powerful practice for nervous system healing. Holding poses for 5+ minutes with props creates deep cellular release 🧘‍♀️ #yoga #stress', title: 'Restorative Yoga — Deep Healing for Your Nervous System' },
  { userName: 'Aditya Kumar', userRole: 'Meditation Coach', avatarColor: '#047857', hashtags: ['#meditation', '#focus', '#productivity'], likes: 412, body: 'Meditation isn\'t about emptying your mind. It\'s about watching your thoughts without becoming them. That shift in perspective changes everything 🧠 #meditation #focus', title: 'The Biggest Meditation Myth — Debunked' },
  { userName: 'Lakshmi Venkat', userRole: 'Holistic Healer', avatarColor: '#7c3aed', hashtags: ['#healing', '#holistic', '#selfcare'], likes: 178, body: 'Self-care isn\'t selfish — it\'s the foundation of everything. You cannot pour from an empty cup. Fill yourself first, then overflow into others 💚 #healing #selfcare', title: 'Self-Care Is Not Selfish — It\'s Essential' },
  { userName: 'Rahul Sharma', userRole: 'Pranayama Teacher', avatarColor: '#0891b2', hashtags: ['#breathwork', '#pranayama', '#energy'], likes: 334, body: 'Nadi Shodhana (alternate nostril breathing) for 10 minutes balances both hemispheres of the brain. Left nostril = calm, right nostril = energy. Use accordingly 🌬️ #pranayama', title: 'Nadi Shodhana — Balance Your Brain in 10 Minutes' },
  { userName: 'Sunita Pillai', userRole: 'Wellness Blogger', avatarColor: '#be185d', hashtags: ['#wellness', '#happiness', '#habits'], likes: 567, body: 'I tracked my mood for 90 days. The #1 predictor of a good day? Morning sunlight within 30 minutes of waking. Not coffee. Not exercise. Sunlight. ☀️ #wellness #habits', title: '90-Day Mood Experiment — What I Discovered' },
  { userName: 'Kiran Bose', userRole: 'Sound Therapist', avatarColor: '#b45309', hashtags: ['#soundhealing', '#binaural', '#sleep'], likes: 223, body: 'Binaural beats at 40 Hz (gamma waves) for 20 minutes before deep work sessions. My focus has never been sharper. Science + sound = magic 🎵 #soundhealing #binaural', title: 'Binaural Beats — The Science of Sound Focus' },
  { userName: 'Pooja Reddy', userRole: 'Mindfulness Coach', avatarColor: '#047857', hashtags: ['#mindfulness', '#anxiety', '#healing'], likes: 389, body: 'Anxiety is not your enemy — it\'s your body\'s alarm system misfiring. Instead of fighting it, try saying "I notice I\'m feeling anxious" and watch it lose its power 🌿 #mindfulness #anxiety', title: 'Reframe Anxiety — From Enemy to Messenger' },
  { userName: 'Dr. James Wilson', userRole: 'Sleep Specialist', avatarColor: '#1e293b', hashtags: ['#sleep', '#health', '#science'], likes: 856, body: 'The 10-3-2-1-0 rule for better sleep: 10 hours before bed no caffeine, 3 hours before no food/alcohol, 2 hours before no work, 1 hour before no screens, 0 times hitting snooze. 😴 #sleep #health', title: 'The 10-3-2-1-0 Rule for Perfect Sleep' },
  { userName: 'Maya Zen', userRole: 'Spiritual Guide', avatarColor: '#f59e0b', hashtags: ['#spirituality', '#zen', '#peace'], likes: 1205, body: 'Letting go doesn\'t mean you don\'t care. It means you stop trying to force things to be what they aren\'t. Peace comes when you accept the present moment as it is. ✨ #zen #peace', title: 'The Art of Letting Go' },
  { userName: 'Coach Sarah', userRole: 'Fitness & Mindset', avatarColor: '#ef4444', hashtags: ['#fitness', '#mindset', '#growth'], likes: 432, body: 'Motivation gets you started, but discipline keeps you going. Don\'t wait for the "feeling" to hit you. Just show up for yourself today, even if it\'s just for 5 minutes. 💪 #mindset', title: 'Discipline Over Motivation' },
  { userName: 'Leo H.', userRole: 'Nature Therapist', avatarColor: '#065f46', hashtags: ['#nature', '#forestbathing', '#calm'], likes: 211, body: '20 minutes of "Forest Bathing" (Shinrin-yoku) reduces cortisol levels by 12%. If you\'re feeling stressed, go find a tree. It sounds simple because it is. 🌳 #nature #calm', title: 'Nature\'s Prescription for Stress' },
  { userName: 'Nina Rose', userRole: 'Art Therapist', avatarColor: '#db2777', hashtags: ['#art', '#expression', '#healing'], likes: 345, body: 'Art therapy isn\'t about being an artist. It\'s about externalizing the feelings that are too big for words. Draw your stress, paint your joy. Let it out. 🎨 #healing #art', title: 'Healing Through Creative Expression' },
  { userName: 'Sam Rivers', userRole: 'Hydration Expert', avatarColor: '#3b82f6', hashtags: ['#water', '#health', '#energy'], likes: 189, body: 'Fatigue is often just dehydration in disguise. Try drinking a full glass of water before you reach for that third cup of coffee. Your cells will thank you! 💧 #health', title: 'Drink More Water, Feel More Life' },
  { userName: 'Tara Singh', userRole: 'Grateful Living', avatarColor: '#8b5cf6', hashtags: ['#gratitude', '#happiness', '#journaling'], likes: 721, body: 'Naming three things you\'re grateful for every morning re-wires your brain to look for the good instead of the problems. It\'s a 30-second habit that changes your year. 🙏 #gratitude', title: 'The 30-Second Gratitude Shift' },
  { userName: 'Oliver K.', userRole: 'Biohacker', avatarColor: '#0f172a', hashtags: ['#biohacking', '#longevity', '#health'], likes: 534, body: 'Cold showers for 2 minutes boost dopamine levels for hours. It\'s uncomfortable, it\'s shocking, and it\'s the best natural energy boost I\'ve found. 🧊 #biohacking', title: 'The Power of the Cold Plunge' },
  { userName: 'Elena P.', userRole: 'Nutritionist', avatarColor: '#10b981', hashtags: ['#nutrition', '#guthealth', '#wellness'], likes: 467, body: 'Your gut is your second brain. 95% of your serotonin is produced in your gut. Eat your fermented foods and watch your mood stabilize. 🥗 #guthealth', title: 'Gut-Brain Connection: Eat for Happiness' },
];

let seedRunning = false;

async function seedIfEmpty() {
  // Disabled automatic seeding per user request to ensure old posts 
  // stay permanently deleted after their 24hr expiration.
  return;
  
  if (seedRunning) return;
  seedRunning = true;
  try {
    const count = await Post.countDocuments();
    if (count > 0) return;  // Never reseed if ANY posts exist

    const now = Date.now();
    const docs = SEED_POSTS.map((p, i) => ({
      id: uuidv4(),
      userId: `seed-${i}`,
      userName: p.userName,
      userRole: p.userRole,
      userInitial: p.userName[0],
      avatarColor: p.avatarColor,
      avatarUrl: '',
      title: p.title,
      body: p.body,
      hashtags: p.hashtags,
      likes: p.likes,
      liked: false,
      comments: [],
      isCertified: i % 3 === 0,
      isOnline: Math.random() > 0.4,
      timestampValue: now - (i * 30 * 60 * 1000), // More frequent posts (every 30 mins)
      expiresAt: new Date(now + 24 * 60 * 60 * 1000),
    }));

    await Post.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} community posts`);
  } finally {
    seedRunning = false;
  }
}

// ── GET /api/posts ─────────────────────────────────────────────────────────
// Query params: sort=popular|recent|all, q=searchTerm, hashtag=#tag, page=1, limit=20
router.get('/', async (req, res) => {
  try {
    await seedIfEmpty();

    const { sort, q, hashtag, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const now = new Date();
    const filters = [{ expiresAt: { $gt: now } }];

    // Hashtag filter — exact match in hashtags array (supports comma-separated list)
    if (hashtag && hashtag.trim()) {
      const tags = hashtag
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      if (tags.length) {
        const cleanTags = tags.map((t) => (t.startsWith('#') ? t.substring(1) : t));
        const tagsWithHash = tags.map((t) => (t.startsWith('#') ? t : `#${t}`));
        const isMindfulness = cleanTags.includes('mindfulness');
        const isHealing = cleanTags.includes('healing');

        if (isMindfulness || isHealing) {
          const mindfulnessKeywords = [
            'mindful', 'meditat', 'breathe', 'breath', 'calm', 'relax', 'presence', 'awareness', 'zen',
            'gratitude', 'focus', 'stillness', 'peace', 'serenity', 'grounding'
          ];
          const healingKeywords = [
            'heal', 'recover', 'anxiety', 'stress', 'trauma', 'therapy', 'grief', 'reiki', 'chakra',
            'energy', 'self-care', 'self care', 'recovery', 'emotion', 'release', 'support', 'nurture'
          ];
          const keywordRegex = buildFilterRegex([
            ...(isMindfulness ? mindfulnessKeywords : []),
            ...(isHealing ? healingKeywords : []),
          ]);

          filters.push({
            $or: [
              { hashtags: { $in: [...tags, ...tagsWithHash, ...cleanTags] } },
              { categories: { $in: cleanTags } },
              ...(keywordRegex ? [
                { title: { $regex: keywordRegex } },
                { body: { $regex: keywordRegex } },
              ] : []),
            ],
          });
        } else {
          filters.push({ hashtags: { $in: [...tags, ...tagsWithHash, ...cleanTags] } });
        }
      }
    }

    if (q && q.trim()) {
      const term = q.trim();
      const queryRegex = new RegExp(escapeRegExp(term), 'i');
      filters.push({
        $or: [
          { title: { $regex: queryRegex } },
          { body: { $regex: queryRegex } },
          { hashtags: { $regex: queryRegex } },
          { userName: { $regex: queryRegex } },
          { userRole: { $regex: queryRegex } },
        ],
      });
    }

    const query = filters.length === 1 ? filters[0] : { $and: filters };

    let sortOrder;
    if (sort === 'popular') {
      sortOrder = { likes: -1, comments_count: -1, timestampValue: -1 };
    } else if (sort === 'all') {
      sortOrder = { _id: -1 };
    } else {
      sortOrder = { timestampValue: -1 };
    }

    const [posts, total] = await Promise.all([
      Post.find(query).sort(sortOrder).skip(skip).limit(parseInt(limit)),
      Post.countDocuments(query),
    ]);

    res.json({ posts, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('GET /api/posts error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ── GET /api/posts/trending ───────────────────────────────────────────────
router.get('/trending', async (req, res) => {
  try {
    await seedIfEmpty();
    const trending = await getTrendingHashtags();
    res.json(trending);
  } catch (err) {
    console.error('GET /api/posts/trending error:', err);
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
});

const BANNED_WORDS = [
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
  "nigger", "nigga", "faggot", "retard", "whore", "slut", "motherfucker",
  "wanker", "bollocks", "scam", "casino", "crypto", "viagra", "porn"
];

const WELLNESS_KEYWORDS = [
  "peace", "calm", "relax", "meditat", "breathe", "breath", "mindful", "heal", "spirit", "yoga",
  "self-care", "self care", "wellness", "health", "mental", "feel", "emotion", "grief", "sad",
  "happy", "joy", "reflection", "stress", "anxiety", "depression", "overwhelm", "mentor", "companion",
  "life", "love", "heart", "ground", "sleep", "rest", "energy", "reiki", "chakra", "music", "frequency",
  "sunlight", "nature", "forest", "therapy", "boundar", "habit", "ritual", "gratitude", "kindness"
];

const recentPostsCache = new Map();

function moderatePost(title, body) {
  const fullText = `${title || ""} ${body}`.toLowerCase();
  
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(fullText)) {
      return { approved: false, reason: "Banned or offensive language detected. Please keep the community supportive and peaceful 🌿" };
    }
  }

  if ((fullText.match(/https?:\/\//g) || []).length > 2 || fullText.includes("telegram.me/") || fullText.includes("t.me/")) {
    return { approved: false, reason: "Spam or advertisement links are not allowed." };
  }

  if (body.length > 25) {
    const hasWellnessKeyword = WELLNESS_KEYWORDS.some(keyword => fullText.includes(keyword));
    if (!hasWellnessKeyword) {
      return { 
        approved: false, 
        reason: "Post rejected. To maintain focus, all posts should be related to wellness, mindfulness, reflection, or community support 🌿" 
      };
    }
  }

  return { approved: true };
}

// ── POST /api/posts ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { userId, userName, userRole, userInitial, avatarColor, avatarUrl, title, body, hashtags, isCertified, isOnline } = req.body;
    if (!userName || !body) return res.status(400).json({ error: 'userName and body are required' });

    // Spam rate limit & duplicate check
    if (userId && userId !== 'anonymous') {
      const lastPost = recentPostsCache.get(userId);
      if (lastPost) {
        const timeDiff = Date.now() - lastPost.timestamp;
        if (timeDiff < 10000) {
          return res.status(429).json({ error: "Please wait a moment before posting again." });
        }
        if (lastPost.body === body && timeDiff < 60000) {
          return res.status(400).json({ error: "Duplicate post detected. Share a new reflection!" });
        }
      }
      recentPostsCache.set(userId, { body, timestamp: Date.now() });
    }

    // Content Moderation check
    const moderation = moderatePost(title, body);
    if (!moderation.approved) {
      return res.status(400).json({ error: moderation.reason });
    }

    // Auto detect categories and hashtags
    const detectedCategories = detectCategories(body);
    const generatedTags = generateHashtags(body);
    const finalHashtags = Array.from(new Set([...(hashtags || []), ...generatedTags]));

    const post = new Post({
      id: uuidv4(),
      userId: userId || 'anonymous',
      userName,
      userRole: userRole || 'Community Member',
      userInitial: userInitial || userName[0].toUpperCase(),
      avatarColor: avatarColor || '#2D6A4F',
      avatarUrl: avatarUrl || '',
      title: title || body.split('\n')[0].slice(0, 80),
      body,
      content: body,
      user_id: userId || 'anonymous',
      categories: detectedCategories,
      hashtags: finalHashtags,
      isCertified: isCertified || false,
      isOnline: isOnline !== undefined ? isOnline : true,
      timestampValue: Date.now(),
      likes: 0,
      liked: false,
      comments: [],
      comments_count: 0,
      shares: 0,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await post.save();
    
    // Sync hashtag counts in database
    await syncHashtagCounts();
    const trendingList = await getTrendingHashtags();

    const io = req.app.get('io');
    if (io) {
      console.log('📡 Emitting postCreated:', post.id);
      io.emit('postCreated', post.toObject());
      console.log('📡 Emitting trendingUpdated');
      io.emit('trendingUpdated', trendingList);
    }
    res.status(201).json(post);
  } catch (err) {
    console.error('POST /api/posts error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// ── POST /api/posts/:id/like ───────────────────────────────────────────────
router.post('/:id/like', async (req, res) => {
  try {
    const { liked } = req.body;
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes = liked ? post.likes + 1 : Math.max(0, post.likes - 1);
    post.liked = liked;
    await post.save();

    const io = req.app.get('io');
    if (io) {
      console.log('📡 Emitting postLiked:', post.id);
      io.emit('postLiked', { id: post.id, likes: post.likes, liked: post.liked });
    }
    res.json({ id: post.id, likes: post.likes, liked: post.liked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update like' });
  }
});

// ── POST /api/posts/:id/comment ───────────────────────────────────────────
router.post('/:id/comment', async (req, res) => {
  try {
    const { userId, userName, userInitial, avatarColor, text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });

    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      id: `c-${uuidv4()}`,
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous',
      userInitial: userInitial || 'A',
      avatarColor: avatarColor || '#2D6A4F',
      text: text.trim(),
      createdAt: Date.now(),
    };

    post.comments.push(comment);
    await post.save();

    const io = req.app.get('io');
    if (io) {
      console.log('📡 Emitting commentAdded:', post.id);
      io.emit('commentAdded', { postId: post.id, comment });
    }
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// ── POST /api/posts/:id/share ───────────────────────────────────────────────
router.post('/:id/share', async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.shares = (post.shares || 0) + 1;
    await post.save();

    const io = req.app.get('io');
    if (io) {
      console.log('📡 Emitting postShared:', post.id, post.shares);
      io.emit('postShared', { id: post.id, shares: post.shares });
    }
    res.json({ id: post.id, shares: post.shares });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update share count' });
  }
});

module.exports = router;
