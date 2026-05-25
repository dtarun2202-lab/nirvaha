const fs = require('fs').promises;
const path = require('path');
const Reflection = require('../models/Reflection');
const ReflectionArchive = require('../models/ReflectionArchive');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const REFLECTION_RETENTION_DAYS = Number(process.env.REFLECTION_RETENTION_DAYS) || 90;
const REFLECTION_ARCHIVE_DAYS = Number(process.env.REFLECTION_ARCHIVE_DAYS) || 30;
const BACKUP_RETENTION_DAYS = Number(process.env.BACKUP_RETENTION_DAYS) || 365;

async function ensureBackupDir() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
}

function buildReflectionQuery({ userId, since, until }) {
  const query = {};
  if (userId && userId !== 'anonymous') {
    query.userId = userId;
  }
  if (since) {
    query.timestamp = query.timestamp || {};
    query.timestamp.$gte = new Date(since);
  }
  if (until) {
    query.timestamp = query.timestamp || {};
    query.timestamp.$lte = new Date(until);
  }
  return query;
}

async function archiveOldReflections() {
  const archiveCutoff = new Date(Date.now() - REFLECTION_ARCHIVE_DAYS * 24 * 60 * 60 * 1000);
  try {
    const staleRecords = await Reflection.find({ timestamp: { $lt: archiveCutoff } })
      .sort({ timestamp: 1 })
      .limit(1000)
      .lean()
      .select('userId message reply timestamp');

    if (!staleRecords.length) {
      return { archived: 0 };
    }

    const bulkOps = staleRecords.map((record) => ({
      updateOne: {
        filter: { originalReflectionId: record._id },
        update: {
          $setOnInsert: {
            originalReflectionId: record._id,
            userId: record.userId,
            message: record.message,
            reply: record.reply,
            timestamp: record.timestamp,
            archivedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await ReflectionArchive.bulkWrite(bulkOps, { ordered: false });
    return { archived: staleRecords.length };
  } catch (error) {
    console.error('Reflection archive failed:', error.message);
    return { archived: 0, error: error.message };
  }
}

async function purgeExpiredReflections() {
  const deleteCutoff = new Date(Date.now() - REFLECTION_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  try {
    const result = await Reflection.deleteMany({ timestamp: { $lt: deleteCutoff } });
    return { deleted: result.deletedCount || 0 };
  } catch (error) {
    console.error('Reflection purge failed:', error.message);
    return { deleted: 0, error: error.message };
  }
}

async function cleanupBackups() {
  const deleteCutoff = Date.now() - BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const expiredFiles = files.filter((filename) => {
      const match = filename.match(/^chat-backup-(\d+)-.*\.json$/);
      if (!match) return false;
      const timestamp = Number(match[1]);
      return timestamp < deleteCutoff;
    });
    await Promise.all(expiredFiles.map((filename) => fs.unlink(path.join(BACKUP_DIR, filename)).catch(() => {})));
    return { removed: expiredFiles.length };
  } catch (error) {
    console.error('Backup cleanup failed:', error.message);
    return { removed: 0, error: error.message };
  }
}

async function createReflectionBackup({ userId, since, until } = {}) {
  await ensureBackupDir();

  const query = buildReflectionQuery({ userId, since, until });
  const records = await Reflection.find(query)
    .sort({ timestamp: 1 })
    .lean()
    .select('userId message reply timestamp createdAt updatedAt');

  const timestamp = Date.now();
  const suffix = userId ? `-${userId}` : '';
  const filename = `chat-backup-${timestamp}${suffix}.json`;
  const filePath = path.join(BACKUP_DIR, filename);

  await fs.writeFile(filePath, JSON.stringify({ generatedAt: new Date(), query, records }, null, 2), 'utf8');

  return {
    filename,
    path: filePath,
    url: `/backups/${filename}`,
    count: records.length,
  };
}

async function scheduledRetentionWork() {
  await ensureBackupDir();
  const archiveResult = await archiveOldReflections();
  const purgeResult = await purgeExpiredReflections();
  const cleanupResult = await cleanupBackups();
  console.log(`🧹 Reflection retention executed: archived=${archiveResult.archived} deleted=${purgeResult.deleted} removedBackups=${cleanupResult.removed}`);
}

async function startRetentionJobs() {
  if (process.env.RUN_SCHEDULED_JOBS !== 'true') {
    return;
  }

  await ensureBackupDir();
  await scheduledRetentionWork();

  const intervalMs = Number(process.env.REFLECTION_RETENTION_INTERVAL_MS) || 6 * 60 * 60 * 1000;
  setInterval(scheduledRetentionWork, intervalMs);
}

module.exports = {
  ensureBackupDir,
  createReflectionBackup,
  startRetentionJobs,
};
