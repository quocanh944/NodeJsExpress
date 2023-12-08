import express from 'express';
import * as orderController from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/add", orderController.addOrder)
orderRouter.get("/getListOrderSale", orderController.getListOrderSale)
orderRouter.get("/getOrderDetail/:id", orderController.getOrderDetail)

export default orderRouter;
