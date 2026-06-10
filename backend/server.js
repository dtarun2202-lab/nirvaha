const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const { cacheMiddleware, initCache } = require('./utils/cache');
const { startRetentionJobs, ensureBackupDir } = require('./utils/retention');
const allowedOrigins = [
  'https://nirvaha-wellnessllp.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:5001'
];

// Load environment variables immediately (explicit path to guarantee resolution)
dotenv.config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const meditationRoutes = require('./routes/meditationRoutes');
const soundRoutes = require('./routes/soundRoutes');
const poseRoutes = require('./routes/poseRoutes');
const companionRoutes = require('./routes/companionRoutes');
const contentRoutes = require('./routes/contentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const postRoutes = require('./routes/postRoutes');
const landingRoutes = require('./modules/landing/landing.routes');
const contactRoutes = require('./modules/contact/contact.routes');

const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');
const successStoriesRoutes = require('./routes/successStoriesRoutes');
const wellnessRetreatRoutes = require('./routes/wellnessRetreatRoutes');
const wellnessSessionRoutes = require('./routes/wellnessSessionRoutes');
const commonProblemRoutes = require('./routes/commonProblemRoutes');
const essentialGuidanceRoutes = require('./routes/essentialGuidanceRoutes');
const healingFrequenciesRoutes = require('./routes/healingFrequenciesRoutes');
const { syncAllApprovedCompanionsToUsers } = require('./utils/companionStatus');

// Import models for seeding
const User = require('./models/User');
const Meditation = require('./models/Meditation');
const Sound = require('./models/Sound');
const Post = require('./models/Post');
const MentorProfile = require('./models/MentorProfile');
const Hashtag = require('./models/Hashtag');
const Pose = require('./models/Pose');

const app = express();
app.disable('x-powered-by');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://nirvaha-three.vercel.app',
      'https://nirvaha-production.up.railway.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const BACKUP_DIR = path.join(__dirname, 'backups');

if (process.env.REDIS_URL) {
  try {
    const { createClient } = require('redis');
    const { createAdapter } = require('@socket.io/redis-adapter');
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log('✓ Socket.IO Redis adapter enabled for horizontal scaling');
      })
      .catch((err) => {
        console.warn('⚠️ Socket.IO Redis adapter failed to connect:', err.message);
      });
  } catch (err) {
    console.warn('⚠️ Socket.IO Redis adapter is not available:', err.message);
  }
}

// Configuration
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    const allowedMimes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio, image, and document files (PDF/DOC) are allowed.'));
    }
  },
});

// Database connection
let mongoConnected = false;

// In-memory database for development (when MongoDB is unavailable)
const localDB = {
  users: [],
  meditations: [],
  sounds: [],
  marketplaceRequests: [],
  marketplaceItems: [],
  bookings: [],
};

// Initialize local admin user for development
async function initLocalAdminUser() {
  const adminEmail = 'admin@nirvaha.com';
  const adminExists = localDB.users.find((u) => u.email === adminEmail);

  if (!adminExists) {
    const adminPassword = 'N1rv@h@Adm!n#2025@Secure';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    localDB.users.push({
      id: uuidv4(),
      name: 'Nirvaha Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      profile: {
        mobile: '+1-ADMIN-001',
        age: '',
        gender: 'Not Specified',
        address: 'Nirvaha Headquarters',
        education: 'Administrator',
        healthCondition: 'Not Applicable',
      },
      createdAt: new Date(),
    });

    console.log('✓ Local admin user initialized for development');
  }

  // Initialize default user gayarsathvika@gmail.com
  const userEmail = 'gayarsathvika@gmail.com';
  const userExists = localDB.users.find((u) => u.email === userEmail);

  if (!userExists) {
    const userPassword = 'sathvika123';
    const hashedPassword = await bcrypt.hash(userPassword, 12);

    localDB.users.push({
      id: uuidv4(),
      name: 'Sathvika',
      email: userEmail,
      password: hashedPassword,
      role: 'user',
      profile: {
        mobile: '',
        age: '',
        gender: '',
        address: '',
        education: '',
        healthCondition: '',
      },
      createdAt: new Date(),
    });

    console.log('✓ Default user initialized: gayarsathvika@gmail.com');
  }
}

