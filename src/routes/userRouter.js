import express from 'express';
import { getListUsers, getSetPasswordView, setUserPassword, userRegister } from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/', getListUsers)

userRouter.post('/register', userRegister);

userRouter.get('/set-password', getSetPasswordView);

userRouter.post('/set-password', setUserPassword);




// userRouter.get("/:id", getById)
// userRouter.put("/:id", editById)
// userRouter.delete("/:id", deleteById)


export default userRouter;
