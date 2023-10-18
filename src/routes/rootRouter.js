import express from 'express'
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';

// Import the others router here (ex: userRouter, productRouter,...)

const rootRouter = express.Router();

rootRouter.get('/', function (req, res) {
    res.render('pages/index')
})
rootRouter.use("/product", productRouter)
rootRouter.use("/customer", customerRouter)
rootRouter.use("/order", orderRouter);
rootRouter.use("/user", userRouter);


export default rootRouter;

