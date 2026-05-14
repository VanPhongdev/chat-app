const router = require('express').Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getMessages, uploadImage } = require('../controllers/message.controller');
const { uploadMiddleware } = require('../middlewares/upload.middleware');

router.get('/:roomId', verifyToken, getMessages);
router.post('/upload', verifyToken, uploadMiddleware, uploadImage);

module.exports = router;