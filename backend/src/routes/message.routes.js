const router = require('express').Router();
const verifyToken = require('../middleware/auth.middleware');
const { getMessages, uploadImage } = require('../controllers/message.controller');
const { uploadMiddleware } = require('../middleware/upload.middleware');

router.get('/:roomId', verifyToken, getMessages);
router.post('/upload', verifyToken, uploadMiddleware, uploadImage);

module.exports = router;