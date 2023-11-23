import express from 'express';
import * as customerController from '../controller/customerController.js';

const customerRouter = express.Router();


customerRouter.get("/search", customerController.search)
customerRouter.get("/getByPhone", customerController.getByPhone)

export default customerRouter;
