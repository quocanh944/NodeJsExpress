import * as customService from '../service/customerService.js';

export const search = async (req, res) => {
  try {
    const limit = 5
    const query = req.query.query || "";

    const result = await customService.searchCustomerByPhone(query, limit);

    res.status(201).json(result)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}

export const getByPhone = async (req, res) => {
  try {
    const phone = req.query.phone || "";
    const customer = await customService.getCustomerByPhone(phone);
    res.status(200).json(customer)
  } catch (err) {
    console.log(err);
    throw err;
  }
}