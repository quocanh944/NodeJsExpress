// order.js
import mongoose from 'mongoose';

var orderDetailSchema = mongoose.Schema({
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  quantity: Number,
  totalPrice: Number,
}, { _id : false });

const orderSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  products: [orderDetailSchema],
  totalAmount: Number,
  discount: Number,
  finalAmount: Number,
  moneyReceived: Number,
  moneyBack: Number,
  purchaseDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
