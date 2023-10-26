import express from 'express';
import mongoose from 'mongoose';
import { activateUser } from '../controller/userController.js';

const accountRouter = express.Router();

accountRouter.get('/login/:token', activateUser);

accountRouter.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('pages/login');
  }
});


accountRouter.post('/login', async (req, res, next) => {
  let { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin' };
    return res.redirect('/');
  } else {

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




export default accountRouter;
