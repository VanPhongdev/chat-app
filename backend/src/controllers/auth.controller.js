const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) { next(err); }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });

    const { decoded, tokenKey } = await tokenService.verifyRefreshToken(token);

    // Rotation: revoke cũ, cấp mới
    await tokenService.revokeRefreshToken(tokenKey);
    const accessToken  = tokenService.generateAccessToken(decoded);
    const newRefresh   = await tokenService.generateRefreshToken(decoded);

    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token) {
      const { tokenKey } = await tokenService.verifyRefreshToken(token);
      await tokenService.revokeRefreshToken(tokenKey);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

module.exports = { register, login, refreshToken, logout };