import express from 'express';
import mongoose from 'mongoose';
import sendActivationEmail from '../utils/sendActivationEmail.js';

const loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('pages/login');
  }
});


loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin' };
    return res.redirect('/');
  } else {
    // Handle other users
    try {
      const user = await mongoose.model('User').findOne({ email: username });
      if (user) {
        if (!user.isActive) {
          return res.status(200).send('Please check your email to activate your account.');
        } else if (await user.isValidPassword(password)) {
          req.session.user = user;
          if (user.isFirstLogin) {
            return res.redirect('/change-password');
          }
          return res.redirect('/');
        } else {
          return res.redirect('/login');
        }
      } else {
        return res.redirect('/login');
      }
    } catch (error) {
      console.error('Database query error', error);
      res.status(500).send('Internal server error');
    }
  }
});


loginRouter.get('/activate', async (req, res) => {
  try {
    const { token } = req.query;

    // Giả định rằng bạn có một function để xác minh và kích hoạt người dùng từ token
    // const user = await activateUser(token);

    if (user) {
      // Redirect người dùng đến trang đăng nhập hoặc trang thông báo kích hoạt thành công
      return res.redirect('/login');
    } else {
      // Trả về thông báo lỗi hoặc redirect người dùng đến trang thông báo lỗi
      return res.status(400).json({ message: 'Invalid or expired activation link.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});



export default loginRouter;
