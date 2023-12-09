import Order from '../models/order.js';
import Product from '../models/product.js';

export const getOrderByCustomerID = async (customerId, startDate, endDate) => {
  try {
    const orders = await Order.find({
      customerId: customerId,
      purchaseDate: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'products.productId',
      model: 'Product'
    });

    return orders;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getListOrder = async (id) => {
  try {
    const orders = await Order.find(id).sort({ purchaseDate: 'desc' });
    let result = []

    for (const order of orders) {
      let totalProducts = 0
      order.products.forEach(product => { totalProducts += product.quantity });
      result.push({
        "orderId": order._id,
        "purchaseDate": order.purchaseDate,
        "totalProduct": totalProducts,
        "totalAmount": order.totalAmount,
        "discount": order.discount,
        "finalAmount": order.finalAmount,
        "moneyReceived": order.moneyReceived,
        "moneyBack": order.moneyBack
      })
    }
    return result;
  } catch (err) {
    console.log(err)
    throw err;
  }
}

export const getOrderDetail = async (id) => {
  try {
    const order = await Order.findById(id);
    let result = []

    for (const product of order.products) {
      const productDetail = await Product.findById(product.productId);
      result.push({
        "productName": productDetail.productName,
        "thumbnailUrl": productDetail.thumbnailUrl,
        "retailPrice": productDetail.retailPrice,
        "quantity": product.quantity,
        "totalPrice": product.totalPrice,
      })
    }
    return result;
  } catch (err) {
    console.log(err)
    throw err;
  }
}
