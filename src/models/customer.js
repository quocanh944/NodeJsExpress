// customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  phoneNumber: String,
  fullName: String,
  address: String
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
