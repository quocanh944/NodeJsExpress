import express from 'express';
const userRouter = express.Router();


userRouter.get("/products", getAllProduct)

export default userRouter;
