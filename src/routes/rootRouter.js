// rootRouter.js
import express from 'express';
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';
import { checkUserActivation, checkUserBlocked, isAuthenticated, isFirstLogined, requireRole } from '../middleware/authMiddleware.js';
import accountRouter from './accountRouter.js';
import cartRouter from './cartRouter.js';
import { fetchNotifications } from '../middleware/notificationMiddleware.js';
import notificationRouter from './notificationRouter.js';
import statisticRouter from './statisticRouter.js';
import profileRouter from './profileRouter.js';

const rootRouter = express.Router();

rootRouter.use('/', accountRouter);

rootRouter.get('/contact-admin', (req, res) => {
    res.send('Your account is not activated. Please contact the administrator for the activation link.');
});

rootRouter.get('/', isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, (req, res) => {
    const { user } = req.session;

    if (user) {
        if (user.role === 'SALE') {
            res.render('pages/sales', { user });
        } else {
            res.render('pages/index', { user });
        }
    }
});

rootRouter.get('/home', isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, (req, res) => {
    const { user } = req.session;
    res.render('pages/index', { user });
});

rootRouter.use("/user", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN']), userRouter);
rootRouter.use("/product", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), productRouter);
rootRouter.use("/customer", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), customerRouter);
rootRouter.use("/order", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), orderRouter);
rootRouter.use("/cart", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['SALE']), cartRouter);
rootRouter.use("/notification", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN']), notificationRouter);
rootRouter.use("/statistic", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), statisticRouter);
rootRouter.use('/profile', isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), profileRouter);

export default rootRouter;
