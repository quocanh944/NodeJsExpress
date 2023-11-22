import ProductCount from '../models/productCount.js';
import Product from '../models/product.js';

export const addProductToCart = async (currentUserId, productId) => {
    try {
        const isProductExist = await ProductCount.findOne({
            $and: [
                { userId: currentUserId },
                { productId: productId },
            ],
        })
        if (!isProductExist) {
            const productCount = new ProductCount({
                userId: currentUserId,
                productId,
                quantity: 1,
            });
            const result = await productCount.save();
            return result;
        } else {
            const result = await ProductCount.findByIdAndUpdate(isProductExist._id, { quantity: isProductExist.quantity + 1 }, { new: true })
            return result;
        }

    } catch (err) {
        console.log(err)
        throw err;
    }
};

export const getCart = async (currentUserId) => {
    try {
        const cart = await ProductCount.find({ userId: currentUserId })
        let result = [];

        for (const productCount of cart) {
            const product = await Product.findById(productCount.productId);
            result.push({
                "barcode": product.barcode,
                "productName": product.productName,
                "importPrice": product.importPrice,
                "retailPrice": product.retailPrice,
                "category": product.category,
                "quantity": productCount.quantity,
                "productCountId": productCount._id,
            })
        }
        return result;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const editProductInCart = async (productCountId, quantity) => {
    try {
        const updatedProductCount = await ProductCount.findByIdAndUpdate(productCountId, { quantity: quantity }, { new: true })
        return updatedProductCount;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const deleteById = async (productCountId) => {
    try {
        const deletedProductCount = await ProductCount.findByIdAndDelete(productCountId)
        return deletedProductCount;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const clearCart = async (currentUserId) => {
    try {
        const deletedProductCount = await ProductCount.deleteMany({ userId: currentUserId })
        return deletedProductCount;
    } catch (err) {
        console.log(err)
        throw err;
    }
}
