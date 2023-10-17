// user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, enum: ['ADMIN', 'SALE'] },
  fullName: String,
  gender: String,
  avatar: String,
  phoneNumber: String,
  birthday: String,
  isActive: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  salesHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
