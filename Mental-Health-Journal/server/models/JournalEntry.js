const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  emotion: { type: String }, // e.g. sad, happy, anxious, etc.
  sentimentScore: { type: Number }, // optional: for future mood tracking
  suggestion: { type: String }, // coping strategy
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
