// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors'); // Ensure this is imported
const connectDB = require('./config/db');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { // CORS configuration for Socket.IO
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"], // Explicitly allow POST for Socket.IO if needed, though typically done by default
        credentials: true // Important for passing cookies/auth headers
    }
});

// socket.io setup
require('./socket')(io);

// Middleware
// *** Ensure CORS is applied early and correctly for Express routes ***
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests only from your client
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    credentials: true, // Allow cookies and authorization headers
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));
app.use(express.json()); // Essential for parsing JSON request bodies

// You can also explicitly handle OPTIONS if the middleware isn't catching it
// This is often not necessary if 'cors' middleware is configured properly
// app.options('*', cors()); // For all routes, handle OPTIONS preflight

//Routes
console.log('Server: Attaching routes...');
app.use('/api/rooms', require('./routes/roomRoutes'));
console.log('Server: Room routes attached.');
app.use('/api/messages', require('./routes/messageRoutes'));
console.log('Server: Message routes attached.');
app.use('/api/auth', require('./routes/authRoutes'));
console.log('Server: Auth routes attached.');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Server: Server listening for requests.');
});