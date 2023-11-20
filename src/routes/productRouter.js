import express from 'express';
import multer from "multer";
import * as productController from '../controller/productController.js';

const productRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const singleUpload = upload.single("image");

productRouter.get("/search", productController.search)

productRouter.post('/', function(req, res, next) {
    singleUpload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: true, message: err.message });
        } else {
            next();
        }
    });
}, productController.create);

export default productRouter;
