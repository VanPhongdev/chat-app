const jwt = require('jsonwebtoken');
const { client: redis } = require('../config/redis');

const REFRESH_TOKEN_PREFIX = 'refresh_token:';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });
};

const generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

  // Lưu refresh token vào Redis, TTL 7 ngày
  const ttlSeconds = 7 * 24 * 60 * 60;
  await redis.set(`${REFRESH_TOKEN_PREFIX}${token}`, payload.id, {
    EX: ttlSeconds,
  });

  return token;
};

const verifyRefreshToken = async (token) => {
  // 1. Verify signature
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error('Invalid refresh token');
    error.status = 401;
    throw error;
  }

  // 2. Kiểm tra token còn tồn tại trong Redis không (chưa bị revoke)
  const storedUserId = await redis.get(`${REFRESH_TOKEN_PREFIX}${token}`);
  if (!storedUserId) {
    const err = new Error('Refresh token revoked or expired');
    err.status = 401;
    throw err;
  }

  return { decoded, tokenKey: `${REFRESH_TOKEN_PREFIX}${token}` };
};

const revokeRefreshToken = async (tokenKey) => {
  await redis.del(tokenKey);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
};