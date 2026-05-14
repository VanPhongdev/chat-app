const mullter = require('multer');

const storage = mullter.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed.'), false);
    }
};

const upload = mullter({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadMiddleware: upload.single('image') };