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
      req.flash('msg', `Create product ${productName} failed. Duplicate Barcode.`);
      req.flash('status', 'Failed');
      return res.redirect('/product');
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
      await product.save();
      req.flash('msg', `Create product ${productName} successfully.`);
      req.flash('status', 'Success');
      return res.redirect('/product');
    } else {
      throw new Error((await res).message)
    }

  } catch (err) {
    req.flash('msg', `Create product ${productName} failed.`);
    req.flash('status', 'Failed');
    return res.redirect('/product');
  }
}

export const getProductView = async (req, res) => {
  const msg = req.flash('msg');
  const status = req.flash('status');
  return res.render('pages/product', {
    title: "Quản lý hàng hóa",
    user: req.session.user,
    products: await productService.getAllProducts(),
    status,
    msg
  });
}