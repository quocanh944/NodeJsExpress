// transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  salespersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totalAmount: Number,
  moneyGiven: Number,
  moneyReturned: Number,
  purchaseDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
