// productCount.js
import mongoose from 'mongoose';

const productCountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
});

export default mongoose.model('ProductCount', productCountSchema);
