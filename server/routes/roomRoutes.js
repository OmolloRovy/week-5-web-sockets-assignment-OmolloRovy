const express = require('express');
const router = express.Router();
const{getRooms, createRoom} = require('../controllers/roomController');
// Route to get all rooms

router.get('/', getRooms);

// Route to create a new room
router.post('/', createRoom);
module.exports = router;
// This file defines the routes for managing chat rooms in the application, allowing retrieval and creation of