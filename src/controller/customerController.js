import Customer from '../models/customer.js';

export const add = async (req, res) => {
  try {
    const customerData = req.body;

    const customer = new Customer(customerData);

    const savedCustomer = await customer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Lỗi khi tạo khách hàng:', error);
    res.status(500).json({ error: 'Lỗi khi tạo khách hàng' });
  }
};

export const getAll = async (req, res) => {
    try {
      const customer = await Customer.find()
      if (!customer) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng nào' });
      }
  
      res.status(200).json(customer);
    } catch (error) {
      console.error('Lỗi khi đọc thông tin khách hàng:', error);
      res.status(500).json({ error: 'Lỗi khi đọc thông tin khách hàng' });
    }
  };

export const getById = async (req, res) => {
  try {
    const customerId = req.params.id
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin khách hàng' });
  }
};

export const editById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const updateData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật khách hàng' });
  }
};

export const deleteById = async (req, res) => {
    try {
      const customerId = req.params.id;
      const deletedCustomer = await Customer.findByIdAndRemove(customerId);
  
      if (!deletedCustomer) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Lỗi khi xóa khách hàng:', error);
      res.status(500).json({ error: 'Lỗi khi xóa khách hàng' });
    }
  };