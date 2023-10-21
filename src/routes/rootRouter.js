// rootRouter.js
import express from 'express';
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';
import loginRouter from './loginRouter.js'; // đảm bảo đường dẫn chính xác
import { checkUserActivation, isAuthenticated } from '../middleware/authMiddleware.js';

const rootRouter = express.Router();

rootRouter.use('/login', loginRouter);

rootRouter.use(isAuthenticated);


// rootRouter.use(checkUserActivation);

rootRouter.get('/contact-admin', (req, res) => {
    res.send('Your account is not activated. Please contact the administrator for the activation link.');
});

rootRouter.get('/', (req, res) => {
    res.render('pages/index');
});

rootRouter.use("/user", userRouter);
rootRouter.use("/product", productRouter);
rootRouter.use("/customer", customerRouter);
rootRouter.use("/order", orderRouter);

export default rootRouter;
