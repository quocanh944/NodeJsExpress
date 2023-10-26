import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
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
import productCount from './models/productCount.js';

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
