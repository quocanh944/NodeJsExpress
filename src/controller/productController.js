import Product from '../models/product.js';

export const add = async (req, res) => {
  try {
    const productData = req.body;

    const product = new Product(productData);

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi khi tạo sản phẩm' });
  }
};

export const getAll = async (req, res) => {
    try {
      const product = await Product.find()
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm nào' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Lỗi khi đọc thông tin sản phẩm:', error);
      res.status(500).json({ error: 'Lỗi khi đọc thông tin sản phẩm' });
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