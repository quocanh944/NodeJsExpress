import express from 'express';
import { getAllUser } from '../controller/userController';

const userRouter = express.Router();


userRouter.get("/allusers", getAllUser)

export default userRouter;
