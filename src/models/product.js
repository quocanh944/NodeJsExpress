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
    isBought: { type: Boolean, default: false },
    inventory: Number
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
