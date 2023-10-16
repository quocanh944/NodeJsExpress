// user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['admin', 'salesperson'] },
  fullName: String,
  gmail: String,
  avatar: String,
  phoneNumber: String,
  isActive: { type: Boolean, default: true },
  isLocked: { type: Boolean, default: false },
  tempLinkExpiration: Date,
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
