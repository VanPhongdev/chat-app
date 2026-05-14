const messageService = require('../services/message.service');
const cloudinary = require('../config/cloudinary');

const getMessages = async (req, res, next) => {
    try {
        const data = await messageService.getMessages(req.params.roomId, req.query);
        res.json(data);
    } catch (error) { next(error); }
};

const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        } 

        const resuilt = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'chat-app/imagess' },
                (error, result) => error? reject(error) : resolve(result)
            );
            stream.end(req.file.buffer);
        });
        res.json({ url: resuilt.secure_url });
    } catch (error) { next(error); }
};

module.exports = { getMessages, uploadImage };