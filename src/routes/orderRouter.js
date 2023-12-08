import express from 'express';
import * as orderController from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/add", orderController.addOrder)

orderRouter.get("/api/:customerID", orderController.getOrderByCustomerID)


export default orderRouter;
