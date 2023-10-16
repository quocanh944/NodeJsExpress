// product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    barcode: String,
    productName: String,
    importPrice: Number,
    retailPrice: Number,
    category: String,
    creationDate: { type: Date, default: Date.now },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
