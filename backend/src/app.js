const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const roomRoutes = require('./routes/room.routes');
const friendRoutes = require('./routes/friend.routes');

const app = express();

// Security middlewares
app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
}));

// Body parser
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: 'Too many requests from this IP, please try again later.',
    },
});

app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/friends', friendRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;