const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');``

// Load environment variables immediately
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const meditationRoutes = require('./routes/meditationRoutes');
const soundRoutes = require('./routes/soundRoutes');
const companionRoutes = require('./routes/companionRoutes');
const contentRoutes = require('./routes/contentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const postRoutes = require('./routes/postRoutes');
const landingRoutes = require('./modules/landing/landing.routes');
const contactRoutes = require('./modules/contact/contact.routes');

const userRoutes = require('./routes/userRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');

// Import models for seeding
const User = require('./models/User');
const Meditation = require('./models/Meditation');
const Sound = require('./models/Sound');
const Post = require('./models/Post');
const MentorProfile = require('./models/MentorProfile');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://nirvaha-wellnessllp.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuration
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    console.log('✓ Connected to MongoDB Atlas');
    mongoConnected = true;
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

  // Seed community posts
  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    const now = Date.now();
    const seedPosts = [
      {
        id: `post-${now}-1`,
        userId: 'seed1',
        userName: 'Elena Rodriguez',
        userRole: 'Community Member',
        userInitial: 'E',
        avatarColor: '#2D6A4F',
        timestampValue: now - 1000 * 60 * 5, // 5 mins ago
        title: 'Finding peace in the chaos',
        body: 'Today was incredibly overwhelming. I felt like I couldn\'t catch my breath with all the deadlines. But I forced myself to step away for 10 minutes and just sit by the window. It didn\'t solve my problems, but it gave me the space to breathe. Sometimes that\'s all we can do. How do you all ground yourselves on hard days? #anxiety #grounding #mentalhealth',
        hashtags: ['anxiety', 'grounding', 'mentalhealth'],
        likes: 42,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      },
      {
        id: `post-${now}-2`,
        userId: 'seed2',
        userName: 'Marcus Chen',
        userRole: 'Community Member',
        userInitial: 'M',
        avatarColor: '#52B788',
        timestampValue: now - 1000 * 60 * 45, // 45 mins ago
        title: 'Grief comes in waves',
        body: 'It\'s been a year since I lost my dad. Some days I feel fine, but today the grief hit me like a physical weight. I\'m learning that moving on doesn\'t mean forgetting, it means carrying the love forward. To anyone else missing someone today, I see you. You\'re not alone in this heavy feeling. #grief #healing #loss',
        hashtags: ['grief', 'healing', 'loss'],
        likes: 134,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      },
      {
        id: `post-${now}-3`,
        userId: 'seed3',
        userName: 'Dr. Sarah Jenkins',
        userRole: 'Clinical Psychologist',
        userInitial: 'S',
        avatarColor: '#1B4332',
        timestampValue: now - 1000 * 60 * 60 * 2, // 2 hours ago
        title: 'A reminder about boundaries',
        body: 'Saying \'no\' is a complete sentence. You do not owe anyone an explanation for protecting your peace and your energy. It feels uncomfortable at first, but it is the most profound act of self-care. What is one boundary you\'re struggling to set this week? Let\'s discuss. #boundaries #selfcare #psychology',
        hashtags: ['boundaries', 'selfcare', 'psychology'],
        likes: 289,
        liked: false,
        comments: [],
        isCertified: true,
        isOnline: true,
      }
    ];
    await Post.insertMany(seedPosts);
    console.log('✓ Seeded initial community posts');
  }

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
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://nirvaha-wellnessllp.vercel.app'   
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// Make io accessible to routes
app.set('io', io);

// Static files
app.use('/uploads', express.static(UPLOADS_DIR));

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
app.use('/api/reflect', reflectionRoutes);
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
]), (req, res) => {
  try {
    const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;
    const result = {};
    ['thumbnail', 'banner', 'audio'].forEach(field => {
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

// Start server
async function startServer() {
  await connectMongo();
  await initLocalAdminUser();
  await seedMongo();

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
