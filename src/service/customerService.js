import Customer from "../models/customer.js";

export const searchCustomerByPhone = async (query, limit) => {
    try {
      const customers = await Customer.find({phoneNumber: { $regex: query }}).limit(limit);
      return customers;
    } catch (err) {
      console.log(err);
      throw err;
    }
}

export const getCustomerByPhone = async (phoneNumber) => {
  try {
    const customers = await Customer.findOne({phoneNumber: phoneNumber});
    return customers;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
