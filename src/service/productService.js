import Product from '../models/product.js';

export const searchProduct = async (query, limit) => {
    try {
      const products = await Product.find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { barcode: { $regex: query } },
        ],
      }).limit(limit);
  
      return products;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

