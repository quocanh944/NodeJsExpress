import express from 'express';
import multer from "multer";
import * as productController from '../controller/productController.js';
import { requireRole } from '../middleware/authMiddleware.js';

const productRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const singleUpload = upload.single("image");

productRouter.get("/search", productController.search)

productRouter.get("/", productController.getProductView)

productRouter.get("/:id", productController.getProductById)

productRouter.post("/edit/:id", requireRole(['ADMIN']), function (req, res, next) {
    singleUpload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: true, message: err.message });
        } else {
            next();
        }
    });
}, productController.edit)

productRouter.post("/delete/:id", requireRole(['ADMIN']), productController.deleteProduct)

productRouter.post('/', requireRole(['ADMIN']), function (req, res, next) {
    singleUpload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: true, message: err.message });
        } else {
            next();
        }
    });
}, productController.create);

productRouter.put("/decreaseProductInventory", productController.decreaseProductInventory)

export default productRouter;
