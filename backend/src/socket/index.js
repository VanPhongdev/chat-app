const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const registerMessageHandlers = require('./handlers/message.handler');
const registerRoomHandlers = require('./handlers/room.handler');

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

const initSocket = (server) => {
  // Parse allowed origins from CLIENT_URL env var (comma-separated)
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim())
    : '*';

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Áp dụng middleware xác thực JWT
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    console.log(`Socket connected: ${socket.id} | User: ${userId}`);

    // Cập nhật trạng thái online khi user kết nối
    try {
      await User.findByIdAndUpdate(userId, { is_online: true });
    } catch (err) {
      console.error('Failed to update online status:', err.message);
    }

    // Đăng ký các handlers
    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);

    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: ${socket.id} | User: ${userId}`);
    });
  });

  return io;
};

module.exports = initSocket;