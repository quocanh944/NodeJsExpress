import Product from '../models/product.js';
import User from '../models/user.js';
import * as productService from '../service/productService.js';

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
