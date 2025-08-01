const mongoose = require('mongoose');

//connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_PRODUCTION);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;