const Message = require('../../models/Message');
const Room = require('../../models/Room');

const registerMessageHandlers = (io, socket) => {
    const userId = socket.user.id;

    // Gửi tin nhắn
    socket.on('send_message', async ({ roomId, content, type = 'text', file_url = '' }) => {
        try {
            // Luu tin nhắn vào database
            const message = await Message.create({
                room: roomId,
                sender: userId,
                content,
                type,
                file_url
            });

            // Điền thong tin người gửi để trả về client
            await message.populate('sender', 'full_name avatar');

            // Cập nhật last_message cho phòng
            await Room.findByIdAndUpdate(roomId, { 
                last_message: {
                    content,
                    sender: userId,
                    created_at: message.createdAt,
                },
             });

             // Phát tin nhắn đến tất cả thành viên trong phòng
             io.to(roomId).emit('new_message', message);
        } catch (error) {
            socket.emit('error', {'message': error.message});
        }
    });

    socket.on('typing', ({ roomId, isTyping }) => {
        socket.to(roomId).emit('user-typing', { userId, roomId });
    });

    socket.on('stop_typing', ({ roomId }) => {
        socket.to(roomId).emit('user-stop-typing', { userId, roomId });
    });

    // Đánh dấu tin nhắn đã đọc
    socket.on('mark_read', async ({ roomId }) => {
        try {
            await Message.findByIdAndUpdate( messageId, {
                $addToSet: { read_by: userId }
            });
            socket.to(roomId).emit('messages_read', { messageId, roomId });
        } catch (error) {
            socket.emit('error', {'message': error.message});
        }
    });
};

module.exports = registerMessageHandlers;