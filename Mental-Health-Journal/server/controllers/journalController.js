const JournalEntry = require('../models/JournalEntry');
const { classifyEmotion, getCopingSuggestion } = require('../Utils/ai');

// Create a new journal entry with AI analysis
exports.createEntry = async (req, res, next) => {
  const { content } = req.body;

  // Validate request
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Content is required and cannot be empty'
    });
  }

  try {
    console.log('Classifying emotion for content...');
    const { emotion, score } = await classifyEmotion(content);
    console.log(`Emotion classified: ${emotion} (${score})`);
    
    console.log('Getting coping suggestion...');
    const suggestion = await getCopingSuggestion(emotion, content);
    console.log('Suggestion generated');

    const entry = new JournalEntry({
      user: req.user._id,
      content: content.trim(),
      emotion,
      sentimentScore: score,
      suggestion,
    });

    await entry.save();
    console.log('Journal entry saved successfully');

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    
    // Handle specific error cases
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    // Default error response
    res.status(500).json({
      success: false,
      message: 'Failed to create journal entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all journal entries for the authenticated user
exports.getEntries = async (req, res, next) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journal entries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single journal entry by ID
exports.getEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journal entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
