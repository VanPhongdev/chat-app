const Message = require('../models/Message');

const getMessages = async (roomId, { page = 1, limit = 30 }) => {
    const skip = (page -1) * limit;

    const messages = await Message.find({ room: roomId, is_deleted: false })
        .populate('sender', 'full_name avatar')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Message.countDocuments({ room: roomId, is_deleted: false });

    return {
        messages: messages.reverse(),
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

module.exports = { getMessages };