import express from 'express';
import * as customerController from '../controller/customerController.js';

const customerRouter = express.Router();

customerRouter.get('/', customerController.getCustomerView);

customerRouter.get('/api', customerController.getAllCustomers);

customerRouter.get('/api/:customerId', customerController.getCustomerById);

customerRouter.get("/search", customerController.search)

customerRouter.get("/getByPhone", customerController.getByPhone)

customerRouter.post("/add", customerController.addNewCustomer);

customerRouter.get('/:customerId', customerController.getCustomerViewDetail);

export default customerRouter;
