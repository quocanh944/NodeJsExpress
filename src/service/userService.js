import User from '../models/user.js';
import sendActivationEmail from '../utils/sendActivationEmail.js';
import bcrypt from 'bcrypt';

const add = async (newUser) => {
  const user = new User(newUser);
  return user.save();
};


const getAllUsers = async () => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new Error('Không tìm thấy người dùng nào');
    }
    return users;
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return null;
    }
    return user
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng' });
  }
};

const editById = async (id, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      throw new Error('Không tìm thấy người dùng');
    }
    return updatedUser;
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const deletedUser = await User.findByIdAndRemove(id);
    if (!deletedUser) {
      throw new Error('Không tìm thấy người dùng');
    }
    return deletedUser;
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;
  }
};

const signUp = async (userData) => {
  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    userData.password = hashedPassword

    const user = new User(userData);

    const newUser = await user.save();

    let username = newUser.email.replace("@gmail.com", "")

    if (newUser) {
      const emailSent = await sendActivationEmail(newUser.email);

      if (emailSent) {
        return { valid: true, message: `User ${username} created and activation email sent successfully.` };
      } else {
        return { valid: false, message: 'User created but failed to send activation email.' };
      }
    } else {
      return { valid: false, message: 'Error creating user.' };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const activateUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('User not found.');
  }

  user.isActive = true;
  await user.save();

  return user;
};

const updatePassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu mới cho người dùng
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('User not found.');
  }
  user.password = hashedPassword;

  await user.save();
};


export { add, getAllUsers, getById, deleteById, editById, signUp, activateUserByEmail, updatePassword }
