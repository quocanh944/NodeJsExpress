import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Đảm bảo rằng bạn đã cài đặt package 'jsonwebtoken'
import config from '../config/config.js';

const sendActivationEmail = async (email) => {
  try {
    const token = jwt.sign({ email }, config.secret_key, { expiresIn: '1m' }); // thay 'your_secret_key' bằng secret key thực tế của bạn

    const activationLink = `${config.host}/login/${token}`;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'phuvinh110@gmail.com',
        pass: 'mayhabuoi0',
      },
    });

    // Cấu hình thông tin email
    let mailOptions = {
      from: 'phuvinh110@gmail.com', // Địa chỉ email người gửi
      to: email, // Địa chỉ email người nhận, ở đây chúng ta sử dụng biến 'email' được truyền vào hàm
      subject: 'Account Activation',
      text: `Hello, please use the following link to activate your account: ${activationLink}`,
    };  

    // Gửi email
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('There was an error sending the email', error);
    return false;
  }
};

export default sendActivationEmail;
