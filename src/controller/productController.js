import Product from '../models/product.js';
import * as productService from '../service/productService.js';
import { uploadFirebase } from "./firebaseController.js";

export const search = async (req, res) => {
  try {
    const limit = 5
    const query = req.query.query || "";

    const result = await productService.searchProduct(query, limit);

    res.status(201).json(result)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}

export const create = async (req, res) => {
  try {
    const { barcode, productName, importPrice, retailPrice, category, inventory } = req.body;
    const checkExist = await Product.exists({barcode}); 
    if (checkExist) {
      return res.status(400).json({ error: true, message: "Duplicate Barcode" });
    }
    const result = uploadFirebase(req.file)
    if ((await result).downloadURL) {
      const product = new Product({
        barcode,
        productName,
        category,
        inventory,
        importPrice:  Number.parseInt(importPrice),
        retailPrice: Number.parseInt(retailPrice),
        thumbnailUrl: (await result).downloadURL
      });
      const newProd = await product.save();
      res.status(201).json({ success: true, message: "Success", product: newProd})
    } else {
      throw new Error((await res).message)
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}
