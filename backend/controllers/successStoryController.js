const SuccessStory = require('../models/SuccessStory');

// Get all success stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      stories: stories,
      count: stories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
};

// Get single story
exports.getStoryById = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      story: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching story',
      error: error.message
    });
  }
};

// Create new story
exports.createStory = async (req, res) => {
  try {
    const { title, description, quote, image, category, userName, location, rating, badge, bgColor, textColor, type } = req.body;
    
    // Get the highest order value
    const lastStory = await SuccessStory.findOne().sort({ order: -1 }).lean();
    const nextOrder = (lastStory?.order || 0) + 1;
    
    const story = new SuccessStory({
      title,
      description,
      quote,
      image,
      category,
      userName,
      location,
      rating: rating || 5,
      badge: badge || 'TRANSFORMATION',
      bgColor: bgColor || 'bg-white',
      textColor: textColor || 'text-[#1a5d47]',
      type: type || 'featured',
      order: nextOrder
    });
    
    await story.save();
    
    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      story: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating story',
      error: error.message
    });
  }
};

// Update story
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow updating timestamps directly
    delete updates.createdAt;
    
    const story = await SuccessStory.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story updated successfully',
      story: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating story',
      error: error.message
    });
  }
};

// Delete story (soft delete)
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const story = await SuccessStory.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting story',
      error: error.message
    });
  }
};

// Reorder stories
exports.reorderStories = async (req, res) => {
  try {
    const { storyIds } = req.body;
    
    if (!Array.isArray(storyIds)) {
      return res.status(400).json({
        success: false,
        message: 'storyIds must be an array'
      });
    }
    
    // Update order for each story
    const updatePromises = storyIds.map((id, index) =>
      SuccessStory.findByIdAndUpdate(id, { order: index, updatedAt: Date.now() })
    );
    
    await Promise.all(updatePromises);
    
    const stories = await SuccessStory.find({ isActive: true }).sort({ order: 1 });
    
    res.json({
      success: true,
      message: 'Stories reordered successfully',
      stories: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reordering stories',
      error: error.message
    });
  }
};

// Get stories for frontend (paginated if needed)
exports.getStoriesForDisplay = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    let query = { isActive: true };
    if (type) {
      query.type = type;
    }
    
    const stories = await SuccessStory.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      stories: stories,
      count: stories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories for display',
      error: error.message
    });
  }
};
