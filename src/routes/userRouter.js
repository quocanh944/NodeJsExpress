import express from 'express';
import { getListUsers, getUserDetail, updateUser, userRegister, userRemove } from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/', getListUsers)

userRouter.get('/edit/:id', getUserDetail);

userRouter.post('/update/:id', updateUser);

userRouter.delete('/delete/:id', userRemove)

export default userRouter;