async function connectMongo() {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set. Using local JSON database for development.');
    console.warn('⚠️  To use MongoDB, add your IP (106.214.2.149) to MongoDB Atlas IP whitelist.');
    mongoConnected = false;
    return;
  }

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: false,
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 30,
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✓ Connected to MongoDB Atlas');
    mongoConnected = true;
    try {
      await syncAllApprovedCompanionsToUsers();
    } catch (syncErr) {
      console.error('[companion-sync] Startup backfill failed:', syncErr.message);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.warn('⚠️  Falling back to local JSON database for development...');
    mongoConnected = false;
  }
}

// Seeding functions
async function seedMongo() {
  // Skip seeding if MongoDB not connected
  if (!mongoConnected) {
    console.log('⏭️  Skipping MongoDB seed (using local database)');
    return;
  }

  // Seed default admin user
  const adminEmail = 'admin@nirvaha.com';
  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    const adminPassword = 'N1rv@h@Adm!n#2025@Secure';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      id: uuidv4(),
      name: 'Nirvaha Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      profile: {
        mobile: '+1-ADMIN-001',
        age: '',
        gender: 'Not Specified',
        address: 'Nirvaha Headquarters',
        education: 'Administrator',
        healthCondition: 'Not Applicable',
      },
    });

    await adminUser.save();
    console.log('✓ Default admin user created successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 ADMIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change this password immediately!');
    console.log('⚠️  This is a TEMPORARY credential for development.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // Community posts are created by real users only — no seed data.

  // Seed mentor profiles
  const mentorCount = await MentorProfile.countDocuments();
  if (mentorCount === 0) {
    const seedMentors = [
      {
        id: 'm1',
        name: 'Dr. Sarah Jenkins',
        role: 'Clinical Psychologist',
        specialty: 'Anxiety & Trauma',
        avatarColor: '#1B4332',
        followers: 1205,
        posts: 45,
        bio: 'Specializing in somatic experiencing and trauma recovery. Believer in holistic healing.',
        followed: false,
        starred: true,
      },
      {
        id: 'm2',
        name: 'David Kim',
        role: 'Meditation Guide',
        specialty: 'Mindfulness',
        avatarColor: '#2D6A4F',
        followers: 843,
        posts: 112,
        bio: 'Former monk turned modern mindfulness teacher. Making meditation accessible to everyone.',
        followed: false,
        starred: false,
      },
      {
        id: 'm3',
        name: 'Elena Rodriguez',
        role: 'Yoga Therapist',
        specialty: 'Somatic Healing',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
        avatarColor: '#52B788',
        followers: 650,
        posts: 38,
        bio: 'Connecting body and mind through intentional movement and breathwork.',
        followed: false,
        starred: false,
      }
    ];
    await MentorProfile.insertMany(seedMentors);
    console.log('✓ Seeded initial mentor profiles');
  }

  // Seed default hashtags
  const hashtagCount = await Hashtag.countDocuments();
  if (hashtagCount === 0) {
    const defaultHashtags = [
      { tag: '#healing', count: 5 }, // seed some initial counts to match design examples
      { tag: '#mindfulness', count: 2 },
      { tag: '#anxiety', count: 0 },
      { tag: '#peace', count: 0 },
      { tag: '#meditation', count: 0 },
      { tag: '#wellness', count: 0 },
      { tag: '#grief', count: 0 },
      { tag: '#selfcare', count: 0 }
    ];
    await Hashtag.insertMany(defaultHashtags);
    console.log('✓ Seeded initial default hashtags');
  }

  // Seed Wellness Sessions
  const WellnessSession = require('./models/WellnessSession');
  const sessionCount = await WellnessSession.countDocuments();
  if (sessionCount === 0) {
    const defaultSessions = [
      {
        title: "Morning Calm",
        category: "Meditation",
        mood: ["Calm", "Focused"],
        tags: ["Focus", "Morning", "Clarity"],
        duration: "10 min",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation/Indoor-Calm-Meditation.mp3",
        description: "Start your day with clarity and intention. A gentle awakening for the mind and body to optimize energy and presence.",
        match: "98% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series',
        isOriginal: true,
        displayOrder: 1,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Sunrise Breathing",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                description: "Connect with your breath and set a strong positive intention for the day ahead.",
                videoUrl: "/audio/eposide 1 mind waves.mp3.mp3"
              },
              {
                id: "2",
                title: "Peaceful Mind",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                description: "Clear out stale energy with a dynamic deep breathing rhythm that resets the nervous system.",
                videoUrl: "/audio/eposide 2 root cause.mp3.mp3"
              },
              {
                id: "3",
                title: "Focus Energy",
                duration: "18 min",
                thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                description: "Settle into silent presence and release lingering mental worries or busy chatter.",
                videoUrl: "/audio/eposide 3 stillness ladder.mp3.mp3"
              },
              {
                id: "4",
                title: "Calm Reset",
                duration: "25 min",
                thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop",
                description: "A gentle wind-down session guiding your awareness into deeply restorative delta wave sleep.",
                videoUrl: "/audio/eposide 4 Abhyas engine.mp3.mp3"
              },
              {
                id: "5",
                title: "Deep Presence",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                description: "Settle into silent, deep presence, cultivating ultimate awareness of the present moment.",
                videoUrl: "/audio/eposide 5 Vairagya Method.mp3.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Deep Sleep Guide",
        category: "Sleep Stories",
        mood: ["Relaxed", "Sleepy"],
        tags: ["Sleep", "Relaxation", "Rest"],
        duration: "45 min",
        thumbnail: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        banner: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        audioSource: "/audio/sleep/sleep-delta.mp3",
        description: "Drift into a restorative, deep slumber. Let go of the day's tension and embrace the peaceful night.",
        match: "95% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Series',
        displayOrder: 2,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Sunset Wind-down",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                description: "Unwind your body from the day's stress with gentle box breathing and mindfulness.",
                videoUrl: "/audio/eposide 1 gita 3.mp3.mp3"
              },
              {
                id: "2",
                title: "Ocean Sleep Waves",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                description: "Drift away to the soothing sound of rolling ocean waves recorded live at high tide.",
                videoUrl: "/audio/eposide 2 gita ch 2.mp3.mp3"
              },
              {
                id: "3",
                title: "Celestial Journey",
                duration: "25 min",
                thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                description: "A cosmic visualization guiding your mind through the quiet depths of the night sky.",
                videoUrl: "/audio/eposiode 3 gita ch 4.mp3.mp3"
              },
              {
                id: "4",
                title: "Whispering Pines",
                duration: "30 min",
                thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop",
                description: "Listen to a peaceful forest tale designed to trigger deep delta sleep cycles.",
                videoUrl: "/audio/eposide 4 gita ch 5.mp3.mp3"
              },
              {
                id: "5",
                title: "Midnight Harmony",
                duration: "45 min",
                thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                description: "Settle into final restorative sleep with smooth binaural soundscapes and soft rain.",
                videoUrl: "/audio/eposide 5 gita ch 6.mp3.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Anxiety Relief",
        category: "Anxiety Relief",
        mood: ["Relieved", "Grounded"],
        tags: ["Anxiety", "Calm", "Grounding"],
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/stress/stress-nature.mp3",
        description: "Ground yourself completely in the present moment. A powerful tool designed to dissolve overwhelming thoughts, panic, and fast heartbeats.",
        match: "99% Match",
        year: "2025",
        rating: "TV-14",
        type: 'Series',
        displayOrder: 3,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Calming the Storm",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                description: "A quick emergency anchor session to lower high levels of acute nervous adrenaline.",
                videoUrl: "/audio/Mind Reset 1 when mind stops.mp3.mp3"
              },
              {
                id: "2",
                title: "Somatic Calm Flow",
                duration: "18 min",
                thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                description: "Gentle physical releases designed to open tightness in the chest, throat, and shoulders.",
                videoUrl: "/audio/Mind Reset 2 Worst Case.mp3.mp3"
              },
              {
                id: "3",
                title: "Heart-Mind Connection",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                description: "Synchronize your breathing with positive heart affirmations to generate deep safety.",
                videoUrl: "/audio/Mind reset 3 Small decision big pressure.mp3.mp3"
              },
              {
                id: "4",
                title: "Grounded Presence",
                duration: "22 min",
                thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                description: "A meditation session engaging the 5-4-3-2-1 sensory technique for absolute presence.",
                videoUrl: "/audio/Mind reset 4 Repeat repeat thinking.mp3.mp3"
              },
              {
                id: "5",
                title: "Panic De-escalation",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                description: "An emergency grounding technique for sudden waves of intense worry or overwhelming panic.",
                videoUrl: "/audio/mind reser 5 what is clarity.mp3.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Focus Flow",
        category: "Focus Training",
        mood: ["Focused", "Energized"],
        tags: ["Work", "Study", "Flow"],
        duration: "30 min",
        thumbnail: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        banner: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        audioSource: "/audio/focus/Clear-Mind-Frequencies.mp3",
        description: "Sharpen your concentration and unlock deep work states. Experience absolute precision-engineered mindfulness designed for focus.",
        match: "92% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series',
        isOriginal: true,
        displayOrder: 4,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Entering Deep Work",
                duration: "10 min",
                thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                description: "Tune your focus to absolute stillness, blocking out exterior distractions.",
                videoUrl: "/audio/Lifestyle OS - Dinacharya episode 1.mp3"
              },
              {
                id: "2",
                title: "Cognitive Ignition",
                duration: "12 min",
                thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                description: "Ignite mental sharpness with focused, rapid inhalation techniques.",
                videoUrl: "/audio/Lifestyle OS 2 - Guna Santulan episode 2.mp3"
              },
              {
                id: "3",
                title: "The Flow Trigger",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                description: "Utilize specific sensory blocks to drop straight into effortless focus states.",
                videoUrl: "/audio/Lifestyle OS 3 - Sync Food & Mind episode 3.mp3"
              },
              {
                id: "4",
                title: "Digital Detox Reset",
                duration: "18 min",
                thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                description: "Cleanse your working memory of digital fatigue and reset attention span.",
                videoUrl: "/audio/Lifestyle OS 4 - Art of sleep episode 4.mp3"
              },
              {
                id: "5",
                title: "Peak Performance Focus",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                description: "Elevate task performance with high-vibration focus breathing techniques.",
                videoUrl: "/audio/Lifestyle OS 5 - Control your senses episode 5.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Chakra Balance",
        category: "Spiritual Guidance",
        mood: ["Energized", "Balanced"],
        tags: ["Energy", "Balance", "Vitality"],
        duration: "15 min",
        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation/Crystal-Frequency-Healing.mp3",
        description: "Realign your core energetic centers. Experience a revitalizing surge of spiritual harmony and inner light.",
        match: "88% Match",
        year: "2024",
        rating: "TV-PG",
        type: 'Series',
        displayOrder: 5,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Root Alignment",
                duration: "10 min",
                thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                description: "Root your energy into stability, safety, and deep connection with the earth.",
                videoUrl: "/audio/Career anxiety and overthinking eposide 1.mp3"
              },
              {
                id: "2",
                title: "Sacred Fire",
                duration: "12 min",
                thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                description: "Stoke your internal solar fire to balance confidence and emotional power.",
                videoUrl: "/audio/Fear of Failure & Rejection eposide 2.mp3"
              },
              {
                id: "3",
                title: "Heart Awakening",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                description: "Open your energetic heart center to compassion, love, and unconditional joy.",
                videoUrl: "/audio/Healing After Heartbreak eposide 3.mp3"
              },
              {
                id: "4",
                title: "Truth & Expression",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                description: "Clear your throat chakra to communicate your absolute truth and inner expression.",
                videoUrl: "/audio/Identity — “Who am I really” eposide 4.mp3"
              },
              {
                id: "5",
                title: "Third Eye Sight",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                description: "Awaken spiritual intuition and cosmic vision with pineal activation exercises.",
                videoUrl: "/audio/Jealousy, comparison, insecurity eposide 5.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Breathwork Basics",
        category: "Breathwork",
        mood: ["Calm", "Relaxed"],
        tags: ["Breath", "Beginner", "Relaxation"],
        duration: "12 min",
        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation/Indoor-Calm-Meditation.mp3",
        description: "Master the fundamentals of conscious breathing. The ultimate starting point to optimize parasympathetic health.",
        match: "96% Match",
        year: "2025",
        rating: "TV-G",
        type: 'Series',
        displayOrder: 6,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Diaphragmatic Breath",
                duration: "12 min",
                thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                description: "Optimize vagus nerve stimulation with deep diaphragmatic expansions.",
                videoUrl: "/audio/meditation/Indoor-Calm-Meditation.mp3"
              },
              {
                id: "2",
                title: "The Box Breath",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                description: "A 4-4-4-4 holding sequence designed by Navy SEALs to secure complete stress regulation.",
                videoUrl: "/audio/meditation/Indoor-Calm-Meditation.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Midday Reset",
        category: "Inner Peace",
        mood: ["Relieved", "Energized"],
        tags: ["Work", "Quick", "Reset"],
        duration: "8 min",
        thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/stress/stress-nature.mp3",
        description: "A quick physical recalibration. Release modern office fatigue and structural spine tension in minutes.",
        match: "91% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Film',
        displayOrder: 7,
        isActive: true
      },
      {
        title: "Sleep Story: The Forest",
        category: "Sleep Stories",
        mood: ["Sleepy", "Imaginative"],
        tags: ["Story", "Nature", "Sleep"],
        duration: "35 min",
        thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/sleep/sleep-delta.mp3",
        description: "Wander through an ancient, mystical pine woodland. Drift off seamlessly under soft rain sounds.",
        match: "94% Match",
        year: "2025",
        rating: "TV-PG",
        type: 'Film',
        isOriginal: true,
        displayOrder: 8,
        isActive: true
      },
      {
        title: "Burnout Recovery",
        category: "Emotional Healing",
        mood: ["Inspired", "Focused"],
        tags: ["Creativity", "Focus", "Art"],
        duration: "25 min",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/focus/Clear-Mind-Frequencies.mp3",
        description: "Stimulate nervous relaxation and gently heal deep professional exhaustion with somatic meditations.",
        match: "89% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series',
        displayOrder: 9,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Slowing the Engine",
                duration: "18 min",
                thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
                description: "Understand the biological mechanisms of burnout and learn how to downshift.",
                videoUrl: "/audio/focus/Clear-Mind-Frequencies.mp3"
              },
              {
                id: "2",
                title: "Deep Somatic Recharging",
                duration: "22 min",
                thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=600&auto=format&fit=crop",
                description: "Re-ignite deep mitochondrial energy through targeted progressive physical relaxation.",
                videoUrl: "/audio/focus/Clear-Mind-Frequencies.mp3"
              }
            ]
          }
        ]
      },
      {
        title: "Morning Movement",
        category: "Yoga Programs",
        mood: ["Energized", "Awake"],
        tags: ["Morning", "Movement", "Vitality"],
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation/Crystal-Frequency-Healing.mp3",
        description: "Wake up your body with gentle, highly fluid Hatha yoga stretches and dynamic deep breath coordination.",
        match: "97% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Series',
        displayOrder: 10,
        isActive: true,
        seasons: [
          {
            seasonNumber: 1,
            level: 'Beginner',
            episodes: [
              {
                id: "1",
                title: "Spinal Mobilization",
                duration: "15 min",
                thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                description: "Flowing movements designed to decompress vertebrae and stimulate cerebrospinal fluid.",
                videoUrl: "/audio/meditation/Crystal-Frequency-Healing.mp3"
              },
              {
                id: "2",
                title: "Sun Salutations",
                duration: "20 min",
                thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                description: "A seamless dynamic sequence to activate core energy hubs and build early sweat.",
                videoUrl: "/audio/meditation/Crystal-Frequency-Healing.mp3"
              }
            ]
          }
        ]
      }
    ];

    await WellnessSession.insertMany(defaultSessions);
    console.log('✓ Seeded initial Wellness OTT Sessions');
  }

  // Seed Common Problems
  const CommonProblem = require('./models/CommonProblem');
  const problemCount = await CommonProblem.countDocuments();
  if (problemCount === 0) {
    const defaultDropdowns = [
      { title: "The mind seeks closure", description: "Unfinished thoughts replay because the brain wants resolution." },
      { title: "Fear keeps loops alive", description: "Stress and fear keep repetitive thinking active." },
      { title: "Thinking vs Looping", description: "Thinking solves problems. Looping repeats without progress." }
    ];

    const defaultProblems = [
      {
        title: "Burnout",
        icon: "Flame",
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        hoverBg: "hover:bg-amber-50",
        activeBg: "bg-amber-100",
        gradientFrom: "from-amber-500",
        gradientTo: "to-orange-400",
        accentColor: "#D4A574",
        accentLight: "#F9F3E8",
        modalGradient: "from-amber-400 to-orange-400",
        image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&h=400&fit=crop&q=80",
        description: "Feeling exhausted and overwhelmed from work or life demands?",
        solutions: ["Practice daily meditation", "Set healthy boundaries", "Take regular breaks", "Engage in sound healing"],
        recommendations: [
          { icon: "Clock", text: "Burnout Rest Session" },
          { icon: "Headphones", text: "Energy Reset Frequency" },
          { icon: "MessageCircle", text: "Talk to Recovery Coach" },
          { icon: "Calendar", text: "Book Rest Session" }
        ],
        dropdownSectionTitle: "Why the mind keeps repeating",
        dropdowns: defaultDropdowns,
        displayOrder: 1,
        isActive: true
      },
      {
        title: "Stress",
        icon: "Zap",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        hoverBg: "hover:bg-green-50",
        activeBg: "bg-green-100",
        gradientFrom: "from-green-500",
        gradientTo: "to-emerald-400",
        accentColor: "#A8C99F",
        accentLight: "#F0F5ED",
        modalGradient: "from-green-400 to-emerald-400",
        image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&h=400&fit=crop&q=80",
        description: "Chronic stress can impact your health and productivity.",
        solutions: ["Breathing exercises", "Mindfulness practices", "Regular physical activity", "Connect with AI companion"],
        recommendations: [
          { icon: "Clock", text: "Stress Relief Session" },
          { icon: "Headphones", text: "Calming Nature Sounds" },
          { icon: "MessageCircle", text: "Stress Management Tips" },
          { icon: "Calendar", text: "Book Stress Session" }
        ],
        dropdownSectionTitle: "Why the mind keeps repeating",
        dropdowns: defaultDropdowns,
        displayOrder: 2,
        isActive: true
      },
      {
        title: "Sleep Issues",
        icon: "Moon",
        color: "text-slate-700",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-300",
        hoverBg: "hover:bg-slate-50",
        activeBg: "bg-slate-200",
        gradientFrom: "from-slate-600",
        gradientTo: "to-blue-700",
        accentColor: "#9FA8BA",
        accentLight: "#F2F5FA",
        modalGradient: "from-slate-700 to-blue-900",
        image: "https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=600&h=400&fit=crop&q=80",
        description: "Quality sleep is essential for recovery and mental clarity.",
        solutions: ["Sleep meditation tracks", "Calming frequencies", "Evening routines", "Binaural beats"],
        recommendations: [
          { icon: "Clock", text: "Deep Sleep Session" },
          { icon: "Headphones", text: "Delta Wave Frequency" },
          { icon: "MessageCircle", text: "Sleep Coach Chat" },
          { icon: "Calendar", text: "Book Sleep Session" }
        ],
        dropdownSectionTitle: "Why the mind keeps repeating",
        dropdowns: defaultDropdowns,
        displayOrder: 3,
        isActive: true
      },
      {
        title: "High Anxiety",
        icon: "Cloud",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        hoverBg: "hover:bg-purple-50",
        activeBg: "bg-purple-100",
        gradientFrom: "from-purple-400",
        gradientTo: "to-indigo-500",
        accentColor: "#D8C5E5",
        accentLight: "#F7F3FC",
        modalGradient: "from-purple-400 to-indigo-500",
        image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&h=400&fit=crop&q=80",
        description: "Anxiety can feel overwhelming, but you can find peace.",
        solutions: ["Guided anxiety relief", "Grounding techniques", "Crystal bowl therapy", "Community support"],
        recommendations: [
          { icon: "Clock", text: "Anxiety Relief Session" },
          { icon: "Headphones", text: "Grounding Frequency" },
          { icon: "MessageCircle", text: "Talk to Anxiety Coach" },
          { icon: "Calendar", text: "Book Grounding Session" }
        ],
        dropdownSectionTitle: "Why the mind keeps repeating",
        dropdowns: defaultDropdowns,
        displayOrder: 4,
        isActive: true
      },
      {
        title: "Mood Swings",
        icon: "Activity",
        color: "text-rose-500",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        hoverBg: "hover:bg-rose-50",
        activeBg: "bg-rose-100",
        gradientFrom: "from-rose-400",
        gradientTo: "to-pink-400",
        accentColor: "#E5B8A8",
        accentLight: "#FAF0ED",
        modalGradient: "from-rose-400 to-pink-400",
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&h=400&fit=crop&q=80",
        description: "Emotional fluctuations affect your daily life.",
        solutions: ["Chakra balancing", "Emotional regulation", "Journaling exercises", "Companion sessions"],
        recommendations: [
          { icon: "Clock", text: "Mood Stabilization Session" },
          { icon: "Headphones", text: "Heart Balance Frequency" },
          { icon: "MessageCircle", text: "Emotional Regulation Tips" },
          { icon: "Calendar", text: "Book Emotion Session" }
        ],
        dropdownSectionTitle: "Why the mind keeps repeating",
        dropdowns: defaultDropdowns,
        displayOrder: 5,
        isActive: true
      },
      {
        title: "Feeling Isolated",
        icon: "Users",
        color: "text-cyan-600",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-200",
        hoverBg: "hover:bg-cyan-50",
        activeBg: "bg-cyan-100",
        gradientFrom: "from-cyan-400",
        gradientTo: "to-teal-500",
        accentColor: "#A8D4E0",
        accentLight: "#F0F8FB",
        modalGradient: "from-cyan-400 to-teal-500",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop&q=80",
        description: "Connection is a fundamental human need.",
        solutions: ["Join community groups", "Attend live sessions", "Connect with companions", "Group retreats"],
        recommendations: [
          { icon: "Clock", text: "Connection Session" },
          { icon: "Headphones", text: "Connection Healing Frequency" },
          { icon: "MessageCircle", text: "Join Companion Chat" },
          { icon: "Calendar", text: "Book Group Session" }
        ],
        dropdownSectionTitle: "Why the mind keeps repeating",
        dropdowns: defaultDropdowns,
        displayOrder: 6,
        isActive: true
      }
    ];

    await CommonProblem.insertMany(defaultProblems);
    console.log('✓ Seeded initial Common Problems');
  }
}

