import * as customerService from '../service/customerService.js';
import Customer from "../models/customer.js";

const search = async (req, res) => {
  try {
    const limit = 5
    const query = req.query.query || "";

    const result = await customerService.searchCustomerByPhone(query, limit);

    res.status(201).json(result)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}

const getByPhone = async (req, res) => {
  try {
    const phone = req.query.phone || "";
    const customer = await customerService.getCustomerByPhone(phone);
    res.status(200).json(customer)
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getCustomerView = (req, res) => {
  const { user } = req.session;
  if (user.role === 'ADMIN') {
    return res.render('pages/customer', {
      title: "Quản lý người dùng",
      user: req.session.user
    });
  }
  return res.render('pages/sale-customer', {
    title: "Quản lý người dùng",
    user: req.session.user
  });
}

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getCustomerById = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const customer = await customerService.getCustomerById(customerId);

    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error getting customer by ID:', error);
    res.status(500).send('Internal Server Error');
  }
};


const addNewCustomer = async (req, res) => {
  try {
    const { phoneNumber, fullName, address } = req.body;

    const newCustomer = new Customer({ phoneNumber, fullName, address });

    await newCustomer.save();

    res.status(201).json({ message: "New customer added successfully", customer: newCustomer });
  } catch (error) {
    res.status(400).json({ message: "Error adding customer", error: error.message });
  }
};

const getCustomerViewDetail = async (req, res) => {
  const { customerId } = req.params;
  const customer = await customerService.getCustomerById(customerId);
  res.render('pages/customer-detail', {
    title: "Customer Detail",
    user: req.session.user,
    customer
  });
}

export { search, getByPhone, getAllCustomers, getCustomerById, getCustomerView, addNewCustomer, getCustomerViewDetail }
