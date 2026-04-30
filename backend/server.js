const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + uuidv4();
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
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only audio and image files are allowed."),
      );
    }
  },
});

const USE_LOCAL_DB = process.env.USE_LOCAL_DB === "true" || !MONGODB_URI;
let mongoConnected = false;

// In-memory database for development (when MongoDB is unavailable)
const localDB = {
  users: [],
  meditations: [],
  sounds: [],
  marketplaceRequests: [],
  marketplaceItems: [],
};

// Initialize local admin user for development
async function initLocalAdminUser() {
  const adminEmail = "admin@nirvaha.com";
  const adminExists = localDB.users.find((u) => u.email === adminEmail);

  if (!adminExists) {
    const adminPassword = "N1rv@h@Adm!n#2025@Secure";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    localDB.users.push({
      id: uuidv4(),
      name: "Nirvaha Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      profile: {
        mobile: "+1-ADMIN-001",
        age: "",
        gender: "Not Specified",
        address: "Nirvaha Headquarters",
        education: "Administrator",
        healthCondition: "Not Applicable",
      },
    });

    console.log("✓ Local admin user initialized for development");
  }
}

async function connectMongo() {
  if (!MONGODB_URI) {
    console.warn(
      "⚠️  MONGODB_URI not set. Using local JSON database for development.",
    );
    console.warn(
      "⚠️  To use MongoDB, add your IP (106.214.2.149) to MongoDB Atlas IP whitelist.",
    );
    mongoConnected = false;
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    console.log("✓ Connected to MongoDB Atlas");
    mongoConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.warn("⚠️  Falling back to local JSON database for development...");
    mongoConnected = false;
  }
}

const meditationSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    level: { type: String, default: "" },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    thumbnailUrl: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

const soundSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    title: { type: String, required: true },
    artist: { type: String, default: "" },
    frequency: { type: String, default: "" },
    duration: { type: Number, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    thumbnailUrl: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    mood: { type: [String], default: [] },
  },
  { timestamps: true },
);

const companionApplicationSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    experience: { type: String, default: "" },
    location: { type: String, default: "" },
    languages: { type: String, default: "" },
    specialties: { type: String, default: "" },
    certifications: { type: String, default: "" },
    hourlyRate: { type: Number, default: 0 },
    callRate: { type: Number, default: 0 },
    availability: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    website: { type: String, default: "" },
    socialLinks: { type: String, default: "" },
    whyJoin: { type: String, default: "" },
    status: { type: String, default: "pending" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Meditation = mongoose.model("Meditation", meditationSchema);
const Sound = mongoose.model("Sound", soundSchema);
const CompanionApplication = mongoose.model(
  "CompanionApplication",
  companionApplicationSchema,
);

// Content Management Schema
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ["text", "image", "html", "json", "number"],
      default: "text",
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    section: { type: String, required: true, index: true },
    description: { type: String },
  },
  { timestamps: true },
);

const Content = mongoose.model("Content", contentSchema);

// Marketplace Request Schema
const marketplaceRequestSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    type: {
      type: String,
      enum: ["session", "retreat", "product"],
      required: true,
    },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    userId: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: String, default: null },
  },
  { timestamps: true },
);

const MarketplaceRequest = mongoose.model(
  "MarketplaceRequest",
  marketplaceRequestSchema,
);

// Marketplace Item Schema (approved items shown in user marketplace)
const marketplaceItemSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    requestId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["session", "retreat", "product"],
      required: true,
    },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: String, default: null },
    completedAt: { type: Date, default: null },
    completedBy: { type: String, default: null },
  },
  { timestamps: true },
);

const MarketplaceItem = mongoose.model(
  "MarketplaceItem",
  marketplaceItemSchema,
);

// User Schema for Authentication
const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile: {
      mobile: { type: String, default: "" },
      age: { type: String, default: "" },
      gender: { type: String, default: "" },
      address: { type: String, default: "" },
      education: { type: String, default: "" },
      healthCondition: { type: String, default: "" },
    },
    // Wellness stats
    stats: {
      sessionsPlayed: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      wellnessScore: { type: Number, default: 50 },
      lastPlayedDate: { type: String, default: null },
      weeklyMinutes: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
      activityLog: { type: [String], default: [] }, // Array of YYYY-MM-DD strings
    },
    bio: { type: String, default: "Spiritual Seeker • Meditation Enthusiast" },
    location: { type: String, default: "Hyderabad, India" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

// Post Schema for Community
const postSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    userId: { type: String, default: "anonymous" },
    userName: { type: String, required: true },
    userRole: { type: String, default: "Community Member" },
    userInitial: { type: String, required: true },
    avatarColor: { type: String, default: "#2D6A4F" },
    timestampValue: { type: Number, default: () => Date.now() },
    title: { type: String, required: true },
    body: { type: String, required: true },
    hashtags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },
    comments: [
      {
        id: String,
        userId: String,
        userName: String,
        userInitial: String,
        avatarColor: String,
        text: String,
        createdAt: Number
      }
    ],
    isCertified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: "0" } }
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

// Mentor Profile Schema for Community Right Sidebar
const mentorProfileSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    specialty: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    avatarColor: { type: String, default: "#2D6A4F" },
    followers: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    followed: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);

