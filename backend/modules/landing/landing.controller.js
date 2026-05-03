const Landing = require('./landing.model');

/**
 * Get all landing page data
 * GET /api/landing
 */
exports.getLandingData = async (req, res) => {
  try {
    let landingData = await Landing.findOne();
    
    // If no landing data exists, return a default structure
    if (!landingData) {
      landingData = {
        hero: {
          title: "Find Your Inner Harmony",
          subtitle: "AI-powered wellness",
          buttonText: "Start Journey",
          imageUrl: "image.png"
        },
        partners: [
          { name: "Google", logoUrl: "google.png", websiteUrl: "https://www.google.com" },
          { name: "Microsoft", logoUrl: "microsoft.png", websiteUrl: "https://www.microsoft.com" },
          { name: "Amazon", logoUrl: "amazon.png", websiteUrl: "https://www.amazon.com" },
          { name: "Adobe", logoUrl: "adobe.png", websiteUrl: "https://www.adobe.com" }
        ],
        pillars: [],
        library: [],
        goals: [],
        courses: []
      };
    }
    
    res.status(200).json(landingData);
  } catch (error) {
    console.error('Error fetching landing data:', error);
    res.status(500).json({ error: 'Server error while fetching landing data' });
  }
};

/**
 * Update landing page data (Admin only)
 * PUT /api/admin/landing
 */
exports.updateLandingData = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Find the single document and update it, or create if it doesn't exist
    let landingData = await Landing.findOneAndUpdate(
      {}, 
      updateData, 
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({
      message: 'Landing page updated successfully',
      data: landingData
    });
  } catch (error) {
    console.error('Error updating landing data:', error);
    res.status(500).json({ error: 'Server error while updating landing data' });
  }
};
