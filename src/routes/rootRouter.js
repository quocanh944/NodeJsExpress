// rootRouter.js
import express from 'express';
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';
import { checkUserActivation, isAuthenticated } from '../middleware/authMiddleware.js';
import accountRouter from './accountRouter.js';

const rootRouter = express.Router();

rootRouter.use('/', accountRouter);


// rootRouter.use(checkUserActivation);

rootRouter.get('/contact-admin', (req, res) => {
    res.send('Your account is not activated. Please contact the administrator for the activation link.');
});

rootRouter.get('/', isAuthenticated, (req, res) => {
    res.render('pages/index');
});

rootRouter.use("/user", isAuthenticated, userRouter);
rootRouter.use("/product", isAuthenticated, productRouter);
rootRouter.use("/customer", isAuthenticated, customerRouter);
rootRouter.use("/order", isAuthenticated, orderRouter);

export default rootRouter;
