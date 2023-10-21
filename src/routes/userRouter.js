import express from 'express';
import sendActivationEmail from '../utils/sendActivationEmail.js';
import { getListUsers } from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/', getListUsers)

// userRouter.post('/signup', signUp);
// userRouter.get("/:id", getById)
// userRouter.put("/:id", editById)
// userRouter.delete("/:id", deleteById)


export default userRouter;
