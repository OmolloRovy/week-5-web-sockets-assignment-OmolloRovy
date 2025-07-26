const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { username, socketId } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (!user) user = await User.create({ username });
        res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };