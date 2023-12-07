// userRouter.js
import express from 'express';
import {
    blockUser,
    getListUsers,
    getUserDetail,
    getUserProfile,
    getUserView,
    resendEmail,
    updateUser,
    userRegister,
    userRemove
} from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/', getUserView)

userRouter.get('/api', getListUsers);

userRouter.post('/register', userRegister);

userRouter.get('/edit/:id', getUserDetail);

userRouter.post('/update/:id', updateUser);

userRouter.delete('/delete/:id', userRemove)

userRouter.post('/block/:userId', blockUser);

userRouter.get('/profile/:id', getUserProfile);

userRouter.post('/resend-activation/:userId', resendEmail);


export default userRouter;
