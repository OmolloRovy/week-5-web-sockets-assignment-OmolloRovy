const express = require('express');
const router = express.Router();
const {getRoomMessages} = require('../controllers/messageController');

// Route to get messages for a specific room
router.get('/:roomId/messages', getRoomMessages);
module.exports = router;
// This file defines the route for retrieving messages in a specific chat room, linking it to the messageController.