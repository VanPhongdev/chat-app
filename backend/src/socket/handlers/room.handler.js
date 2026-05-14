const Room = require('../../models/Room');
const { client: redis } = require('../../config/redis');
const User = require('../../models/User');

const registerRoomHandlers = (io, socket) => {
    const userId = socket.user.id;

    // Tham gia phòng
    socket.on('join_room', async (roomId) => {
        try {
            const room = await Room.findById(roomId);
            if (!room) return socket.emit('error', { message: 'Room not found' });

            const isMember = room.members.some((m) => m.user.toString() === userId);
            if (!isMember) return socket.emit('error', { message: 'Not a member of the room' });

            socket.join(roomId);

            // Lưu user đang online vào Redis
            await redis.sAdd(`room:${roomId}:online`, userId);

            // Thông báo cho các thành viên khác trong phòng
            socket.to(roomId).emit('user_joined', { userId, roomId });

            socket.emit('joined_room', { roomId });
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Rời phòng
    socket.on('leave_room', async (roomId) => {
        try {
            socket.leave(roomId);
            await redis.sRem(`room:${roomId}:online`, userId);
            socket.to(roomId).emit('user_left', { userId, roomId });
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Xử lý khi ngắt kết nối
    socket.on('disconnect', async () => {
        try {
            const rooms = Array.from(socket.rooms);
            for (const roomId of rooms) {
                if (roomId !== socket.id) {
                    await redis.sRem(`room:${roomId}:online`, userId);
                    socket.to(roomId).emit('user_left', { userId, roomId });
                }
            }

            // Cập nhật trạng thái offline và thời gian last_seen cho user
            await User.findByIdAndUpdate(userId, {
                is_online: false,
                last_seen: new Date(),
            });
        } catch (error) {
            console.error('Disconnect handler error:', error.message);
        }
    });
};

module.exports = registerRoomHandlers;