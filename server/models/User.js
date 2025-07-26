const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    socketId: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
// This model represents a user in the chat application, storing their username, socket ID, and