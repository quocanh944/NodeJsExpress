// cartItem.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
});

export default mongoose.model('CartItem', cartItemSchema);
