// rootRouter.js
import express from 'express';
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';
import { checkUserActivation, isAuthenticated, isFirstLogined } from '../middleware/authMiddleware.js';
import accountRouter from './accountRouter.js';

const rootRouter = express.Router();

rootRouter.use('/', accountRouter);

rootRouter.get('/contact-admin', (req, res) => {
    res.send('Your account is not activated. Please contact the administrator for the activation link.');
});

rootRouter.get('/', isAuthenticated, checkUserActivation, isFirstLogined, (req, res) => {
    const { user } = req.session;

    if (user) {
        if (user.role === 'sale') {
            res.render('pages/sales', { user });

        } else {
            res.render('pages/index', { user });
        }
    }
});



rootRouter.use("/user", isAuthenticated, checkUserActivation, isFirstLogined, userRouter);
rootRouter.use("/product", isAuthenticated, checkUserActivation, isFirstLogined, productRouter);
rootRouter.use("/customer", isAuthenticated, checkUserActivation, isFirstLogined, customerRouter);
rootRouter.use("/order", isAuthenticated, checkUserActivation, isFirstLogined, orderRouter);

export default rootRouter;
