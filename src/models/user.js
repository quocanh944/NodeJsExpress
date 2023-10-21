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
  fullName: String,
  gender: String,
  avatar: String,
  phoneNumber: String,
  birthday: String,
  isActive: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  salesHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Phương thức để kiểm tra mật khẩu hợp lệ
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};


export default mongoose.model('User', userSchema);
