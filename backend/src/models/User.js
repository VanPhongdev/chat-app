const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true, select: false },
    avatar:    { type: String, default: '' },
    status:    { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    is_online: { type: Boolean, default: false },
    last_seen: { type: Date, default: Date.now },
    friends:   { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  },
  { timestamps: true }
);

// Ẩn password khi trả về JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);