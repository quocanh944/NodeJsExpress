import express from 'express';
import { activateUser, getSetPasswordView, setUserPassword } from '../controller/userController.js';
import User from '../models/user.js';
import { checkFirstLogin, checkUserActivation, isAuthenticated, isFirstLogined } from '../middleware/authMiddleware.js';
import { getUserByEmail } from '../service/userService.js';
import notification from '../models/notification.js';
import NotificationType from '../constant/NotificationType.js';
import nodemailer from 'nodemailer';


const accountRouter = express.Router();

accountRouter.get('/logout', (req, res) => {
  req.session.destroy();

  res.status(200).send({ success: true, message: 'Đăng xuất thành công' });
});


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
    const msg = req.flash('msg');
    console.log(msg);
    res.render('pages/login', { msg });
  }
});


accountRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!password) {
    req.flash('msg',"Please enter your password!")
    return res.redirect('/login');
  }

  try {
    const user = await User.findOne({ email: username.trim() + '@gmail.com' });

    if (!user || !user.isActive || !(await user.isValidPassword(password))) {
      req.flash('msg',"Incorrect username or password!")
      return res.redirect('/login');
    }

    req.session.user = user;

    if (user.isFirstLogin) {
      return res.redirect('/user/set-password');
    }

    return res.redirect('/');
  } catch (error) {
    console.error('Database query error', error);
    // req.flash('error_msg', 'Lỗi báo BE');
    return res.redirect('/login');
  }
});

accountRouter.get('/user/set-password', checkUserActivation, checkFirstLogin, getSetPasswordView);

accountRouter.post('/user/set-password', checkUserActivation, checkFirstLogin, setUserPassword);

accountRouter.get('/resend-request', (req, res) => {
  res.render('pages/resend-request')
})

accountRouter.post('/send-notification', async (req, res) => {
  let { userEmail, message } = req.body;

  // Cấu hình nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'phuvinh113@gmail.com',
      pass: 'svphbvlurqfbuxzu',
    },
  });

  let mailOptions = {
    from: userEmail,
    to: 'phuvinh113@gmail.com',
    subject: 'Thông Báo Từ Người Dùng',
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);

    let user = await getUserByEmail(userEmail);

    await notification.create({
      userId: user._id,
      content: NotificationType.RESEND_ACTIVATION,
    });

    res.json({ success: true, message: 'Email đã được gửi.' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).send('Lỗi gửi email.');
  }
});



export default accountRouter;
