// customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  phoneNumber: String,
  fullName: String,
  address: String,
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
