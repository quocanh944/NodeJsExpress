import product from '../models/product.js';
import Product from '../models/product.js';
import * as productService from '../service/productService.js';
import { uploadFirebase, deleteImageFromFirebase } from "./firebaseController.js";

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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await productService.getProductById(id);

    res.status(201).json({ error: true, message: "Get product successfully.", product: result })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const prod = await productService.getProductById(id);
    if (prod.isBought) {
      req.flash('msg', `Delete product failed (This product is bought).`);
      req.flash('status', 'Failed');
      return res.redirect('/product');
    }
    const result = await productService.deleteProductById(id);
    req.flash('msg', `Delete product successfully.`);
    req.flash('status', 'Success');
    return res.redirect('/product');
  } catch (err) {
    console.error("Delete Product Error: ", err);
    req.flash('msg', `Delete product failed.`);
    req.flash('status', 'Failed');
    return res.redirect('/product');
  }
}

export const create = async (req, res) => {
  const { barcode, productName, importPrice, retailPrice, category, inventory } = req.body;
  try {
    const checkExist = await Product.exists({ barcode });
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
        importPrice: Number.parseInt(importPrice),
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

export const edit = async (req, res) => {
  const { barcode, productName, importPrice, retailPrice, category, inventory } = req.body;
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (product) {
      if (product.get("barcode") != barcode) {
        const checkExist = await Product.exists({ barcode });
        if (checkExist) {
          req.flash('msg', `Create product ${productName} failed. Duplicate Barcode.`);
          req.flash('status', 'Failed');
          return res.redirect('/product');
        }
        product.set("barcode", barcode);
      }
      if (product.get("productName") != productName) {
        product.set("productName", productName);
      }
      if (product.get("importPrice") != importPrice) {
        product.set("importPrice", importPrice);
      }
      if (product.get("retailPrice") != retailPrice) {
        product.set("retailPrice", retailPrice);
      }
      if (product.get("category") != category) {
        product.set("category", category);
      }
      if (product.get("inventory") != inventory) {
        product.set("inventory", inventory);
      }

      if (req.file) {
        await deleteImageFromFirebase(product.thumbnailUrl);
        const result = await uploadFirebase(req.file)
        if (result.downloadURL) {
          product.set("thumbnailUrl", result.downloadURL);
        }
      }

      await product.save();
      req.flash('msg', `Update product ${productName} successfully.`);
      req.flash('status', 'Success');
      return res.redirect('/product');
    } else {
      req.flash('msg', `Product ${productName} not found.`);
      req.flash('status', 'Failed');
      return res.redirect('/product');
    }
  } catch (err) {
    req.flash('msg', `Update product ${productName} failed.`);
    req.flash('status', 'Failed');
    return res.redirect('/product');
  }
}

export const getProductView = async (req, res) => {
  const {user} = req.session;
  const msg = req.flash('msg');
  const status = req.flash('status');
  if (user.role === 'ADMIN') {
    return res.render('pages/product', {
      title: "Quản lý sản phẩm.",
      user: req.session.user,
      products: await productService.getAllProducts(),
      status,
      msg
    });
  }
  return res.render('pages/sale-product', {
    title: "Quản lý sản phẩm.",
    user: req.session.user,
    products: await productService.getAllProducts(),
    status,
    msg
  });
}