async function seedMongo() {
  // Skip seeding if MongoDB not connected
  if (!mongoConnected) {
    console.log("⏭️  Skipping MongoDB seed (using local database)");
    return;
  }

  // Seed default admin user
  const adminEmail = "admin@nirvaha.com";
  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    const adminPassword = "N1rv@h@Adm!n#2025@Secure"; // Strong default password
    const hashedPassword = await bcrypt.hash(adminPassword, 12); // Higher salt rounds for security

    const adminUser = new User({
      id: uuidv4(),
      name: "Nirvaha Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      profile: {
        mobile: "+1-ADMIN-001",
        age: "",
        gender: "Not Specified",
        address: "Nirvaha Headquarters",
        education: "Administrator",
        healthCondition: "Not Applicable",
      },
    });

    await adminUser.save();
    console.log("✓ Default admin user created successfully");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 ADMIN CREDENTIALS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  IMPORTANT: Change this password immediately!");
    console.log("⚠️  This is a TEMPORARY credential for development.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }

  const meditationCount = await Meditation.countDocuments();
  // Sample meditation data removed - admin panel starts empty

  const soundCount = await Sound.countDocuments();
  // Sample sound data removed - admin panel starts empty

  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    const now = Date.now();
    const seedPosts = [
      {
        id: `post-${now}-1`,
        userId: "seed1",
        userName: "Elena Rodriguez",
        userRole: "Community Member",
        userInitial: "E",
        avatarColor: "#2D6A4F",
        timestampValue: now - 1000 * 60 * 5, // 5 mins ago
        title: "Finding peace in the chaos",
        body: "Today was incredibly overwhelming. I felt like I couldn't catch my breath with all the deadlines. But I forced myself to step away for 10 minutes and just sit by the window. It didn't solve my problems, but it gave me the space to breathe. Sometimes that's all we can do. How do you all ground yourselves on hard days? #anxiety #grounding #mentalhealth",
        hashtags: ["anxiety", "grounding", "mentalhealth"],
        likes: 42,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      },
      {
        id: `post-${now}-2`,
        userId: "seed2",
        userName: "Marcus Chen",
        userRole: "Community Member",
        userInitial: "M",
        avatarColor: "#52B788",
        timestampValue: now - 1000 * 60 * 45, // 45 mins ago
        title: "Grief comes in waves",
        body: "It's been a year since I lost my dad. Some days I feel fine, but today the grief hit me like a physical weight. I'm learning that moving on doesn't mean forgetting, it means carrying the love forward. To anyone else missing someone today, I see you. You're not alone in this heavy feeling. #grief #healing #loss",
        hashtags: ["grief", "healing", "loss"],
        likes: 134,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      },
      {
        id: `post-${now}-3`,
        userId: "seed3",
        userName: "Dr. Sarah Jenkins",
        userRole: "Clinical Psychologist",
        userInitial: "S",
        avatarColor: "#1B4332",
        timestampValue: now - 1000 * 60 * 60 * 2, // 2 hours ago
        title: "A reminder about boundaries",
        body: "Saying 'no' is a complete sentence. You do not owe anyone an explanation for protecting your peace and your energy. It feels uncomfortable at first, but it is the most profound act of self-care. What is one boundary you're struggling to set this week? Let's discuss. #boundaries #selfcare #psychology",
        hashtags: ["boundaries", "selfcare", "psychology"],
        likes: 289,
        liked: false,
        comments: [],
        isCertified: true,
        isOnline: true,
      },
      {
        id: `post-${now}-4`,
        userId: "seed4",
        userName: "Aisha Patel",
        userRole: "Wellness Enthusiast",
        userInitial: "A",
        avatarColor: "#74C69D",
        timestampValue: now - 1000 * 60 * 60 * 3, // 3 hours ago
        title: "Sleep hygiene changed my life",
        body: "I used to scroll on my phone until 2 AM every night. A week ago, I started leaving my phone in the kitchen at 9 PM and reading a physical book instead. The difference in my anxiety levels and morning energy is staggering. It's hard to break the habit, but it's so worth it. #sleep #habits #mentalhealth",
        hashtags: ["sleep", "habits", "mentalhealth"],
        likes: 88,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: false,
      },
      {
        id: `post-${now}-5`,
        userId: "seed5",
        userName: "David Kim",
        userRole: "Meditation Guide",
        userInitial: "D",
        avatarColor: "#2D6A4F",
        timestampValue: now - 1000 * 60 * 60 * 5, // 5 hours ago
        title: "The myth of 'clearing your mind'",
        body: "Meditation isn't about stopping your thoughts. That's impossible. It's about changing your relationship with them. Notice the thought, label it 'thinking', and return to the breath. You haven't failed if you get distracted; waking up from the distraction IS the practice. #meditation #mindfulness",
        hashtags: ["meditation", "mindfulness"],
        likes: 412,
        liked: false,
        comments: [],
        isCertified: true,
        isOnline: true,
      },
      {
        id: `post-${now}-6`,
        userId: "seed6",
        userName: "Liam O'Connor",
        userRole: "Community Member",
        userInitial: "L",
        avatarColor: "#40916C",
        timestampValue: now - 1000 * 60 * 60 * 8, // 8 hours ago
        title: "Struggling with imposter syndrome today",
        body: "Just started a new job and I feel completely out of my depth. I keep waiting for them to realize they made a mistake hiring me. Does this feeling ever actually go away, or do we just get better at ignoring it? #impostersyndrome #career #stress",
        hashtags: ["impostersyndrome", "career", "stress"],
        likes: 156,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      },
      {
        id: `post-${now}-7`,
        userId: "seed7",
        userName: "Priya Sharma",
        userRole: "Yoga Instructor",
        userInitial: "P",
        avatarColor: "#1B4332",
        timestampValue: now - 1000 * 60 * 60 * 10, // 10 hours ago
        title: "Your body holds your emotions",
        body: "Ever wonder why you cry during hip-opening yoga poses? Our hips and psoas muscles are emotional junk drawers where we store stress and unresolved trauma. When we stretch them, we release it. Cry if you need to. It's beautiful. #yoga #somatichealing #trauma",
        hashtags: ["yoga", "somatichealing", "trauma"],
        likes: 275,
        liked: false,
        comments: [],
        isCertified: true,
        isOnline: false,
      },
      {
        id: `post-${now}-8`,
        userId: "seed8",
        userName: "Sam Taylor",
        userRole: "Community Member",
        userInitial: "S",
        avatarColor: "#52B788",
        timestampValue: now - 1000 * 60 * 60 * 12, // 12 hours ago
        title: "Celebrating a small win",
        body: "I actually cooked a meal today instead of ordering takeout. It sounds so small, but when you're depressed, even boiling water feels like climbing a mountain. I'm proud of myself today. #depression #smallwins #recovery",
        hashtags: ["depression", "smallwins", "recovery"],
        likes: 543,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      },
      {
        id: `post-${now}-9`,
        userId: "seed9",
        userName: "Chloe Evans",
        userRole: "Community Member",
        userInitial: "C",
        avatarColor: "#74C69D",
        timestampValue: now - 1000 * 60 * 60 * 15, // 15 hours ago
        title: "Toxic positivity is exhausting",
        body: "Sometimes things just suck, and telling someone to 'look on the bright side' is invalidating. It's okay to sit in the dark for a little while and just admit that it's hard. We don't always need a silver lining. #toxicpositivity #mentalhealth #validation",
        hashtags: ["toxicpositivity", "mentalhealth", "validation"],
        likes: 310,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: false,
      },
      {
        id: `post-${now}-10`,
        userId: "seed10",
        userName: "Dr. Alan Grant",
        userRole: "Psychiatrist",
        userInitial: "A",
        avatarColor: "#2D6A4F",
        timestampValue: now - 1000 * 60 * 60 * 18, // 18 hours ago
        title: "Understanding your nervous system",
        body: "When you're in fight-or-flight, your prefrontal cortex (logic) shuts down. You cannot 'logic' yourself out of a panic attack. You have to send safety signals to your body first: deep sighs, cold water on the face, heavy blankets. Regulate the body, then reason with the mind. #anxiety #nervoussystem",
        hashtags: ["anxiety", "nervoussystem"],
        likes: 678,
        liked: false,
        comments: [],
        isCertified: true,
        isOnline: true,
      }
    ];
    await Post.insertMany(seedPosts);
    console.log("✓ Seeded initial community posts");
  }

  const mentorCount = await MentorProfile.countDocuments();
  if (mentorCount === 0) {
    const seedMentors = [
      {
        id: "m1",
        name: "Dr. Sarah Jenkins",
        role: "Clinical Psychologist",
        specialty: "Anxiety & Trauma",
        avatarColor: "#1B4332",
        followers: 1205,
        posts: 45,
        bio: "Specializing in somatic experiencing and trauma recovery. Believer in holistic healing.",
        followed: false,
        starred: true,
      },
      {
        id: "m2",
        name: "David Kim",
        role: "Meditation Guide",
        specialty: "Mindfulness",
        avatarColor: "#2D6A4F",
        followers: 843,
        posts: 112,
        bio: "Former monk turned modern mindfulness teacher. Making meditation accessible to everyone.",
        followed: false,
        starred: false,
      },
      {
        id: "m3",
        name: "Elena Rodriguez",
        role: "Yoga Therapist",
        specialty: "Somatic Healing",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
        avatarColor: "#52B788",
        followers: 650,
        posts: 38,
        bio: "Connecting body and mind through intentional movement and breathwork.",
        followed: false,
        starred: false,
      }
    ];
    await MentorProfile.insertMany(seedMentors);
    console.log("✓ Seeded initial mentor profiles");
  }
}

// Socket.IO connection handling
const connectedClients = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("register", (data) => {
    connectedClients.set(socket.id, data);
    console.log(`${data.role || "user"} registered:`, data.userId);
  });

  socket.on("disconnect", () => {
    const client = connectedClients.get(socket.id);
    if (client) {
      console.log(`${client.role || "user"} disconnected:`, client.userId);
      connectedClients.delete(socket.id);
    }
  });
});

// Configure app middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

// Make io accessible to routes
app.set("io", io);

app.use("/uploads", express.static(UPLOADS_DIR));

// ============================================
// AUTHENTICATION ROUTES
// ============================================
const JWT_SECRET =
  process.env.JWT_SECRET || "nirvaha-secret-key-please-change-in-production";

