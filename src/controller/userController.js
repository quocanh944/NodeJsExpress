import config from '../config/config.js';
import user from '../models/user.js';
import jwt from 'jsonwebtoken';
import { add, getAllUsers, getById, deleteById, editById, signUp, activateUserByEmail, updatePassword } from '../service/userService.js'

const getListUsers = async (req, res) => {
  let users = await getAllUsers();
  res.render('pages/user', { title: "Quản lý người dùng", users })
}

const getSetPasswordView = (req, res) => {
  const email = req.query.email;

  res.render('pages/set-password', { email: email, messages: req.flash() });
}

const userRegister = async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData)
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
    const token = req.params.token;
    const decoded = jwt.verify(token, config.secret_key);
    const email = decoded.email;

    const result = await activateUserByEmail(email);

    if (result) {
      req.session.user = result;
      req.flash('success_msg', 'Activation successful.');
      res.redirect(`/user/set-password?email=${email}`);
    }

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      req.flash('error_msg', 'Activation link has expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      req.flash('error_msg', 'Invalid activation link.');
    } else {
      console.error('Activation error', error);
      req.flash('error_msg', 'Lỗi báo BE');
    }

    res.redirect('/login');
  }
}

const setUserPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect(`/user/set-password?email=${email}`);
    }

    await updatePassword(email, password);

    req.flash('success_msg', 'Password has been set successfully.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error setting password:', error);
    req.flash('error_msg', 'Lỗi báo BE');
    res.redirect(`/user/set-password?email=${req.body.email}`);
  }
}

export { getListUsers, userRegister, activateUser, getSetPasswordView, setUserPassword }
