const express = require('express');
const router = express.Router();
const contactController = require('./contact.controller');
const { authenticateJWT, isAdmin } = require('../../middleware/auth');

// Public route to save contact message
router.post('/', contactController.saveContactMessage);

// Protected admin route to get all messages
// Path will be /api/contact/admin (based on server.js mounting)
router.get('/admin', authenticateJWT, isAdmin, contactController.getContactMessages);

// Protected admin route to delete a message
router.delete('/admin/:id', authenticateJWT, isAdmin, contactController.deleteContactMessage);

module.exports = router;