// Register new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user",
      profile: {
        mobile: "",
        age: "",
        gender: "",
        address: "",
        education: "",
        healthCondition: "",
      },
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "365d" },
    );

    // Return user data (without password)
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user;

    // Use local database if MongoDB not available
    if (!mongoConnected) {
      user = localDB.users.find((u) => u.email === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      // Use MongoDB database
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "365d" },
    );

    // Return user data (without password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Simplified Login (as requested)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user;
    if (!mongoConnected) {
      user = localDB.users.find((u) => u.email === email.toLowerCase());
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // In a real system we'd check password, but keeping it flexible for the demo login
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid && password !== "demo123" && password !== "sathvika123") { // Allow development passwords
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Logout (as requested)
app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Get current user (as requested)
app.get("/api/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let user;
    if (!mongoConnected) {
      user = localDB.users.find((u) => u.id === decoded.id);
    } else {
      user = await User.findOne({ id: decoded.id });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        bio: user.bio,
        location: user.location
      }
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ============================================
// END AUTHENTICATION ROUTES
// ============================================

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
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
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ error: "File upload failed", message: error.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

function splitList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toAdminCompanion(app) {
  return {
    id: app.id,
    name: app.fullName,
    email: app.email,
    expertise: app.title,
    specialties: splitList(app.specialties),
    languages: splitList(app.languages),
    rating: 0,
    status: app.status || "pending",
    appliedDate: app.submittedAt
      ? new Date(app.submittedAt).toISOString().split("T")[0]
      : "",
    bio: app.bio || "",
    profileImage: app.profileImage || "",
    coverImage: app.coverImage || "",
    location: app.location || "",
    pricing: {
      chat: Number.isFinite(app.callRate) ? app.callRate : 0,
      video: Number.isFinite(app.hourlyRate) ? app.hourlyRate : 0,
    },
    availability: splitList(app.availability),
  };
}

function toPublicCompanion(app) {
  return {
    id: app.id,
    name: app.fullName,
    title: app.title,
    avatar: app.profileImage || "",
    coverImage: app.coverImage || "",
    availability: app.availability || "Available",
    rating: 4.8,
    reviews: 0,
    sessions: 0,
    location: app.location || "",
    bio: app.bio || "",
    specialties: splitList(app.specialties),
    hourlyRate: app.hourlyRate || 0,
    callRate: app.callRate || 0,
  };
}

app.get("/api/companion-applications", async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && status !== "all") {
    filter.status = status;
  }

  const applications = await CompanionApplication.find(filter)
    .sort({ createdAt: -1 })
    .lean();
  res.json(applications.map(toAdminCompanion));
});

app.get("/api/companion-applications/:id", async (req, res) => {
  const { id } = req.params;
  const application = await CompanionApplication.findOne({ id }).lean();
  if (!application) {
    return res.status(404).json({ error: "application not found" });
  }
  res.json({
    id: application.id,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    title: application.title,
    bio: application.bio,
    experience: application.experience,
    location: application.location,
    languages: application.languages,
    specialties: application.specialties,
    certifications: application.certifications,
    hourlyRate: application.hourlyRate,
    callRate: application.callRate,
    availability: application.availability,
    profileImage: application.profileImage,
    coverImage: application.coverImage,
    website: application.website,
    socialLinks: application.socialLinks,
    whyJoin: application.whyJoin,
    status: application.status,
    submittedAt: application.submittedAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  });
});

app.post("/api/companion-applications", async (req, res) => {
  const payload = req.body || {};
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "title",
    "bio",
    "experience",
    "location",
    "languages",
    "specialties",
    "hourlyRate",
    "callRate",
    "whyJoin",
  ];
  const missing = requiredFields.filter((field) => !payload[field]);
  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      fields: missing,
    });
  }

  const application = await CompanionApplication.create({
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    title: payload.title,
    bio: payload.bio,
    experience: payload.experience,
    location: payload.location,
    languages: payload.languages,
    specialties: payload.specialties,
    certifications: payload.certifications || "",
    hourlyRate: Number(payload.hourlyRate) || 0,
    callRate: Number(payload.callRate) || 0,
    availability: payload.availability || "",
    profileImage: payload.profileImage || "",
    coverImage: payload.coverImage || "",
    website: payload.website || "",
    socialLinks: payload.socialLinks || "",
    whyJoin: payload.whyJoin,
    status: "pending",
    submittedAt: new Date(),
  });

  // Emit real-time event for admin
  const io = req.app.get("io");
  io.emit("new-companion-request", {
    id: application.id,
    fullName: application.fullName,
    email: application.email,
    title: application.title,
    status: application.status,
    submittedAt: application.submittedAt,
  });

  res.status(201).json({
    id: application.id,
    status: application.status,
    submittedAt: application.submittedAt,
  });
});

app.put("/api/companion-applications/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};

  const updated = await CompanionApplication.findOneAndUpdate(
    { id },
    {
      ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
      ...(payload.name !== undefined ? { fullName: payload.name } : {}),
      ...(payload.email !== undefined ? { email: payload.email } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.expertise !== undefined ? { title: payload.expertise } : {}),
      ...(payload.bio !== undefined ? { bio: payload.bio } : {}),
      ...(payload.experience !== undefined
        ? { experience: payload.experience }
        : {}),
      ...(payload.location !== undefined ? { location: payload.location } : {}),
      ...(payload.languages !== undefined
        ? { languages: payload.languages }
        : {}),
      ...(payload.specialties !== undefined
        ? { specialties: payload.specialties }
        : {}),
      ...(payload.certifications !== undefined
        ? { certifications: payload.certifications }
        : {}),
      ...(payload.hourlyRate !== undefined
        ? { hourlyRate: Number(payload.hourlyRate) || 0 }
        : {}),
      ...(payload.callRate !== undefined
        ? { callRate: Number(payload.callRate) || 0 }
        : {}),
      ...(payload.pricingChat !== undefined
        ? { callRate: Number(payload.pricingChat) || 0 }
        : {}),
      ...(payload.pricingVideo !== undefined
        ? { hourlyRate: Number(payload.pricingVideo) || 0 }
        : {}),
      ...(payload.availability !== undefined
        ? { availability: payload.availability }
        : {}),
      ...(payload.profileImage !== undefined
        ? { profileImage: payload.profileImage }
        : {}),
      ...(payload.coverImage !== undefined
        ? { coverImage: payload.coverImage }
        : {}),
      ...(payload.website !== undefined ? { website: payload.website } : {}),
      ...(payload.socialLinks !== undefined
        ? { socialLinks: payload.socialLinks }
        : {}),
      ...(payload.whyJoin !== undefined ? { whyJoin: payload.whyJoin } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
    },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return res.status(404).json({ error: "application not found" });
  }

  res.json(toAdminCompanion(updated));
});

app.patch("/api/companion-applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }

  const updated = await CompanionApplication.findOneAndUpdate(
    { id },
    { status },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return res.status(404).json({ error: "application not found" });
  }

  // Emit real-time status update
  const io = req.app.get("io");
  io.emit("request-status-updated", {
    id: updated.id,
    status: updated.status,
    fullName: updated.fullName,
    updatedAt: updated.updatedAt,
  });

  res.json(toAdminCompanion(updated));
});

app.delete("/api/companion-applications/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await CompanionApplication.deleteOne({ id });
  if (deleted.deletedCount === 0) {
    return res.status(404).json({ error: "application not found" });
  }
  res.json({ ok: true });
});

app.get("/api/companions", async (req, res) => {
  const approved = await CompanionApplication.find({ status: "approved" })
    .sort({ updatedAt: -1 })
    .lean();
  res.json({
    success: true,
    data: approved.map(toPublicCompanion),
  });
});

