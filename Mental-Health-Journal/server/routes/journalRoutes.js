const express = require('express');
const { createEntry, getEntries } = require('../controllers/journalController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createEntry);
router.get('/', protect, getEntries);

module.exports = router;
