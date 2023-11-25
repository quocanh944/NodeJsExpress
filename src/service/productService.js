import Product from '../models/product.js';
import mongoose from 'mongoose';

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

export const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const getProductById = async (id) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid product id: " + id);
    } 
    const products = await Product.findOne({_id: id});
    if (products) {
      return products;
    }
    throw new Error("Not found product id: " + id);
  } catch (err) {
    throw err;
  }
}

export const deleteProductById = async (id) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid product id: " + id);
    } 
    const products = await Product.deleteOne({_id: id});
    if (products) {
      return products;
    }
    throw new Error("Not found product id: " + id);
  } catch (err) {
    throw err;
  }
}