app.get("/api/meditations", async (req, res) => {
  try {
    if (!mongoConnected) {
      // Return local database meditations
      return res.json(localDB.meditations || []);
    }

    const meditations = await Meditation.find().sort({ createdAt: -1 }).lean();
    res.json(
      meditations.map((item) => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        level: item.level || "",
        category: item.category || "",
        description: item.description || "",
        status: item.status || "Draft",
        thumbnailUrl: item.thumbnailUrl || "",
        bannerUrl: item.bannerUrl || "",
        audioUrl: item.audioUrl || "",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/meditations", async (req, res) => {
  const {
    title,
    duration,
    level,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
  } = req.body || {};

  if (!title || typeof duration !== "number") {
    return res.status(400).json({ error: "title and duration are required" });
  }

  const created = await Meditation.create({
    title,
    duration,
    level: level || "",
    category: category || "",
    description: description || "",
    status: status || "Draft",
    thumbnailUrl: thumbnailUrl || "",
    audioUrl: audioUrl || "",
    bannerUrl: bannerUrl || "",
  });

  res.status(201).json({
    id: created.id,
    title: created.title,
    duration: created.duration,
    level: created.level || "",
    category: created.category || "",
    description: created.description || "",
    status: created.status || "Draft",
    thumbnailUrl: created.thumbnailUrl || "",
    bannerUrl: created.bannerUrl || "",
    audioUrl: created.audioUrl || "",
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  });
});

app.put("/api/meditations/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    duration,
    level,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
  } = req.body || {};

  const updated = await Meditation.findOneAndUpdate(
    { id },
    {
      ...(title !== undefined ? { title } : {}),
      ...(typeof duration === "number" ? { duration } : {}),
      ...(level !== undefined ? { level } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
      ...(audioUrl !== undefined ? { audioUrl } : {}),
      ...(bannerUrl !== undefined ? { bannerUrl } : {}),
    },
    { new: true, runValidators: true, timestamps: true },
  );

  if (!updated) {
    return res.status(404).json({ error: "meditation not found" });
  }

  res.json({
    id: updated.id,
    title: updated.title,
    duration: updated.duration,
    level: updated.level || "",
    category: updated.category || "",
    description: updated.description || "",
    status: updated.status || "Draft",
    thumbnailUrl: updated.thumbnailUrl || "",
    bannerUrl: updated.bannerUrl || "",
    audioUrl: updated.audioUrl || "",
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
});

app.delete("/api/meditations/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Meditation.deleteOne({ id });
  if (deleted.deletedCount === 0) {
    return res.status(404).json({ error: "meditation not found" });
  }
  res.json({ ok: true });
});

app.get("/api/sounds", async (req, res) => {
  try {
    if (!mongoConnected) {
      // Return local database sounds
      return res.json(localDB.sounds || []);
    }

    const sounds = await Sound.find().sort({ createdAt: -1 }).lean();
    res.json(
      sounds.map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist || "",
        frequency: item.frequency || "",
        duration: item.duration,
        category: item.category || "",
        description: item.description || "",
        status: item.status || "Draft",
        thumbnailUrl: item.thumbnailUrl || "",
        bannerUrl: item.bannerUrl || "",
        audioUrl: item.audioUrl || "",
        mood: Array.isArray(item.mood) ? item.mood : [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/sounds", async (req, res) => {
  const {
    title,
    artist,
    frequency,
    duration,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
    mood,
  } = req.body || {};

  if (!title || typeof duration !== "number") {
    return res.status(400).json({ error: "title and duration are required" });
  }

  const created = await Sound.create({
    title,
    artist: artist || "",
    frequency: frequency || "",
    duration,
    category: category || "",
    description: description || "",
    status: status || "Draft",
    thumbnailUrl: thumbnailUrl || "",
    audioUrl: audioUrl || "",
    bannerUrl: bannerUrl || "",
    mood: Array.isArray(mood) ? mood : [],
  });

  res.status(201).json({
    id: created.id,
    title: created.title,
    artist: created.artist || "",
    frequency: created.frequency || "",
    duration: created.duration,
    category: created.category || "",
    description: created.description || "",
    status: created.status || "Draft",
    thumbnailUrl: created.thumbnailUrl || "",
    bannerUrl: created.bannerUrl || "",
    audioUrl: created.audioUrl || "",
    mood: Array.isArray(created.mood) ? created.mood : [],
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  });
});

app.put("/api/sounds/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    artist,
    frequency,
    duration,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
    mood,
  } = req.body || {};

  const updated = await Sound.findOneAndUpdate(
    { id },
    {
      ...(title !== undefined ? { title } : {}),
      ...(artist !== undefined ? { artist } : {}),
      ...(frequency !== undefined ? { frequency } : {}),
      ...(typeof duration === "number" ? { duration } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
      ...(audioUrl !== undefined ? { audioUrl } : {}),
      ...(bannerUrl !== undefined ? { bannerUrl } : {}),
      ...(mood !== undefined ? { mood: Array.isArray(mood) ? mood : [] } : {}),
    },
    { new: true, runValidators: true, timestamps: true },
  );

  if (!updated) {
    return res.status(404).json({ error: "sound not found" });
  }

  res.json({
    id: updated.id,
    title: updated.title,
    artist: updated.artist || "",
    frequency: updated.frequency || "",
    duration: updated.duration,
    category: updated.category || "",
    description: updated.description || "",
    status: updated.status || "Draft",
    thumbnailUrl: updated.thumbnailUrl || "",
    bannerUrl: updated.bannerUrl || "",
    audioUrl: updated.audioUrl || "",
    mood: Array.isArray(updated.mood) ? updated.mood : [],
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
});

app.delete("/api/sounds/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Sound.deleteOne({ id });
  if (deleted.deletedCount === 0) {
    return res.status(404).json({ error: "sound not found" });
  }
  res.json({ ok: true });
});

// Admin endpoint to clear all data (for development)
app.post("/api/admin/clear-data", async (req, res) => {
  try {
    if (!mongoConnected) {
      // Clear local database
      localDB.meditations = [];
      localDB.sounds = [];
      console.log("✓ Local database cleared");
      return res.json({
        message: "All data cleared successfully",
        dataCleared: true,
      });
    }

    // Clear MongoDB collections
    await Meditation.deleteMany({});
    await Sound.deleteMany({});
    console.log("✓ MongoDB collections cleared");

    res.json({ message: "All data cleared successfully", dataCleared: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CONTENT MANAGEMENT API ==========

// Get all content (public)
app.get("/api/content", async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { section } : {};
    const content = await Content.find(filter).sort({ section: 1, key: 1 });

    const formatted = content.reduce((acc, item) => {
      acc[item.key] = {
        value: item.value,
        type: item.type,
        section: item.section,
        updatedAt: item.updatedAt,
      };
      return acc;
    }, {});

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get content by key (public)
app.get("/api/content/:key", async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all content items for admin
app.get("/api/content-admin/all", async (req, res) => {
  try {
    const content = await Content.find().sort({ section: 1, key: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update content (admin)
app.put("/api/content/:key", async (req, res) => {
  try {
    const { value, type, section, description } = req.body;

    const content = await Content.findOneAndUpdate(
      { key: req.params.key },
      {
        value,
        type: type || "text",
        section: section || "general",
        description,
      },
      { new: true, upsert: true },
    );

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("content-updated", {
      key: content.key,
      value: content.value,
      type: content.type,
      section: content.section,
      updatedAt: content.updatedAt,
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image content
app.post("/api/content/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { key, section, description } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const content = await Content.findOneAndUpdate(
      { key },
      {
        value: imageUrl,
        type: "image",
        section: section || "general",
        description,
      },
      { new: true, upsert: true },
    );

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("content-updated", {
      key: content.key,
      value: content.value,
      type: content.type,
      section: content.section,
      updatedAt: content.updatedAt,
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete content
app.delete("/api/content/:key", async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({ key: req.params.key });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("content-deleted", { key: req.params.key });

    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== MARKETPLACE ENDPOINTS ==========

// GET all marketplace requests (admin only)
app.get("/api/marketplace/requests", async (req, res) => {
  try {
    if (!mongoConnected) {
      const sorted = [...localDB.marketplaceRequests].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
      );
      return res.json(sorted);
    }

    const requests = await MarketplaceRequest.find().sort({ createdAt: -1 });
    return res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single marketplace request
app.get("/api/marketplace/requests/:id", async (req, res) => {
  try {
    if (!mongoConnected) {
      const request = localDB.marketplaceRequests.find(
        (item) => item.id === req.params.id,
      );
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      return res.json(request);
    }

    const request = await MarketplaceRequest.findOne({ id: req.params.id });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    return res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new marketplace request
app.post("/api/marketplace/requests", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: "Type and data are required" });
    }

    if (!mongoConnected) {
      const request = {
        id: uuidv4(),
        type,
        data,
        status: "pending",
        userId: req.body.userId || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      localDB.marketplaceRequests.unshift(request);

      const io = req.app.get("io");
      io.emit("marketplace-new-request", request);

      return res.status(201).json(request);
    }

    const request = new MarketplaceRequest({
      type,
      data,
      status: "pending",
      userId: req.body.userId || "",
    });

    await request.save();

    // Emit real-time update to admin
    const io = req.app.get("io");
    io.emit("marketplace-new-request", request);

    return res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT approve marketplace request (admin only)
app.put("/api/marketplace/requests/:id/approve", async (req, res) => {
  try {
    if (!mongoConnected) {
      const requestIndex = localDB.marketplaceRequests.findIndex(
        (item) => item.id === req.params.id,
      );
      if (requestIndex === -1) {
        return res.status(404).json({ error: "Request not found" });
      }

      const approvedAt = new Date();
      const approvedBy = req.body.approvedBy || "admin";

      localDB.marketplaceRequests[requestIndex] = {
        ...localDB.marketplaceRequests[requestIndex],
        status: "approved",
        approvedAt,
        approvedBy,
        updatedAt: Date.now(),
      };

      const existingItem = localDB.marketplaceItems.find(
        (item) => item.requestId === req.params.id,
      );

      if (!existingItem) {
        const item = {
          id: uuidv4(),
          requestId: req.params.id,
          type: localDB.marketplaceRequests[requestIndex].type,
          status: "active",
          data: localDB.marketplaceRequests[requestIndex].data,
          approvedAt,
          approvedBy,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        localDB.marketplaceItems.unshift(item);
      }

      const io = req.app.get("io");
      io.emit(
        "marketplace-request-approved",
        localDB.marketplaceRequests[requestIndex],
      );
      io.emit("marketplace-item-created", { requestId: req.params.id });

      return res.json(localDB.marketplaceRequests[requestIndex]);
    }

    const request = await MarketplaceRequest.findOneAndUpdate(
      { id: req.params.id },
      {
        status: "approved",
        approvedAt: new Date(),
        approvedBy: req.body.approvedBy || "admin",
      },
      { new: true },
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const existingItem = await MarketplaceItem.findOne({
      requestId: request.id,
    });
    if (!existingItem) {
      const item = new MarketplaceItem({
        requestId: request.id,
        type: request.type,
        status: "active",
        data: request.data,
        approvedAt: request.approvedAt || new Date(),
        approvedBy: request.approvedBy || "admin",
      });
      await item.save();
    }

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("marketplace-request-approved", request);
    io.emit("marketplace-item-created", { requestId: request.id });

    return res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE marketplace request
app.delete("/api/marketplace/requests/:id", async (req, res) => {
  try {
    if (!mongoConnected) {
      const requestIndex = localDB.marketplaceRequests.findIndex(
        (item) => item.id === req.params.id,
      );
      if (requestIndex === -1) {
        return res.status(404).json({ error: "Request not found" });
      }

      localDB.marketplaceRequests.splice(requestIndex, 1);

      const io = req.app.get("io");
      io.emit("marketplace-request-deleted", { id: req.params.id });

      return res.json({ message: "Request deleted successfully" });
    }

    const request = await MarketplaceRequest.findOneAndDelete({
      id: req.params.id,
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("marketplace-request-deleted", { id: req.params.id });

    return res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET approved marketplace items for user dashboard
app.get("/api/marketplace/items", async (req, res) => {
  try {
    const status = req.query.status || "active";

    if (!mongoConnected) {
      const items = localDB.marketplaceItems.filter(
        (item) => item.status === status,
      );
      return res.json(items);
    }

    const items = await MarketplaceItem.find({ status }).sort({
      createdAt: -1,
    });
    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT complete marketplace item (removes from user dashboard)
app.put("/api/marketplace/items/:id/complete", async (req, res) => {
  try {
    if (!mongoConnected) {
      const itemIndex = localDB.marketplaceItems.findIndex(
        (item) => item.id === req.params.id,
      );
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
      }

      localDB.marketplaceItems[itemIndex] = {
        ...localDB.marketplaceItems[itemIndex],
        status: "completed",
        completedAt: new Date(),
        completedBy: req.body.completedBy || "admin",
        updatedAt: Date.now(),
      };

      const io = req.app.get("io");
      io.emit("marketplace-item-completed", { id: req.params.id });

      return res.json(localDB.marketplaceItems[itemIndex]);
    }

    const item = await MarketplaceItem.findOneAndUpdate(
      { id: req.params.id },
      {
        status: "completed",
        completedAt: new Date(),
        completedBy: req.body.completedBy || "admin",
      },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const io = req.app.get("io");
    io.emit("marketplace-item-completed", { id: req.params.id });

    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// AI GUIDE CHAT ENDPOINT
// ============================================

const chatResponses = [
  // Greetings
  {
    patterns: ["hello", "hi", "namaste", "hey", "good morning", "good evening", "good afternoon"],
    responses: [
      "Namaste 🙏 Welcome back. How are you feeling in this moment? I'm here to guide you.",
      "Hello, dear soul 🌿 Take a breath. What's on your mind today?",
      "Namaste 🙏 I'm glad you're here. What would you like to explore — meditation, breathwork, or just a quiet conversation?",
    ],
  },
  // Stress / overwhelm
  {
    patterns: ["stress", "stressed", "overwhelm", "overwhelmed", "pressure", "too much", "burnout", "exhausted", "tired"],
    responses: [
      "I hear you. Stress is your body asking for rest. Let's try the 4-7-8 breath: inhale for 4 counts, hold for 7, exhale for 8. Repeat 3 times. How do you feel after? 🌬️",
      "When life feels heavy, return to the breath. Place one hand on your chest, one on your belly. Breathe slowly and feel the rise and fall. You are safe. 🌿",
      "Stress is a signal, not a sentence. Try grounding yourself: name 5 things you can see, 4 you can touch, 3 you can hear. This brings you back to now. 🍃",
    ],
  },
  // Anxiety / fear
  {
    patterns: ["anxious", "anxiety", "fear", "scared", "panic", "worry", "worried", "nervous", "uneasy"],
    responses: [
      "Anxiety often lives in the future. Bring yourself back to this moment. Feel your feet on the floor. Take one slow breath. You are here, and you are okay. 🌸",
      "Try box breathing: inhale 4 counts → hold 4 → exhale 4 → hold 4. Repeat 4 times. This activates your parasympathetic nervous system and calms the mind. 🧘",
      "Fear is a visitor, not a resident. Acknowledge it gently: 'I notice I feel anxious.' Naming it reduces its power. What is the fear telling you? 💙",
    ],
  },
  // Meditation
  {
    patterns: ["meditat", "mindful", "focus", "concentrate", "present", "awareness", "conscious"],
    responses: [
      "Meditation begins with one breath. Sit comfortably, close your eyes, and simply observe your breath without changing it. When thoughts arise, gently return. Start with just 5 minutes. 🧘‍♀️",
      "Mindfulness is noticing what is, without judgment. Right now — what do you hear? What do you feel? This simple act is meditation. 🌿",
      "For focus, try trataka: gaze softly at a candle flame or a single point for 5 minutes without blinking. It trains the mind to stay present. 🕯️",
    ],
  },
  // Sleep
  {
    patterns: ["sleep", "insomnia", "can't sleep", "sleepless", "rest", "tired", "night", "bedtime"],
    responses: [
      "For better sleep, try yoga nidra — lie down, close your eyes, and slowly scan your body from toes to crown, releasing tension at each point. It's deeply restorative. 🌙",
      "Before bed, try the 4-7-8 breathing technique. It slows your heart rate and signals your nervous system that it's safe to rest. 😴",
      "Create a sleep ritual: dim lights 30 minutes before bed, avoid screens, and spend 5 minutes writing down 3 things you're grateful for. This quiets the mind. 🌟",
    ],
  },
  // Sadness / grief
  {
    patterns: ["sad", "sadness", "grief", "loss", "cry", "crying", "heartbreak", "lonely", "alone", "depressed", "depression"],
    responses: [
      "Sadness is not weakness — it is the heart processing something that mattered. Allow yourself to feel it fully. Grief is love with nowhere to go. 💙",
      "When sadness visits, try placing your hand on your heart and saying: 'I am here for you.' Self-compassion is the first medicine. 🌸",
      "You don't have to carry this alone. Journaling can help — write freely without judgment. What is your heart trying to say? 📖",
    ],
  },
  // Anger
  {
    patterns: ["angry", "anger", "frustrated", "frustration", "irritated", "rage", "mad"],
    responses: [
      "Anger is energy — it needs to move. Try 5 rounds of forceful exhales through the nose (Kapalabhati breath). It releases tension from the body. 🔥",
      "Before reacting, pause and take 3 deep breaths. Anger often carries a message beneath it — what is it protecting? 🌿",
      "Physical movement helps anger dissolve. Even a 5-minute brisk walk can shift your state significantly. 🚶",
    ],
  },
  // Breathing
  {
    patterns: ["breath", "breathe", "breathing", "pranayama", "inhale", "exhale"],
    responses: [
      "Pranayama is the bridge between body and mind. Try Nadi Shodhana (alternate nostril breathing): close right nostril, inhale left → close left, exhale right → inhale right → exhale left. Repeat 5 cycles. 🌬️",
      "The simplest breath practice: inhale for 4 counts, exhale for 6. The longer exhale activates the vagus nerve and calms your entire system. 🧘",
      "Breath is always available to you. Right now, take one conscious breath — slow, deep, complete. Notice how you feel after just one. 🌿",
    ],
  },
  // Gratitude / positivity
  {
    patterns: ["grateful", "gratitude", "thankful", "positive", "happy", "joy", "peace", "calm", "good"],
    responses: [
      "Gratitude is a practice that rewires the brain toward abundance. Try writing 3 specific things you're grateful for each morning — not just 'family' but why, in detail. 🌟",
      "Joy is your natural state. When you feel it, pause and breathe it in fully. Let it anchor in your body. The more you notice joy, the more it grows. 🌸",
      "Peace is not the absence of noise — it's the presence of stillness within the noise. You're already cultivating it by being here. 🙏",
    ],
  },
  // Purpose / meaning
  {
    patterns: ["purpose", "meaning", "lost", "direction", "goal", "life", "why", "confused"],
    responses: [
      "When we feel lost, it often means we've outgrown where we were. Sit quietly and ask: 'What brings me alive?' Not what should, but what actually does. 🌿",
      "Purpose isn't found — it's cultivated through action. Start small: what is one thing you can do today that feels meaningful? Begin there. 🌱",
      "The Bhagavad Gita teaches: 'You have a right to perform your duties, but not to the fruits of your actions.' Focus on the doing, not the outcome. 🙏",
    ],
  },
  // Yoga / body
  {
    patterns: ["yoga", "body", "stretch", "pain", "back", "neck", "posture", "exercise", "movement"],
    responses: [
      "For back tension, try child's pose: kneel, sit back on heels, extend arms forward, forehead to floor. Hold for 10 breaths. It releases the entire spine. 🧘‍♀️",
      "Neck tension often holds unexpressed emotions. Slowly drop your right ear to your right shoulder, hold 5 breaths, then switch. Breathe into the stretch. 🌿",
      "A simple morning yoga sequence: cat-cow (5 rounds) → downward dog (5 breaths) → warrior I (3 breaths each side). This awakens the whole body. 🌅",
    ],
  },
  // Sound healing
  {
    patterns: ["sound", "music", "healing", "frequency", "vibration", "singing bowl", "mantra", "chant"],
    responses: [
      "Sound healing works through resonance — specific frequencies entrain your brainwaves. 432 Hz promotes calm, 528 Hz is associated with healing. Try listening with headphones in a quiet space. 🎵",
      "The mantra 'So Hum' (I am that) is one of the most powerful. Inhale silently 'So', exhale 'Hum'. Repeat for 5 minutes. It synchronises breath and mind. 🕉️",
      "Tibetan singing bowls create standing waves that the body absorbs. Even listening to recordings can shift your nervous system into a parasympathetic state. 🎶",
    ],
  },
  // Spiritual / wisdom
  {
    patterns: ["spiritual", "soul", "spirit", "divine", "god", "universe", "energy", "chakra", "aura", "karma"],
    responses: [
      "The Upanishads say: 'Tat tvam asi' — Thou art that. You are not separate from the universe. You are an expression of it. 🌌",
      "Chakra balancing begins with awareness. Sit quietly and scan from the base of your spine to the crown of your head. Where do you feel tension or numbness? That's where attention is needed. 🌈",
      "Karma is not punishment — it is the law of cause and effect. Every thought, word, and action plants a seed. What seeds are you planting today? 🌱",
    ],
  },
  // Grounding exercise request
  {
    patterns: ["ground", "grounding", "anchor", "present", "here", "now"],
    responses: [
      "Let's ground together. Feel your feet on the floor. Press them down gently. Now name: 5 things you see → 4 you can touch → 3 you hear → 2 you smell → 1 you taste. You are here. You are safe. 🌍",
      "Grounding practice: stand barefoot if possible. Feel the earth beneath you. Breathe slowly. Imagine roots growing from your feet deep into the earth. You are supported. 🌿",
    ],
  },
  // Thank you / closing
  {
    patterns: ["thank", "thanks", "bye", "goodbye", "see you", "later", "appreciate"],
    responses: [
      "It was my honour to be with you today 🙏 Carry this stillness with you. Return whenever you need. Namaste.",
      "Thank you for sharing this time with me. Remember — peace is always one breath away. Take care of yourself. 🌸",
      "Namaste 🙏 May your day be filled with clarity and calm. I'm always here when you need guidance.",
    ],
  },
];

const fallbackResponses = [
  "That's a meaningful reflection. Can you tell me more about what you're experiencing? I'm here to listen and guide. 🙏",
  "I hear you. Sometimes the most powerful thing we can do is simply pause and breathe. What does your body feel right now? 🌿",
  "Every feeling is valid. Let's explore this together — what would feel most supportive for you right now: breathwork, meditation, or just talking? 💙",
  "The path inward is always available. What is your heart asking for in this moment? 🌸",
  "Ancient wisdom teaches us that awareness itself is healing. You're already on the path by being here and asking. 🕉️",
];

app.post("/api/chat", (req, res) => {
  const { message } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  const lower = message.toLowerCase();
  const trimmed = message.trim();

  // Find matching response category with better matching logic
  let matched = null;
  let bestMatch = 0;
  
  for (const category of chatResponses) {
    const matches = category.patterns.filter((p) => lower.includes(p)).length;
    if (matches > bestMatch) {
      bestMatch = matches;
      matched = category;
    }
  }

  // Additional context-based responses
  let contextualResponse = null;
  
  // Check for questions
  if (trimmed.includes("?") || trimmed.includes("how") || trimmed.includes("what") || trimmed.includes("why")) {
    contextualResponse = "That's a thoughtful question. Let's explore this together. What aspects would you like to understand better? 🌿";
  }
  
  // Check for emotional words
  if (lower.includes("feel") || lower.includes("feeling") || lower.includes("emotion")) {
    contextualResponse = "Feelings are our inner guidance system. What emotion are you noticing right now? There's no judgment here — only presence. 💙";
  }

  const pool = contextualResponse ? [contextualResponse] : (matched ? matched.responses : fallbackResponses);
  const reply = pool[Math.floor(Math.random() * pool.length)];

  // Simulate slight thinking delay on client side — respond immediately
  res.json({ reply });
});

// ============================================
// END AI GUIDE CHAT ENDPOINT
// ============================================

// ============================================
// COMMUNITY ROUTES
// ============================================

app.get("/api/posts", async (req, res) => {
  try {
    const { search, type } = req.query;
    let filter = { expiresAt: { $gt: new Date() } };
    if (search) {
      const normalizedSearch = search.replace(/[#]/g, "").trim();
      if (normalizedSearch) {
        const escapedQ = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const qRegex = new RegExp(escapedQ, "i");
        filter.$or = [
          { title: qRegex },
          { body: qRegex },
          { userName: qRegex },
          { hashtags: qRegex }
        ];
      }
    }
    let sortObj = { timestampValue: -1 };
    if (type === "popular") sortObj = { likes: -1 };

    const posts = await Post.find(filter).sort(sortObj).lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const { title, body, userName, userRole, userInitial, avatarColor, hashtags } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }
    const newPost = new Post({
      id: `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: "current",
      userName: userName || "Anonymous",
      userRole: userRole || "Community Member",
      userInitial: userInitial || "A",
      avatarColor: avatarColor || "#2D6A4F",
      timestampValue: Date.now(),
      title,
      body,
      hashtags: hashtags || [],
    });
    await newPost.save();
    const io = req.app.get("io");
    if (io) {
      io.emit("post_created", newPost);
      if (hashtags && hashtags.length > 0) {
        io.emit("trending_updated");
      }
    }
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { liked } = req.body;
    const post = await Post.findOne({ id });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (liked !== undefined) {
      post.likes = liked ? post.likes + 1 : Math.max(0, post.likes - 1);
    } else {
      post.likes += 1;
    }
    await post.save();
    const io = req.app.get("io");
    if (io) io.emit("post_updated", post);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update like" });
  }
});

app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, userInitial, avatarColor, text } = req.body;
    
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: userId || "anonymous",
      userName: userName || "Anonymous",
      userInitial: userInitial || "A",
      avatarColor: avatarColor || "#2D6A4F",
      text,
      createdAt: Date.now()
    };

    post.comments.push(newComment);
    await post.save();

    const io = req.app.get("io");
    if (io) io.emit("post_updated", post);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

app.get("/api/trending", async (req, res) => {
  try {
    // Aggregate posts to count hashtags
    const trending = await Post.aggregate([
      { $unwind: "$hashtags" },
      { $group: { _id: { $toLower: "$hashtags" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const tags = trending.map(t => ({
      title: `#${t._id}`,
      count: t.count.toString() + (t.count === 1 ? " Post" : " Posts"),
      isHot: t.count >= 2
    }));
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trending tags" });
  }
});

app.get("/api/profiles", async (req, res) => {
  try {
    const profiles = await MentorProfile.find().lean();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.json({ posts: [], tags: [] });
    
    const normalizedQ = q.replace(/[#]/g, "").trim();
    if (!normalizedQ) return res.json({ posts: [], tags: [] });
    
    const escapedQ = normalizedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQ, "i");
    
    let sortObj = { timestampValue: -1 };
    if (type === "popular") sortObj = { likes: -1 };

    // Search posts
    const posts = await Post.find({
      expiresAt: { $gt: new Date() },
      $or: [
        { title: regex },
        { body: regex },
        { userName: regex },
        { hashtags: regex }
      ]
    }).sort(sortObj).limit(20).lean();
    
    // Search tags (from aggregation)
    const tagMatches = await Post.aggregate([
      { $unwind: "$hashtags" },
      { $match: { hashtags: regex } },
      { $group: { _id: { $toLower: "$hashtags" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const tags = tagMatches.map(t => ({
      title: `#${t._id}`,
      count: t.count.toString() + (t.count === 1 ? " Post" : " Posts")
    }));
    
    res.json({ posts, tags });
  } catch (error) {
    res.status(500).json({ error: "Failed to perform search" });
  }
});

// ============================================
// PROFILE ROUTES
// ============================================

// GET /api/profile?userId=...
app.get("/api/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const user = await User.findOne({ id: userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Also count actual posts from community
    const postCount = await Post.countDocuments({ userId, expiresAt: { $gt: new Date() } });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio || "Spiritual Seeker • Meditation Enthusiast",
      location: user.location || "Hyderabad, India",
      stats: {
        sessionsPlayed: user.stats?.sessionsPlayed || 0,
        streak: user.stats?.streak || 0,
        totalMinutes: user.stats?.totalMinutes || 0,
        posts: postCount,
        followers: user.stats?.followers || 0,
        following: user.stats?.following || 0,
        wellnessScore: user.stats?.wellnessScore || 50,
        weeklyMinutes: user.stats?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0],
        activityLog: user.stats?.activityLog || [],
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST /api/profile/update
app.post("/api/profile/update", async (req, res) => {
  try {
    const { userId, bio, location, stats, avatar } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (stats) {
      Object.keys(stats).forEach(key => {
        updateData[`stats.${key}`] = stats[key];
      });
    }

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    const io = req.app.get("io");
    if (io) io.emit("profile_updated", { userId, stats: user.stats });

    res.json({ success: true, stats: user.stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Helper function to validate streak consistency
function validateStreakConsistency(userStats) {
  const { streak = 0, sessions = 0, todaySessions = 0, todayPracticeTime = 0 } = userStats;
  
  // Reset streak to 0 if no sessions exist and no practice time
  if (streak > 0 && sessions === 0 && todaySessions === 0 && todayPracticeTime === 0) {
    return 0;
  }
  
  // Ensure streak is valid (should be at least 1 if there are sessions)
  if ((sessions > 0 || todaySessions > 0 || todayPracticeTime > 0) && streak === 0) {
    return 1;
  }
  
  return streak;
}

// POST /api/profile/increment-game — called when a game session is won
app.post("/api/profile/increment-game", async (req, res) => {
  try {
    const { userId, moves } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Streak logic
    const today = new Date().toISOString().split("T")[0];
    let newStreak = user.stats?.streak || 0;
    const lastPlayed = user.stats?.lastPlayedDate;
    if (lastPlayed) {
      const diffMs = new Date(today) - new Date(lastPlayed);
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    // Wellness score: increment by 1, cap at 100
    const newWellness = Math.min(100, (user.stats?.wellnessScore || 50) + 1);

    // Update weekly minutes
    const dayOfWeek = (new Date().getDay() + 6) % 7; // Map Sun(0) to Index 6, Mon(1) to Index 0
    const weeklyMinutes = [...(user.stats?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0])];
    weeklyMinutes[dayOfWeek] += 15;

    // Activity log
    const activityLog = [...(user.stats?.activityLog || [])];
    if (!activityLog.includes(today)) {
      activityLog.push(today);
    }

    // Reset daily stats if last active was not today
    const lastActiveDate = user.stats?.lastActiveDate;
    let todaySessions = 1;
    let todayPracticeTime = 15;
    
    if (lastActiveDate === today) {
      todaySessions = (user.stats?.todaySessions || 0) + 1;
      todayPracticeTime = (user.stats?.todayPracticeTime || 0) + 15;
    }

    // Calculate updated stats for validation
    const currentSessions = (user.stats?.sessions || 0) + 1;
    const updatedStats = {
      ...user.stats,
      streak: newStreak,
      sessions: currentSessions,
      todaySessions,
      todayPracticeTime,
      lastPlayedDate: today,
      lastActiveDate: today
    };

    // Validate streak consistency
    const validatedStreak = validateStreakConsistency(updatedStats);

    await User.updateOne({ id: userId }, {
      $inc: { 
        "stats.sessionsPlayed": 1, 
        "stats.totalMinutes": 15,
        "stats.sessions": 1
      },
      $set: {
        "stats.streak": validatedStreak,
        "stats.lastPlayedDate": today,
        "stats.lastActiveDate": today,
        "stats.wellnessScore": newWellness,
        "stats.weeklyMinutes": weeklyMinutes,
        "stats.activityLog": activityLog,
        "stats.todaySessions": todaySessions,
        "stats.todayPracticeTime": todayPracticeTime,
      }
    });

    const updatedUser = await User.findOne({ id: userId }).lean();
    const io = req.app.get("io");
    if (io) io.emit("profile_updated", { userId, stats: updatedUser.stats });

    res.json({ success: true, stats: updatedUser.stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to increment game stats" });
  }
});

app.post("/api/profile/log-session", async (req, res) => {
  const { userId, duration, sessionType } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID required" });
  
  try {
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date().toISOString().split("T")[0];
    const lastPlayed = user.stats?.lastPlayedDate;
    const sessionDuration = duration || 10;
    
    let newStreak = user.stats?.streak || 0;
    if (lastPlayed) {
      const diffMs = new Date(today) - new Date(lastPlayed);
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    // Dynamic Wellness Score calculation
    const totalMins = (user.stats?.totalMinutes || 0) + sessionDuration;
    const newWellness = Math.min(100, (newStreak * 2) + Math.floor(totalMins / 10));

    const dayOfWeek = (new Date().getDay() + 6) % 7;
    const weeklyMinutes = [...(user.stats?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0])];
    weeklyMinutes[dayOfWeek] += sessionDuration;

    const activityLog = [...(user.stats?.activityLog || [])];
    if (!activityLog.includes(today)) activityLog.push(today);

    // Reset daily stats if last active was not today
    const lastActiveDate = user.stats?.lastActiveDate;
    let todaySessions = 1;
    let todayPracticeTime = sessionDuration;
    
    if (lastActiveDate === today) {
      todaySessions = (user.stats?.todaySessions || 0) + 1;
      todayPracticeTime = (user.stats?.todayPracticeTime || 0) + sessionDuration;
    }

    // Track meditation and sound minutes based on session type
    let meditationMinutes = user.stats?.meditationMinutes || 0;
    let soundMinutes = user.stats?.soundMinutes || 0;
    let totalSessions = user.stats?.sessions || 0;

    if (sessionType === 'meditation') {
      meditationMinutes += sessionDuration;
    } else if (sessionType === 'sound') {
      soundMinutes += sessionDuration;
    }
    totalSessions += 1;

    // Calculate updated stats for validation
    const updatedStats = {
      ...user.stats,
      streak: newStreak,
      sessions: totalSessions,
      todaySessions,
      todayPracticeTime,
      lastPlayedDate: today,
      lastActiveDate: today
    };

    // Validate streak consistency
    const validatedStreak = validateStreakConsistency(updatedStats);

    const updateData = {
      $inc: { 
        "stats.sessionsPlayed": 1, 
        "stats.totalMinutes": sessionDuration,
        "stats.meditationMinutes": sessionType === 'meditation' ? sessionDuration : 0,
        "stats.soundMinutes": sessionType === 'sound' ? sessionDuration : 0,
        "stats.sessions": 1
      },
      $set: {
        "stats.streak": validatedStreak,
        "stats.lastPlayedDate": today,
        "stats.lastActiveDate": today,
        "stats.wellnessScore": newWellness,
        "stats.weeklyMinutes": weeklyMinutes,
        "stats.activityLog": activityLog,
        "stats.todaySessions": todaySessions,
        "stats.todayPracticeTime": todayPracticeTime,
      }
    };

    await User.updateOne({ id: userId }, updateData);

    const updatedUser = await User.findOne({ id: userId }).lean();
    const io = req.app.get("io");
    if (io) io.emit("profile_updated", { userId, stats: updatedUser.stats });

    res.json({ success: true, stats: updatedUser.stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to log session" });
  }
});

// POST /api/profile/log-sound-session — called when a sound session is completed (≥1 min)
app.post("/api/profile/log-sound-session", async (req, res) => {
  const { userId, duration } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID required" });
  
  // Only log sessions that are at least 1 minute
  if (!duration || duration < 1) {
    return res.status(400).json({ error: "Sound sessions must be at least 1 minute" });
  }
  
  try {
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date().toISOString().split("T")[0];
    const lastPlayed = user.stats?.lastPlayedDate;
    
    let newStreak = user.stats?.streak || 0;
    if (lastPlayed) {
      const diffMs = new Date(today) - new Date(lastPlayed);
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    // Dynamic Wellness Score calculation
    const totalMins = (user.stats?.totalMinutes || 0) + duration;
    const newWellness = Math.min(100, (newStreak * 2) + Math.floor(totalMins / 10));

    const dayOfWeek = (new Date().getDay() + 6) % 7;
    const weeklyMinutes = [...(user.stats?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0])];
    weeklyMinutes[dayOfWeek] += duration;

    const activityLog = [...(user.stats?.activityLog || [])];
    if (!activityLog.includes(today)) activityLog.push(today);

    // Reset daily stats if last active was not today
    const lastActiveDate = user.stats?.lastActiveDate;
    let todaySessions = 1;
    let todayPracticeTime = duration;
    
    if (lastActiveDate === today) {
      todaySessions = (user.stats?.todaySessions || 0) + 1;
      todayPracticeTime = (user.stats?.todayPracticeTime || 0) + duration;
    }

    // Calculate updated stats for validation
    const currentSessions = (user.stats?.sessions || 0) + 1;
    const currentSoundMinutes = (user.stats?.soundMinutes || 0) + duration;
    
    const updatedStats = {
      ...user.stats,
      streak: newStreak,
      sessions: currentSessions,
      todaySessions,
      todayPracticeTime,
      soundMinutes: currentSoundMinutes,
      lastPlayedDate: today,
      lastActiveDate: today
    };

    // Validate streak consistency
    const validatedStreak = validateStreakConsistency(updatedStats);

    await User.updateOne({ id: userId }, {
      $inc: { 
        "stats.sessionsPlayed": 1, 
        "stats.totalMinutes": duration,
        "stats.soundMinutes": duration,
        "stats.sessions": 1
      },
      $set: {
        "stats.streak": validatedStreak,
        "stats.lastPlayedDate": today,
        "stats.lastActiveDate": today,
        "stats.wellnessScore": newWellness,
        "stats.weeklyMinutes": weeklyMinutes,
        "stats.activityLog": activityLog,
        "stats.todaySessions": todaySessions,
        "stats.todayPracticeTime": todayPracticeTime,
      }
    });

    const updatedUser = await User.findOne({ id: userId }).lean();
    const io = req.app.get("io");
    if (io) io.emit("profile_updated", { userId, stats: updatedUser.stats });

    res.json({ success: true, stats: updatedUser.stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to log sound session" });
  }
});


async function startServer() {
  await connectMongo();
  
  // Migrate all Mumbai locations to Hyderabad
  try {
    await User.updateMany({ location: /Mumbai/i }, { $set: { location: "Hyderabad, India" } });
    console.log("Migration: Mumbai -> Hyderabad completed");
  } catch (err) {
    console.error("Migration failed:", err);
  }

  await initLocalAdminUser();
  await seedMongo();

  server.listen(PORT, () => {
    console.log(`Nirvaha backend running on port ${PORT}`);
    console.log(`Socket.IO enabled`);
    if (!mongoConnected) {
      console.log("\n⚠️  DEVELOPMENT MODE: Using local in-memory database");
      console.log("📧 Admin Login: admin@nirvaha.com");
      console.log("🔐 Password: N1rv@h@Adm!n#2025@Secure\n");
    }
  });
}

startServer();
