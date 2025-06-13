const express = require('express');
const { 
  createEntry, 
  getEntries, 
  getEntry 
} = require('../controllers/journalController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes with authentication middleware
router.use(protect);

/**
 * @route   POST /api/journal
 * @desc    Create a new journal entry
 * @access  Private
 */
router.post('/', createEntry);

/**
 * @route   GET /api/journal
 * @desc    Get all journal entries for the authenticated user
 * @access  Private
 */
router.get('/', getEntries);

/**
 * @route   GET /api/journal/:id
 * @desc    Get a single journal entry by ID
 * @access  Private
 */
router.get('/:id', getEntry);

module.exports = router;
