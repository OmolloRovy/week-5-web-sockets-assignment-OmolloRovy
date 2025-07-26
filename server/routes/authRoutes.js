// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

console.log('authRoutes: File loaded.'); // Log 11

router.post('/register', registerUser);
console.log('authRoutes: POST /register route defined.'); // Log 12

module.exports = router;