import express from 'express';
import * as customerController from '../controller/customerController.js';

const customerRouter = express.Router();


customerRouter.post("/add", customerController.add)
customerRouter.get("/getAllCustomer", customerController.getAll)
customerRouter.get("/:id", customerController.getById)
customerRouter.put("/:id", customerController.editById)
customerRouter.delete("/:id", customerController.deleteById)

export default customerRouter;
