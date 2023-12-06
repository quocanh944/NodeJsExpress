import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import { add, getAllUsers, editById, signUp, activateUserByEmail, updatePassword, setLoginStatus, removeUser, getUserById, resendActivationEmail, toggleUserBlock } from '../service/userService.js'
import { sanitizeAndValidateUserData, userHasPermissionToUpdate } from '../utils/userUtil.js';
import { createResendRequestNotification } from '../service/notificationService.js';

const getUserView = (req, res) => {
  res.render('pages/user', {
    title: "Quản lý người dùng",
    user: req.session.user
  });
}

const getListUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const getSetPasswordView = (req, res) => {
  res.render('pages/set-password', { email: req.session.user.email, messages: req.flash() });
}

const userRegister = async (req, res) => {
  try {
    const userData = req.body;
    const result = await signUp(userData);
    if (result.valid) {
      req.flash('success_msg', result.message);
      res.redirect('/user');
    } else {
      req.flash('error_msg', result.message);
      res.redirect('/user');
    }
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Lỗi báo BE');
    res.redirect('/user');
  }
}


const activateUser = async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, config.secret_key);
    const email = decoded.email;

    const result = await activateUserByEmail(email);

    if (result) {
      req.flash('success_msg', 'Activation successful.');
      return res.redirect(`/login`);
    }

    return res.redirect(`/activate/${req.body.token}`);

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Token hết hạn, redirect đến /resend-request
      console.log("Activation link has expired. Please request a new one.")
      req.flash('error_msg', 'Activation link has expired. Please request a new one.');
      return res.redirect(`/resend-request`); // Thay đổi ở đây
    } else if (error instanceof jwt.JsonWebTokenError) {
      req.flash('error_msg', 'Invalid activation link.');
      return res.redirect(`/activate/${req.body.token}`);
    } else {
      console.error('Activation error', error);
      req.flash('error_msg', 'An error occurred.');
      return res.redirect(`/activate/${req.body.token}`);
    }
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isLocked } = req.body;

    const result = await toggleUserBlock(userId, isLocked);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Lỗi BE', data: null });
  }
};


const setUserPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    console.log(req.body)

    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect(`/user/set-password`);
    }

    await updatePassword(email, password);

    await setLoginStatus(email)

    req.session.user = null;

    req.flash('success_msg', 'Password has been set successfully.');
    return res.redirect('/login');
  } catch (error) {
    console.error('Error setting password:', error);
    req.flash('error_msg', 'Lỗi báo BE');
    return res.redirect(`/user/set-password`);
  }
}

const changeUserPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect(`/profile/change-password`);
    }

    await updatePassword(email, password);

    req.flash('success_msg', 'Password has been set successfully.');
    return res.redirect('/profile');
  } catch (error) {
    console.error('Error setting password:', error);
    req.flash('error_msg', 'Lỗi báo BE');
    return res.redirect(`/profile`);
  }
}

const userRemove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID is invalid' });
    }

    const result = await removeUser(id);

    if (result) {
      return res.status(200).json({ success: true, message: 'User removed successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error remove user:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}


const getUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User was not found' });
    }
    return res.status(200).json({ success: true, message: 'Get user successfully', user });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedData = sanitizeAndValidateUserData(req.body);

    if (!userHasPermissionToUpdate(req.session.user, userId)) {
      return res.status(403).send("Bạn không có quyền cập nhật thông tin người dùng này.");
    }

    const result = await editById(userId, updatedData);

    if (!result.success) {
      return res.status(400).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send("Lỗi BE");
  }
}

const updateProfile = async (req, res) => {
  const { user } = req.session;
  const { fullName, birthday, phoneNumber } = req.body;
}

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.render('pages/profile', { user });
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
};

const getCurrentProfile = async (req, res) => {
  const { user } = req.session;
  res.render('pages/current-profile', { title: "Profile", user, messages: req.flash() })
};

const resendEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await getUserById(userId)

    if (!user.isActive) {
      const result = await resendActivationEmail(userId);
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(200).json({ success: false, message: "User has been active" });
    }

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const notifyAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    await createResendRequestNotification(userId);
    res.status(200).send('Notification sent to admin');
  } catch (error) {
    res.status(500).send('Error sending notification');
  }
};


export {
  getListUsers,
  userRegister,
  activateUser,
  getSetPasswordView,
  setUserPassword,
  userRemove,
  getUserDetail,
  updateUser,
  resendEmail,
  getCurrentProfile,
  getUserProfile,
  notifyAdmin,
  getUserView,
  blockUser
}
