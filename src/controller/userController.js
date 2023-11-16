import config from '../config/config.js';
import user from '../models/user.js';
import jwt from 'jsonwebtoken';
import { add, getAllUsers, editById, signUp, activateUserByEmail, updatePassword, setLoginStatus, removeUser, getUserById } from '../service/userService.js'

const getListUsers = async (req, res) => {
  let page = parseInt(req.query.page) || 1; // Nếu không có trang được cung cấp, mặc định là 1

  let limit = 5; // Đặt số lượng người dùng trên mỗi trang là 10

  try {
    const { users, currentPage, totalPages, total } = await getAllUsers(page, limit);
    res.render('pages/user', {
      title: "Quản lý người dùng",
      users,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages
      },
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
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

    console.log(result)

    if (result) {
      req.flash('success_msg', 'Activation successful.');
      return res.redirect(`/login`);
    }

    return res.redirect(`/activate/${req.body.token}`);

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      req.flash('error_msg', 'Activation link has expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      req.flash('error_msg', 'Invalid activation link.');
    } else {
      console.error('Activation error', error);
      req.flash('error_msg', 'Lỗi báo BE');
    }
    return res.redirect(`/activate/${req.body.token}`);
  }
}


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
    const updatedData = req.body;
    const { success } = await editById(userId, updatedData);
    if (!success) {
      req.flash("error_msg", "Cập nhật user không thành công !!!")
      return;
    }
    req.flash("success_msg", "Cập nhật user thành công !!!")
    return res.redirect('/user');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const resendActivationEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await UserService.resendActivationEmail(userId);
    res.send(result.message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


export { getListUsers, userRegister, activateUser, getSetPasswordView, setUserPassword, userRemove, getUserDetail, updateUser, resendActivationEmail }
