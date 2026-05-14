const bcrypt = require('bcryptjs');
const User = require('../models/User');
const tokenService = require('./token.service');

const register = async ({ full_name, email, password }) => {
  // 1. Kiểm tra email đã tồn tại chưa
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already exists');
    err.status = 409;
    throw err;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Tạo user mới
  const user = await User.create({
    full_name,
    email,
    password: hashedPassword,
  });

  return { id: user._id, email: user.email, full_name: user.full_name };
};

const login = async ({ email, password }) => {
  // 1. Tìm user theo email (kèm password để so sánh)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  // 2. So sánh password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  // 3. Cập nhật trạng thái online
  user.is_online = true;
  user.last_seen = new Date();
  await user.save();

  // 4. Tạo token pair
  const payload = { id: user._id.toString(), email: user.email };
  const accessToken = tokenService.generateAccessToken(payload);
  const refreshToken = await tokenService.generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      avatar: user.avatar,
      status: user.status,
    },
  };
};

module.exports = { register, login };