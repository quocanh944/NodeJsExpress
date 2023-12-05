import CartItem from '../models/cartItem.js';
import Product from '../models/product.js';

export const addProductToCart = async (currentUserId, productId) => {
    try {
        const isProductExist = await CartItem.findOne({
            $and: [
              { userId: currentUserId},
              { productId: productId},
            ],
          })
        if (!isProductExist) {
            const cartItem = new CartItem({
                userId: currentUserId,
                productId,
                quantity: 1,
            });
            const result = await cartItem.save();
            return result;
        } else {
            const result = await CartItem.findByIdAndUpdate(isProductExist._id, {quantity: isProductExist.quantity + 1}, { new: true })
            return result;
        }
    
    } catch (err) {
        console.log(err)
        throw err;
    }
};

export const getCart = async (currentUserId) => {
    try {
        const cart = await CartItem.find({ userId: currentUserId})
        let result = [];
        
        for (const cartItem of cart) {
            const product = await Product.findById(cartItem.productId);
            result.push({
                "productId": cartItem.productId,
                "barcode": product.barcode,
                "productName": product.productName,
                "importPrice": product.importPrice,
                "retailPrice": product.retailPrice,
                "category": product.category,
                "thumbnailUrl": product.thumbnailUrl,
                "quantity": cartItem.quantity,
                "cartItemId": cartItem._id,
            })
        }
        return result;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const editProductInCart = async (cartItemId, quantity) => {
    try {
        const updatedCartItem = await CartItem.findByIdAndUpdate(cartItemId, {quantity: quantity}, {new: true})
        return updatedCartItem;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const deleteById = async (cartItemId) => {
    try {
        const deletedCartItem = await CartItem.findByIdAndDelete(cartItemId)
        return deletedCartItem;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const clearCart = async (currentUserId) => {
    try {
        const deletedCartItem = await CartItem.deleteMany({ userId: currentUserId})
        return deletedCartItem;
    } catch (err) {
        console.log(err)
        throw err;
    }
}