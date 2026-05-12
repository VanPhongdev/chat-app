const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const roomRoutes = require('./routes/room.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(err, req, res, next => {
    res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

module.exports = app;