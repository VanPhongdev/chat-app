const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const roomRoutes = require('./routes/room.routes');
const friendRoutes = require('./routes/friend.routes');

const app = express();

// Security middlewares
app.use(helmet());

// Parse allowed origins from CLIENT_URL env var (comma-separated)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.options("*", cors());

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