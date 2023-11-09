// product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        index: true,
        unique: true
    },
    productName: String,
    thumbnailUrl: String,
    importPrice: Number,
    retailPrice: Number,
    category: String,
    inventory: Number
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
