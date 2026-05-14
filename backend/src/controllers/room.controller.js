const roomService = require('../services/room.service');

const createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body, req.user.id);
    res.status(201).json(room);
  } catch (error) { next(error); }
};

const getRooms = async (req, res, next) => {
    try {
        const rooms = await roomService.getRooms(req.user.id);
        res.json(rooms);
    } catch (error) { next(error); }
};

const getRoomById = async (req, res, next) => {
    try {
        const room = await roomService.getRoomById(req.params.id, req.user.id);
        res.json(room);
    } catch (error) { next(error); }
};

const joinRoom = async (req, res, next) => {
    try {        
        const room = await roomService.joinRoom(req.params.id, req.user.id);
        res.json(room);
    } catch (error) { next(error); }
};

const leaveRoom = async (req, res, next) => {
    try {        
        const result = await roomService.leaveRoom(req.params.id, req.user.id);
        res.json(result);
    } catch (error) { next(error); }
};

module.exports = { createRoom, getRooms, getRoomById, joinRoom, leaveRoom };