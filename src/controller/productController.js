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
};

export const getAll = async () => {
  try {
    const product = await Product.find()
    if (!product) {
      return []
    }
    return product
  } catch (error) {
    throw error;
  }
};

export const getById = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm' });
  }
};

export const editById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
  }
};

export const deleteById = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
};
