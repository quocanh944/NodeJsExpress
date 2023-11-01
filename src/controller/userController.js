import config from '../config/config.js';
import user from '../models/user.js';
import jwt from 'jsonwebtoken';
import { add, getAllUsers, getById, deleteById, editById, signUp, activateUserByEmail, updatePassword, setLoginStatus, removeUser } from '../service/userService.js'

const getListUsers = async (req, res) => {
  let users = await getAllUsers();
  res.render('pages/user', { title: "Quản lý người dùng", users })
}

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


export { getListUsers, userRegister, activateUser, getSetPasswordView, setUserPassword, userRemove }
