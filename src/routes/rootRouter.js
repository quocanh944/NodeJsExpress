import express from 'express'
import userRouter from './userRouter.js';

// Import the others router here (ex: userRouter, productRouter,...)

const rootRouter = express.Router();

rootRouter.get('/', function (req, res) { 
    res.render('pages/index')
})
rootRouter.use("/user", userRouter);


export default rootRouter;

