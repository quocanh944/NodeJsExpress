import express from 'express';
import * as orderController from '../controller/orderController.js';

const orderRouter = express.Router();


orderRouter.post("/add", orderController.add)
orderRouter.get("/getAllorder", orderController.getAll)
orderRouter.get("/:id", orderController.getById)
orderRouter.put("/:id", orderController.editById)
orderRouter.delete("/:id", orderController.deleteById)

export default orderRouter;
