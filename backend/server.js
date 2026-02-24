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
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

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
      { expiresIn: "7d" },
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
      { expiresIn: "7d" },
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

async function startServer() {
  await connectMongo();
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
