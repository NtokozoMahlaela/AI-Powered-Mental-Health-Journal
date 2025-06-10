const JournalEntry = require('../models/JournalEntry');
const { classifyEmotion, getCopingSuggestion } = require('../Utils/ai');

exports.createEntry = async (req, res) => {
  const { content } = req.body;

  try {
    const { emotion, score } = await classifyEmotion(content);
    const suggestion = await getCopingSuggestion(emotion, content);

    const entry = new JournalEntry({
      user: req.user._id,
      content,
      emotion,
      sentimentScore: score,
      suggestion,
    });

    await entry.save();

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};
