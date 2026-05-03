const Contact = require('./contact.model');

/**
 * Save user message
 * POST /api/contact
 */
exports.saveContactMessage = async (req, res) => {
  try {
    const { name, message } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    
    const newContact = new Contact({
      name,
      message
    });
    
    await newContact.save();
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Server error while saving message' });
  }
};

/**
 * Get all contact messages (Admin only)
 * GET /api/admin/contact
 */
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
};
