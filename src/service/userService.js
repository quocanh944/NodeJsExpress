import User from '../models/user.js';
import sendActivationEmail from '../utils/sendActivationEmail.js';

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

const signUp = async (userData, sendActivationEmail) => {
  try {
    const user = new User(userData);
    const newUser = await user.save();

    if (newUser) {
      // Gọi hàm sendActivationEmail từ bên ngoài
      const emailSent = await sendActivationEmail(newUser.email); // Sửa đổi tùy thuộc vào cấu trúc của userData

      if (emailSent) {
        return { message: 'User created and activation email sent successfully.' };
      } else {
        throw new Error('User created but failed to send activation email.');
      }
    } else {
      throw new Error('Error creating user.');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const activateUser = async () => {
  return
}


export { add, getAllUsers, getById, deleteById, editById, signUp, activateUser }
