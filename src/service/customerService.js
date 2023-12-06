import Customer from "../models/customer.js";

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
    return customer;
  } catch (err) {
    console.log(err);
    throw err;
  }
};



export { searchCustomerByPhone, getCustomerByPhone, getAllCustomers, getCustomerById }
