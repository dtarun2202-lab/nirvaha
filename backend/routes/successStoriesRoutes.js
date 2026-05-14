const express = require('express');
const router = express.Router();
const successStoryController = require('../controllers/successStoryController');

// Public routes
router.get('/display', successStoryController.getStoriesForDisplay);
router.get('/', successStoryController.getAllStories);
router.get('/:id', successStoryController.getStoryById);

// Admin routes (add authentication middleware in production)
router.post('/', successStoryController.createStory);
router.put('/:id', successStoryController.updateStory);
router.delete('/:id', successStoryController.deleteStory);
router.post('/reorder', successStoryController.reorderStories);

module.exports = router;
