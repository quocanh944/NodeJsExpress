import Product from '../models/product.js';
import User from '../models/user.js';
import * as cartService from '../service/cartService.js';

export const addProductToCart = async (req, res) => {
  try {
    const { user } = req.session
    const userId = user._id //current userID
    const productId = req.params.id;
    const result = await cartService.addProductToCart(userId ,productId)

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ err: 'Internal server error' });
  }
};

export const getCart = async (req, res) => {
    try {
        const { user } = req.session
        const userId = user._id //current userID
        const cart = await cartService.getCart(userId);

        res.status(200).json(cart);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const editById = async (req, res) => {
    try {
        const cartItemId = req.query.cartItemId;
        const newQuantity = req.query.quantity;

        const updatedCartItem = await cartService.editProductInCart(cartItemId, newQuantity);
        res.status(200).json(updatedCartItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const deleteById = async (req, res) => {
    try {
        const cartItemId = req.query.cartItemId;

        const deletedCartItem = await cartService.deleteById(cartItemId);

        res.status(200).json(deletedCartItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const clearCart = async (req, res) => {
    try {
        const { user } = req.session
        const userId = user._id //current userID
        const deletedCartItem = await cartService.clearCart(userId)
        res.status(200).json(deletedCartItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}
