const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    room:    { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:    { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    content: { type: String, default: '' },
    file_url:{ type: String, default: '' },
    read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index để load lịch sử chat nhanh
messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);