import User from '../models/user.js';
import sendActivationEmail from '../utils/sendActivationEmail.js';


const add = async (newUser) => {
  const user = new User(newUser);
  return user.save();
};


const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users || [];
  } catch (error) {
    throw error;
  }
};


const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error('Lỗi khi lấy thông tin người dùng');
  }
};


const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

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
      return { success: false, message: "User not found !!" }
    }
    return { success: true, message: "Update successfully", updatedUser };
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
    const user = new User(userData);

    user.password = user.email.replace("@gmail.com", "").trim()

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
  // Cập nhật mật khẩu mới cho người dùng
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('User not found.');
  }
  user.password = newPassword;

  await user.save();
};

const setLoginStatus = async (email) => {
  // Cập nhật mật khẩu mới cho người dùng
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('User not found.');
  }
  user.isFirstLogin = !user.isFirstLogin;

  await user.save();
};


const removeUser = async (id) => {
  try {
    // Tìm người dùng dựa trên ID và xóa
    const user = await User.findByIdAndRemove(id);


    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error; // Trả về lỗi nếu có lỗi xảy ra
  }
};

const setActivate = async (userId) => {
  const user = await User.findById(userId);
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

const setBlock = async (userId) => {
  const user = await User.findById(userId);
  user.isLocked = !user.isLocked;
  await user.save();
  return user;
};

const resendActivationEmail = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.isActive) {
    throw new Error('User already activated');
  }

  // Gọi hàm sendActivationEmail
  const emailSent = await sendActivationEmail(user.email);
  if (!emailSent) {
    throw new Error('Failed to send activation email');
  }

  return { message: 'Activation email resent successfully' };
}


const toggleUserBlock = async (userId, isLocked) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isLocked: isLocked },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, message: 'User not found', data: null };
    }

    return { success: true, message: 'User updated successfully', data: updatedUser };
  } catch (error) {
    throw error;
  }
};




export { add, getAllUsers, getUserById, getUserByEmail, deleteById, editById, signUp, activateUserByEmail, updatePassword, setLoginStatus, removeUser, setActivate, setBlock, resendActivationEmail, toggleUserBlock }
