// userRouter.js
import express from 'express';
import { getListUsers, getUserDetail, resendActivationEmail, updateUser, userRegister, userRemove } from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/', getListUsers)

userRouter.post('/register', userRegister);

userRouter.get('/edit/:id', getUserDetail);

userRouter.post('/update/:id', updateUser);

userRouter.delete('/delete/:id', userRemove)

userRouter.post('/resend-activation/:userId', resendActivationEmail);

export default userRouter;
