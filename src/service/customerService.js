import Customer from "../models/customer.js";
import order from "../models/order.js";

const searchCustomerByPhone = async (query, limit) => {
  try {
    const customers = await Customer.find({ phoneNumber: { $regex: query } }).limit(limit);
    return customers;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getCustomerByPhone = async (phoneNumber) => {
  try {
    const customers = await Customer.findOne({ phoneNumber: phoneNumber });
    return customers;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getAllCustomers = async (page, limit) => {
  try {
    const customers = await Customer.find();
    return customers || [];
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (id) => {
  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const orders = await order.find({ customerId: id });

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const totalProductsBought = orders.reduce((sum, order) => sum + order.products.length, 0);

    return {
      ...customer.toObject(),
      totalSpent,
      totalProductsBought,
      orders
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};



export { searchCustomerByPhone, getCustomerByPhone, getAllCustomers, getCustomerById }
