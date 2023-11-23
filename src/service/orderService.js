import Order from '../models/order.js';
import Product from '../models/product.js';
import CartItem from '../models/cartItem.js';

export const getOrder = async (id) => {
    try {
      const order = await Order.findById(id);
  
      let result = []
      let products = []
      
      for (const productCountId of order.products) {
        const productCount = await ProductCount.findById(productCountId);
        const product = await Product.findById(productCount.productId);
        products.push({
          "barcode": product.barcode,
          "productName": product.productName,
          "importPrice": product.importPrice,
          "retailPrice": product.retailPrice,
          "category": product.category,
          "quantity": productCount.quantity
        })
      }
      result.push({products})
      result.push({
        "total": order.totalAmount,
        "moneyReceived": order.moneyReceived,
        "moneyBack": order.moneyBack
      })
      return result;
    } catch (err) {
        console.log(err)
        throw err;
    }
  };