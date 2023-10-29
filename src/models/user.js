// user.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/, // regex đơn giản để xác minh email
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, enum: ['ADMIN', 'SALE'] },
  fullName: { type: String, default: "" },
  gender: { type: String, default: "" },
  avatar: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  birthday: { type: String, default: "" },
  isActive: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  isFirstLogin: { type: Boolean, default: true },
  salesHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    if (!salt) {
      throw new Error('Failed to generate salt');
    }

    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model('User', userSchema);
