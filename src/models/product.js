// product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    barcode: String,
    productName: String,
    importPrice: Number,
    retailPrice: Number,
    category: String,
    inventory: Number
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
