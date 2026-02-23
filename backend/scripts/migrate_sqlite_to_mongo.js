const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Database = require("better-sqlite3");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "data", "nirvaha.db");

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment.");
  process.exit(1);
}

if (!fs.existsSync(DB_PATH)) {
  console.error(`SQLite database not found at ${DB_PATH}`);
  process.exit(1);
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
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: false },
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
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: false },
);

const Meditation = mongoose.model("Meditation", meditationSchema);
const Sound = mongoose.model("Sound", soundSchema);

async function connectMongo() {
  await mongoose.connect(MONGODB_URI, { autoIndex: true });
  console.log("Connected to MongoDB Atlas");
}

function readMeditations(sqliteDb) {
  const rows = sqliteDb.prepare("SELECT * FROM meditations").all();
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    duration: row.duration_minutes,
    level: row.level || "",
    category: row.category || "",
    description: row.description || "",
    status: row.status || "Draft",
    thumbnailUrl: row.thumbnail_url || "",
    bannerUrl: row.banner_url || "",
    audioUrl: row.audio_url || "",
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  }));
}

function readSounds(sqliteDb) {
  const rows = sqliteDb.prepare("SELECT * FROM sounds").all();
  return rows.map((row) => {
    let mood = [];
    if (row.mood_tags) {
      try {
        mood = JSON.parse(row.mood_tags);
      } catch (error) {
        mood = [];
      }
    }

    return {
      id: row.id,
      title: row.title,
      artist: row.artist || "",
      frequency: row.frequency || "",
      duration: row.duration_minutes,
      category: row.category || "",
      description: row.description || "",
      status: row.status || "Draft",
      thumbnailUrl: row.thumbnail_url || "",
      bannerUrl: row.banner_url || "",
      audioUrl: row.audio_url || "",
      mood,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    };
  });
}

async function upsertMany(model, items) {
  if (items.length === 0) return;

  const ops = items.map((item) => ({
    updateOne: {
      filter: { id: item.id },
      update: { $set: item },
      upsert: true,
    },
  }));

  await model.bulkWrite(ops, { ordered: false });
}

async function migrate() {
  const sqliteDb = new Database(DB_PATH, { readonly: true });

  const meditations = readMeditations(sqliteDb);
  const sounds = readSounds(sqliteDb);

  console.log(`Found ${meditations.length} meditations in SQLite`);
  console.log(`Found ${sounds.length} sounds in SQLite`);

  await connectMongo();
  await upsertMany(Meditation, meditations);
  await upsertMany(Sound, sounds);

  sqliteDb.close();
  await mongoose.disconnect();

  console.log("Migration completed successfully");
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
