import express from 'express';
import * as productController from '../controller/productController.js';

const productRouter = express.Router();


productRouter.get('/', async (req, res) => {
  const products = await productController.getAll();
  res.render('partials/product', { title: "Quản lý sản phẩm", products });
});

productRouter.post("/add", productController.add)
productRouter.get("/getAllproduct", productController.getAll)
productRouter.get("/:id", productController.getById)
productRouter.put("/:id", productController.editById)
productRouter.delete("/:id", productController.deleteById)

export default productRouter;
