const Room = require('../models/Room');
const User = require('../models/User');

const createRoom = async ({name, description, type}, userId) => {
    const room = await Room.create ({
        name,
        description,
        type,
        members: [{ user: userId, role: 'admin' }],
        created_by: userId,
    });
    return room;
};

const findOrCreateDirectRoom = async (friendId, userId) => {
    if (!friendId) {
        const error = new Error('Friend ID is required');
        error.status = 400;
        throw error;
    }
    if (friendId.toString() === userId.toString()) {
        const error = new Error('Cannot create direct room with yourself');
        error.status = 400;
        throw error;
    }

    const rooms = await Room.find({
        type: 'direct',
        'members.user': { $all: [userId, friendId] },
    });

    const existingRoom = rooms.find((room) => room.members.length === 2);
    if (existingRoom) {
        await existingRoom.populate('members.user', 'full_name avatar is_online last_seen');
        return existingRoom;
    }

    const friendUser = await User.findById(friendId).select('full_name avatar is_online last_seen');
    if (!friendUser) {
        const error = new Error('Friend not found');
        error.status = 404;
        throw error;
    }

    const room = await Room.create({
        name: friendUser.full_name,
        avatar: friendUser.avatar || '',
        type: 'direct',
        members: [
            { user: userId, role: 'admin' },
            { user: friendId, role: 'member' },
        ],
        created_by: userId,
    });

    await room.populate('members.user', 'full_name avatar is_online last_seen');
    return room;
};

const getRooms = async (userId) => {
    return Room.find({ 'members.user': userId })
        .select('name description type avatar last_message members')
        .sort({ 'last_message.created_at': -1, updatedAt: -1 });
};

const getRoomById = async (roomId, userId) => {
    const room = await Room.findById(roomId)
        .populate('members.user', 'full_name avatar is_online last_seen');
    if (!room) {
        const error = new Error('Room not found');
        error.status = 404;
        throw error;
    }

    const isMember = room.members.some((member) => member.user._id.toString() === userId);
    if (!isMember) {
        const error = new Error('Access denied');
        error.status = 403;
        throw error;
    }

    return room;
};

const joinRoom = async (roomId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) {
        const error = new Error('Room not found');
        error.status = 404;
        throw error;
    }

    if(room.type === 'private') {
        const error = new Error('Cannot join private room with invitation');
        error.status = 403;
        throw error;
    }

    const already = room.members.some((member) => member.user.toString() === userId);
    if (already) {
        const error = new Error('Already a member');
        error.status = 409;
        throw error;
    }

    room.members.push({ user: userId, role: 'member' });
    await room.save();
    return room;
};

const leaveRoom = async (roomId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) {
        const error = new Error('Room not found');
        error.status = 404;
        throw error;
    }

    room.members = room.members.filter((member) => member.user.toString() !== userId);
    await room.save();
    return { message: 'Left room successfully' };
};

module.exports = {
    createRoom,
    findOrCreateDirectRoom,
    getRooms,
    getRoomById,
    joinRoom,
    leaveRoom
};
