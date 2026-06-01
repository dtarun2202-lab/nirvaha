const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');
const Hashtag = require('../models/Hashtag');

const router = express.Router();

// ── Predefined banned words (server-side only, no admin management) ───────
const BANNED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy',
  'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut', 'motherfucker',
  'wanker', 'bollocks', 'scam', 'casino', 'viagra', 'porn',
  'piss', 'cock', 'crap', 'twat', 'prick',
  'douchebag', 'jackass', 'dipshit', 'bullshit', 'horseshit', 'shithead',
  'fuckhead', 'arsehole', 'arse', 'spastic',
  'rape', 'terrorist', 'bomb',
  'racist', 'sexist', 'homophobic', 'transphobic',
];

// ── Auto Category Detection ───────────────────────────────────────────────
function detectCategories(text) {
  const categories = [];
  const lower = (text || '').toLowerCase();

  const mindfulnessKeywords = [
    'meditat', 'mindful', 'breathe', 'breath', 'breathing', 'calm', 'relax',
    'presence', 'zen', 'gratitude', 'focus', 'awareness', 'conscious', 'silent',
    'silence', 'stillness', 'peace', 'serenity', 'grounding', 'salutation',
    'pranayama', 'visualization', 'present moment', 'inner peace', 'clarity',
  ];

  const healingKeywords = [
    'heal', 'recover', 'anxiety', 'depress', 'stress', 'trauma', 'pain', 'sad',
    'grief', 'reiki', 'chakra', 'energy', 'therapy', 'sound', 'music', 'frequency',
    'ayurveda', 'ashwagandha', 'self-care', 'self care', 'loss', 'recovery',
    'emotional', 'emotion', 'release', 'support', 'nurture', 'wellbeing',
    'mental health', 'burnout', 'overwhelm', 'fear', 'panic', 'tension',
  ];

  if (mindfulnessKeywords.some((kw) => lower.includes(kw))) categories.push('mindfulness');
  if (healingKeywords.some((kw) => lower.includes(kw))) categories.push('healing');

  if (categories.length === 0) categories.push('healing');
  return categories;
}

