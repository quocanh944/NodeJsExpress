import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { getMailTemplate } from '../constant/mailTemplate.js';

const createUserCredentials = (email) => {
  const username = email.split('@')[0];
  const password = username;
  return { username, password };
};

const sendActivationEmail = async (email) => {
  try {
    const token = jwt.sign({ email }, config.secret_key, { expiresIn: '1m' });

    const activationLink = `${config.host}activate/${token}`;

    const { username, password } = createUserCredentials(email);

    console.log(username, password)

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'phuvinh113@gmail.com',
        pass: 'svphbvlurqfbuxzu',
      },
    });

    // Cấu hình thông tin email
    let mailOptions = {
      from: 'phuvinh113@gmail.com',
      to: email,
      subject: 'Account Activation',
      text: `Hello, please use the following link to activate your account: ${activationLink}`,
      html: getMailTemplate(username, password, activationLink)
    };

    // Gửi email
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.response);
    return true;
  } catch (error) {
    console.error('There was an error sending the email', error);
    return false;
  }
};

export default sendActivationEmail;


