import express from 'express';
import * as productController from '../controller/productController.js';

const productRouter = express.Router();

productRouter.get("/search", productController.search)

export default productRouter;
