import Order from '../models/order.js';
import Product from '../models/product.js';
import CartItem from '../models/cartItem.js';
import User from '../models/user.js';

import * as orderService from '../service/orderService.js';

export const addOrder = async (req, res) => {
    try {
        
      const { customerId, cartItemIds, totalAmount, moneyReceived, moneyBack } = req.body;
      const { user } = req.session
      const saleId = user._id //current userID
  
      const newOrder = new Order({
        saleId,
        customerId, 
        products: cartItemIds,
        totalAmount, 
        moneyReceived, 
        moneyBack 
      });
      
      await newOrder.save();
  
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};
