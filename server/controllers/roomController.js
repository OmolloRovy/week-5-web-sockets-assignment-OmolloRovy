const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createRoom = async (req, res) => {
    const { name } = req.body;

    try {
        // Check if room already exists
        const room = await Room.create({ name });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};