// Socket.IO connection handling
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register', (data) => {
    connectedClients.set(socket.id, data);
    console.log(`${data.role || 'user'} registered:`, data.userId);
  });

  socket.on('disconnect', () => {
    const client = connectedClients.get(socket.id);
    if (client) {
      console.log(`${client.role || 'user'} disconnected:`, client.userId);
      connectedClients.delete(socket.id);
    }
  });
});

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://nirvaha-production.up.railway.app',
    'https://nirvaha-wellnessllp.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cacheMiddleware());

// Make io accessible to routes
app.set('io', io);

// Static files
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/backups', express.static(BACKUP_DIR));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongo: mongoConnected, timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meditations', meditationRoutes);
app.use('/api/sounds', soundRoutes);
app.use('/api/companion', companionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reflect', reflectionRoutes);
app.use('/api/success-stories', successStoriesRoutes);
app.use('/api/wellness-retreats', wellnessRetreatRoutes);
app.use('/api/wellness-sessions', wellnessSessionRoutes);
app.use('/api/common-problems', commonProblemRoutes);
app.use('/api/essential-guidance', essentialGuidanceRoutes);
app.use('/api/healing-frequencies', healingFrequenciesRoutes);
app.use('/api', utilityRoutes);

// Legacy route compatibility (for existing frontend code)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed', message: error.message });
  }
});

