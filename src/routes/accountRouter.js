import express from 'express';
import mongoose from 'mongoose';
import { activateUser } from '../controller/userController.js';
import User from '../models/user.js';

const accountRouter = express.Router();

// accountRouter.get('/activate/:token', activateUser);
accountRouter.get('/activate/:token', (req, res) => {
  if (req.params.token) {
    res.render('pages/activate', { token: req.params.token, messages: req.flash() })
  } else {
    res.send('Token không hợp lệ hoặc đã hết hạn.');
  }
});


accountRouter.post('/confirm-activation', activateUser);

accountRouter.get('/login', (req, res) => {

  let user = req.session.user;

  if (user && user.isFirstLogin === false && user.isActive === true) {
    res.redirect('/');
  } else {
    res.render('pages/login');
  }
});


accountRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!password) {
    return res.redirect('/login');
  }

  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', role: 'ADMIN' };
    return res.redirect('/');
  }

  try {
    const user = await User.findOne({ email: username.trim() + '@gmail.com' });

    if (!user || !user.isActive || !(await user.isValidPassword(password))) {
      return res.redirect('/login');
    }

    req.session.user = user;

    if (user.isFirstLogin) {
      return res.redirect('/user/set-password');
    }

    return res.redirect('/');
  } catch (error) {
    console.error('Database query error', error);
    req.flash('error_msg', 'Lỗi báo BE');
    return res.redirect('/login');
  }
});




export default accountRouter;
