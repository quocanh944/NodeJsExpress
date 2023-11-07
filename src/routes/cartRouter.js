import express from 'express';
import * as cartController from '../controller/cartController.js';

const cartRouter = express.Router();

cartRouter.post("/addProduct/:id", cartController.addProductToCart)
cartRouter.get("/get/", cartController.getCart)
cartRouter.put("/edit", cartController.editById)
cartRouter.delete("/delete", cartController.deleteById)
cartRouter.delete("/clear", cartController.clearCart)
export default cartRouter;
