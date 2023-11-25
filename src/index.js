import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import { setupDB } from './config/db.js';
import rootRouter from './routes/rootRouter.js';
import configureViewEngine from './config/configureViewEngine.js';
import config from './config/config.js';
import session from 'express-session';
import flash from 'connect-flash';


const app = express();

// Setup database
setupDB();

import user from './models/user.js';
import customer from './models/customer.js';
import product from './models/product.js';
import order from './models/order.js';
import cartItem from './models/cartItem.js';
import notification from './models/notification.js';

// Setup View Engine
configureViewEngine(app);

dotenv.config();

app.use(logger('dev'));
app.use(express.static("."))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.secret_session));
app.use(session({
  secret: config.secret_key,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Tạo một vài khách hàng mẫu
const customer1 = new customer({
  phoneNumber: '123456789',
  fullName: 'John Doe',
  address: '123 Main St'
});

const customer2 = new customer({
  phoneNumber: '987654321',
  fullName: 'Jane Doe',
  address: '456 Elm St'
});

// Lưu khách hàng vào cơ sở dữ liệu
customer1.save();
customer2.save();

// Tạo một vài đơn hàng mẫu
const order1 = new order({
  saleId: '6544fac3edf9c5474e9a7b41', // Thay thế với ID thực tế
  customerId: customer1._id,
  products: ['productId1', 'productId2'], // Thay thế với các ID sản phẩm thực tế
  totalAmount: 100,
  moneyReceived: 100,
  moneyBack: 0,
  purchaseDate: new Date()
});

const order2 = new order({
  saleId: '6540e5a08c25bab42dc4d067', // Thay thế với ID thực tế
  customerId: customer2._id,
  products: ['productId3', 'productId4'], // Thay thế với các ID sản phẩm thực tế
  totalAmount: 200,
  moneyReceived: 200,
  moneyBack: 0,
  purchaseDate: new Date()
});

// Lưu đơn hàng vào cơ sở dữ liệu
order1.save();
order2.save();



app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


app.use('/', rootRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

app.listen(config.port, () => console.log(`
    Express started on http://localhost:${config.port}
    press Ctrl-C to terminate. `)
)


export default app;