// ── Auto Hashtag Generation ───────────────────────────────────────────────
function generateHashtags(text) {
  const lower = (text || '').toLowerCase();
  const generated = new Set();

  const mapping = {
    '#healing':     ['heal', 'recover', 'trauma', 'reiki', 'therapy', 'ayurveda', 'ashwagandha', 'self-care', 'self care', 'grief', 'loss'],
    '#mindfulness': ['meditat', 'mindful', 'breathe', 'breath', 'presence', 'zen', 'awareness', 'conscious', 'silent', 'silence'],
    '#peace':       ['peace', 'calm', 'relax', 'serene', 'stillness', 'harmony', 'quiet'],
    '#anxiety':     ['anxiety', 'stress', 'depress', 'overwhelm', 'fear', 'panic', 'tension'],
    '#wellness':    ['wellness', 'health', 'habit', 'ritual', 'gratitude', 'kindness', 'happiness', 'joy'],
    '#breathwork':  ['breath', 'breathe', 'pranayama', 'breathing'],
    '#selfcare':    ['self-care', 'self care', 'nurture', 'wellbeing'],
    '#meditation':  ['meditat', 'mindful', 'stillness', 'presence'],
  };

  for (const [tag, keywords] of Object.entries(mapping)) {
    if (keywords.some((kw) => lower.includes(kw))) generated.add(tag);
  }

  // Keep hashtags explicitly written by the user
  const userTags = text.match(/#[a-zA-Z0-9_]+/g) || [];
  userTags.forEach((t) => generated.add(t.toLowerCase()));

  return Array.from(generated);
}

// ── Hashtag Sync & Trending ───────────────────────────────────────────────
async function syncHashtagCounts() {
  const now = new Date();
  const activeCounts = await Post.aggregate([
    { $match: { expiresAt: { $gt: now } } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } },
  ]);

  await Hashtag.updateMany({}, { count: 0 });

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
  return result.map((h) => ({
    title: h.tag,
    count: h.count > 999 ? `${(h.count / 1000).toFixed(1)}k` : String(h.count),
    rawCount: h.count,
  }));
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilterRegex(keywords) {
  if (!Array.isArray(keywords) || !keywords.length) return null;
  return new RegExp('\\b(?:' + keywords.map(escapeRegExp).join('|') + ')\\b', 'i');
}

// ── Content Moderation (synchronous, static list) ────────────────────────
const WELLNESS_KEYWORDS = [
  'peace', 'calm', 'relax', 'meditat', 'breathe', 'breath', 'mindful', 'heal', 'spirit', 'yoga',
  'self-care', 'self care', 'wellness', 'health', 'mental', 'feel', 'emotion', 'grief', 'sad',
  'happy', 'joy', 'reflection', 'stress', 'anxiety', 'depression', 'overwhelm', 'mentor', 'companion',
  'life', 'love', 'heart', 'ground', 'sleep', 'rest', 'energy', 'reiki', 'chakra', 'music', 'frequency',
  'sunlight', 'nature', 'forest', 'therapy', 'boundar', 'habit', 'ritual', 'gratitude', 'kindness',
  'journey', 'growth', 'balance', 'harmony', 'awareness', 'presence', 'mindset', 'recovery', 'support',
];

function moderatePost(title, body) {
  const fullText = ((title || '') + ' ' + body).toLowerCase();

  // Check banned words
  for (const word of BANNED_WORDS) {
    const regex = new RegExp('\\b' + escapeRegExp(word) + '\\b', 'i');
    if (regex.test(fullText)) {
      return {
        approved: false,
        reason: 'Your post contains inappropriate language. Please edit and try again.',
      };
    }
  }

  // Block spam links
  if (
    (fullText.match(/https?:\/\//g) || []).length > 2 ||
    fullText.includes('telegram.me/') ||
    fullText.includes('t.me/')
  ) {
    return { approved: false, reason: 'Spam or advertisement links are not allowed.' };
  }

  // Require wellness relevance for longer posts
  if (body.length > 25) {
    const hasWellness = WELLNESS_KEYWORDS.some((kw) => fullText.includes(kw));
    if (!hasWellness) {
      return {
        approved: false,
        reason: 'Post rejected. All posts should be related to wellness, mindfulness, reflection, or community support 🌿',
      };
    }
  }

  return { approved: true };
}

// ── Rate-limit cache ──────────────────────────────────────────────────────
const recentPostsCache = new Map();

// ── GET /api/posts ────────────────────────────────────────────────────────
// Query params: sort=popular|recent, q=searchTerm, hashtag=#tag,
//               category=mindfulness|healing, page=1, limit=20
router.get('/', async (req, res) => {
  try {
    const { sort, q, hashtag, category, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const now = new Date();
    const filters = [{ expiresAt: { $gt: now } }];

    // ── Category filter (Mindfulness / Healing tabs) ──────────────────────
    // Only match on the backend-assigned categories field.
    // No keyword/body/title regex — prevents uncategorized posts bleeding through.
    if (category && category.trim()) {
      const cat = category.trim().toLowerCase();
      if (cat === 'mindfulness' || cat === 'healing') {
        filters.push({ categories: cat });
      }
    }

    // ── Hashtag filter ────────────────────────────────────────────────────
    if (hashtag && hashtag.trim()) {
      const tags = hashtag.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (tags.length) {
        const cleanTags = tags.map((t) => (t.startsWith('#') ? t.substring(1) : t));
        const tagsWithHash = tags.map((t) => (t.startsWith('#') ? t : '#' + t));
        filters.push({ hashtags: { $in: [...tags, ...tagsWithHash, ...cleanTags] } });
      }
    }

    // ── Search filter ─────────────────────────────────────────────────────
    if (q && q.trim()) {
      const queryRegex = new RegExp(escapeRegExp(q.trim()), 'i');
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

    // Popular = highest combined engagement; Recent = newest first
    const sortOrder =
      sort === 'popular'
        ? { likes: -1, comments_count: -1, shares: -1, timestampValue: -1 }
        : { timestampValue: -1 };

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
    const trending = await getTrendingHashtags();
    res.json(trending);
  } catch (err) {
    console.error('GET /api/posts/trending error:', err);
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
});

// ── POST /api/posts ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      userId, userName, userRole, userInitial, avatarColor, avatarUrl,
      title, body, hashtags, isCertified, isOnline,
    } = req.body;

    if (!userName || !body) {
      return res.status(400).json({ error: 'userName and body are required' });
    }

    // Spam / duplicate rate limit
    if (userId && userId !== 'anonymous') {
      const last = recentPostsCache.get(userId);
      if (last) {
        const diff = Date.now() - last.timestamp;
        if (diff < 10000) {
          return res.status(429).json({ error: 'Please wait a moment before posting again.' });
        }
        if (last.body === body && diff < 60000) {
          return res.status(400).json({ error: 'Duplicate post detected. Share a new reflection!' });
        }
      }
      recentPostsCache.set(userId, { body, timestamp: Date.now() });
    }

    // Content moderation (synchronous)
    const moderation = moderatePost(title, body);
    if (!moderation.approved) {
      return res.status(400).json({ error: moderation.reason });
    }

    // Auto-detect categories & hashtags from content
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

    await syncHashtagCounts();
    const trendingList = await getTrendingHashtags();

    const io = req.app.get('io');
    if (io) {
      io.emit('postCreated', post.toObject());
      io.emit('trendingUpdated', trendingList);
    }

    res.status(201).json(post);
  } catch (err) {
    console.error('POST /api/posts error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// ── POST /api/posts/:id/like ──────────────────────────────────────────────
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike: remove userId from likedBy
      post.likedBy = post.likedBy.filter(id => id !== userId);
    } else {
      // Like: add userId to likedBy
      post.likedBy.push(userId);
    }

    // likes count is always derived from likedBy array length
    post.likes = post.likedBy.length;
    // keep legacy liked field in sync (true if anyone has liked)
    post.liked = post.likedBy.length > 0;

    await post.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('postLiked', {
        id: post.id,
        likes: post.likes,
        likedBy: post.likedBy,
      });
    }

    res.json({ id: post.id, likes: post.likes, likedBy: post.likedBy });
  } catch (err) {
    console.error('POST /api/posts/:id/like error:', err);
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
      id: 'c-' + uuidv4(),
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous',
      userInitial: userInitial || 'A',
      avatarColor: avatarColor || '#2D6A4F',
      text: text.trim(),
      createdAt: Date.now(),
    };

    post.comments.push(comment);
    post.comments_count = post.comments.length;
    await post.save();

    const io = req.app.get('io');
    if (io) io.emit('commentAdded', { postId: post.id, comment });

    res.status(201).json(comment);
  } catch (err) {
    console.error('POST /api/posts/:id/comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// ── POST /api/posts/:id/share ─────────────────────────────────────────────
router.post('/:id/share', async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.shares = (post.shares || 0) + 1;
    await post.save();

    const io = req.app.get('io');
    if (io) io.emit('postShared', { id: post.id, shares: post.shares });

    res.json({ id: post.id, shares: post.shares });
  } catch (err) {
    console.error('POST /api/posts/:id/share error:', err);
    res.status(500).json({ error: 'Failed to update share count' });
  }
});

module.exports = router;
