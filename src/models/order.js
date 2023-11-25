// order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
  totalAmount: Number,
  moneyReceived: Number,
  moneyBack: Number,
  purchaseDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
