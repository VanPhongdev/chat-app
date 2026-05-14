const router = require('express').Router();
const verifyToken = require('../middlewares/auth.middleware');
const {
    createRoom, getRooms, getRoomById, joinRoom, leaveRoom
} = require('../controllers/room.controller');

router.post('/', verifyToken, createRoom);
router.get('/', verifyToken, getRooms);
router.get('/:id', verifyToken, getRoomById);
router.post('/:id/join', verifyToken, joinRoom);
router.post('/:id/leave', verifyToken, leaveRoom);

module.exports = router;