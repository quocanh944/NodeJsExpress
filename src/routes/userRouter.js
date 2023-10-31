import express from 'express';
import { getListUsers, getSetPasswordView, setUserPassword, userRegister, userRemove } from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/', getListUsers)

userRouter.post('/register', userRegister);

userRouter.delete('/delete/:id', userRemove)

export default userRouter;
