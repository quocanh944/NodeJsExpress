import express from 'express';
import * as userController from '../controller/userController.js';

const userRouter = express.Router();


userRouter.post("/add", userController.add)
userRouter.get("/getAlluser", userController.getAll)
userRouter.get("/:id", userController.getById)
userRouter.put("/:id", userController.editById)
userRouter.delete("/:id", userController.deleteById)

export default userRouter;
