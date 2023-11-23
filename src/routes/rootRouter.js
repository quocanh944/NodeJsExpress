// rootRouter.js
import express from 'express';
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';
import { checkUserActivation, isAuthenticated, isFirstLogined } from '../middleware/authMiddleware.js';
import accountRouter from './accountRouter.js';
import cartRouter from './cartRouter.js';
import { fetchNotifications } from '../middleware/notificationMiddleware.js';
import notificationRouter from './notificationRouter.js';

const rootRouter = express.Router();

rootRouter.use('/', accountRouter);

rootRouter.get('/contact-admin', (req, res) => {
    res.send('Your account is not activated. Please contact the administrator for the activation link.');
});

rootRouter.get('/', isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, (req, res) => {
    const { user } = req.session;

    if (user) {
        if (user.role === 'SALE') {
            res.render('pages/sales', { user });
        } else {
            res.render('pages/index', { user });
        }
    }
});

rootRouter.use("/user", isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, userRouter);
rootRouter.use("/product", isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, productRouter);
rootRouter.use("/customer", isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, customerRouter);
rootRouter.use("/order", isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, orderRouter);
rootRouter.use("/cart", isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, cartRouter);
rootRouter.use("/notification", isAuthenticated, checkUserActivation, isFirstLogined, fetchNotifications, notificationRouter);

export default rootRouter;
