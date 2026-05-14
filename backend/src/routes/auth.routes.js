const router = require('express').Router();
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validation/auth.validation');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;