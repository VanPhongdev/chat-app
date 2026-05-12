const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type:        { type: String, enum: ['public', 'private', 'direct'], default: 'public' },
    avatar:      { type: String, default: '' },
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role:      { type: String, enum: ['admin', 'member'], default: 'member' },
        joined_at: { type: Date, default: Date.now },
      },
    ],
    last_message: {
      content:    { type: String, default: '' },
      sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      created_at: { type: Date },
    },
  },
  { timestamps: true }
);

// Index để tìm kiếm room nhanh
roomSchema.index({ name: 'text' });
roomSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Room', roomSchema);