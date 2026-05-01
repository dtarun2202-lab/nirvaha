const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');

const router = express.Router();

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
];

let seedRunning = false;

async function seedIfEmpty() {
  if (seedRunning) return;
  seedRunning = true;
  try {
    const count = await Post.countDocuments();
    if (count > 0) return;  // Posts exist — never reseed

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
      timestampValue: now - (i * 72 * 60 * 1000),
      expiresAt: new Date(now + 24 * 60 * 60 * 1000),
    }));

    await Post.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} community posts`);
  } finally {
    seedRunning = false;
  }
}

// ── GET /api/posts ─────────────────────────────────────────────────────────
// Query params: sort=popular|recent|all, q=searchTerm
router.get('/', async (req, res) => {
  try {
    await seedIfEmpty();

    const { sort, q } = req.query;
    const now = new Date();
    let query = { expiresAt: { $gt: now } };

    if (q && q.trim()) {
      const term = q.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { body: { $regex: term, $options: 'i' } },
        { hashtags: { $regex: term, $options: 'i' } },
        { userName: { $regex: term, $options: 'i' } },
        { userRole: { $regex: term, $options: 'i' } },
      ];
    }

    let sortOrder;
    if (sort === 'popular') {
      // Popular: only posts with 50+ likes, sorted by likes desc
      query.likes = { $gte: 50 };
      sortOrder = { likes: -1 };
    } else if (sort === 'all') {
      // All: everything, no sort bias
      sortOrder = { _id: -1 };
    } else {
      // Recent (default): newest first
      sortOrder = { timestampValue: -1 };
    }

    const posts = await Post.find(query).sort(sortOrder).limit(50);
    res.json(posts);
  } catch (err) {
    console.error('GET /api/posts error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ── GET /api/posts/trending ───────────────────────────────────────────────
router.get('/trending', async (req, res) => {
  try {
    await seedIfEmpty();
    const now = new Date();
    const posts = await Post.find({ expiresAt: { $gt: now } }, 'hashtags likes');
    const counts = {};
    posts.forEach(p => {
      (p.hashtags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1 + Math.floor(p.likes / 20);
      });
    });
    const trending = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([title, count]) => ({
        title,
        count: count > 999 ? `${(count / 1000).toFixed(1)}k` : String(count),
      }));
    res.json(trending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
});

// ── POST /api/posts ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { userId, userName, userRole, userInitial, avatarColor, avatarUrl, title, body, hashtags, isCertified, isOnline } = req.body;
    if (!userName || !body) return res.status(400).json({ error: 'userName and body are required' });

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
      hashtags: hashtags || [],
      isCertified: isCertified || false,
      isOnline: isOnline !== undefined ? isOnline : true,
      timestampValue: Date.now(),
      likes: 0,
      liked: false,
      comments: [],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await post.save();
    const io = req.app.get('io');
    if (io) io.emit('postCreated', post);
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
    if (io) io.emit('postLiked', { id: post.id, likes: post.likes, liked: post.liked });
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
    if (io) io.emit('commentAdded', { postId: post.id, comment });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;
