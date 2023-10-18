import Order from '../models/order.js';

export const add = async (req, res) => {
  try {
    const orderData = req.body;

    const order = new Order(orderData);

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi tạo đơn hàng' });
  }
};

export const getAll = async (req, res) => {
    try {
      const order = await Order.find()
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng nào' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error('Lỗi khi đọc thông tin đơn hàng:', error);
      res.status(500).json({ error: 'Lỗi khi đọc thông tin đơn hàng' });
    }
  };

export const getById = async (req, res) => {
  try {
    const orderId = req.params.id
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin đơn hàng' });
  }
};

export const editById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật đơn hàng' });
  }
};

export const deleteById = async (req, res) => {
    try {
      const orderId = req.params.id;
      const deletedOrder = await Order.findByIdAndRemove(orderId);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      res.status(500).json({ error: 'Lỗi khi xóa đơn hàng' });
    }
  };