// Multi-file upload for meditation/sound content
app.post('/api/upload/media', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'banner',    maxCount: 1 },
  { name: 'audio',     maxCount: 1 },
  { name: 'image',     maxCount: 1 },
]), (req, res) => {
  try {
    const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;
    const result = {};
    ['thumbnail', 'banner', 'audio', 'image'].forEach(field => {
      if (req.files && req.files[field] && req.files[field][0]) {
        result[`${field}Url`] = `${BASE}/uploads/${req.files[field][0].filename}`;
      }
    });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: 'Media upload failed', message: error.message });
  }
});

// Register pose and yoga routes
app.use('/api/poses', poseRoutes);
const yogaRoutes = require('./routes/yogaRoutes');
app.use('/api/yoga', yogaRoutes);

// Start server
async function startServer() {
  await initCache();
  await ensureBackupDir();
  await connectMongo();
  await initLocalAdminUser();
  await seedMongo();
  await startRetentionJobs();

  server.keepAliveTimeout = Number(process.env.SERVER_KEEP_ALIVE_TIMEOUT_MS) || 65000;
  server.headersTimeout = Number(process.env.SERVER_HEADERS_TIMEOUT_MS) || 70000;

  server.listen(PORT, () => {
    console.log(`🚀 Nirvaha backend running on port ${PORT}`);
    console.log(`🔌 Socket.IO enabled`);
    if (!mongoConnected) {
      console.log('\n⚠️  DEVELOPMENT MODE: Using local in-memory database');
      console.log('📧 Admin Login: admin@nirvaha.com');
      console.log('🔐 Password: N1rv@h@Adm!n#2025@Secure\n');
    }
  });
}

startServer();

module.exports = app;
