import express from 'express'
import userRouter from './userRouter.js';

// Import the others router here (ex: userRouter, productRouter,...)

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);


export default rootRouter;

