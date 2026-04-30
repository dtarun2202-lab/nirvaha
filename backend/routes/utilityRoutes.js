const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Upload file endpoint (handled by multer middleware in main server)
router.post('/upload', (req, res) => {
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

module.exports = router;
