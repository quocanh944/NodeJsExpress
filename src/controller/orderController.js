import Order from '../models/order.js';
import Product from '../models/product.js';
import CartItem from '../models/cartItem.js';
import User from '../models/user.js';

import * as orderService from '../service/orderService.js';
import * as productService from '../service/productService.js';

export const addOrder = async (req, res) => {
  try {

    const { customerId, products, totalAmount, discount, finalAmount, moneyReceived, moneyBack } = req.body;
    const { user } = req.session
    const saleId = user._id //current userID

    for (const product of products) {
      await productService.decreaseProductInventory(product.productId, product.quantity);
    }
    const newOrder = new Order({
      saleId,
      customerId,
      products,
      totalAmount,
      discount,
      finalAmount,
      moneyReceived,
      moneyBack
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderByCustomerID = async (req, res) => {
  console.log("getOrderByCustomerID")
  try {
    const { customerID } = req.params;
    let { startDate, endDate } = req.query;
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    endDate.setDate(endDate.getDate() + 1);
    const orders = await orderService.getOrderByCustomerID(customerID, startDate, endDate);
    console.log(orders)
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getListOrder = async (req, res) => {
  try {
    const { user } = req.session
    const saleId = user._id //current userID
    console.log(saleId)
    
    let query = {};
    if (req.query.customerId) {
      query.customerId = req.query.customerId;
    } else if (req.query.saleId) {
      query.saleId = req.query.saleId;
    } else {
      query.saleId = saleId;
    }

    const orders = await orderService.getListOrder(query)
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetail = await orderService.getOrderDetail(id);
    res.status(200).json(orderDetail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
