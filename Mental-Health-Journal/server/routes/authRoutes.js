const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Authentication Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth.protect, authController.logout);
router.get('/me', auth.protect, authController.getMe);

module.exports = router;