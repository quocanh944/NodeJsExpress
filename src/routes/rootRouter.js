// rootRouter.js
import express from 'express';
import userRouter from './userRouter.js';
import customerRouter from './customerRouter.js';
import orderRouter from './orderRouter.js';
import productRouter from './productRouter.js';
import { checkUserActivation, checkUserBlocked, isAuthenticated, isFirstLogined, requireRole } from '../middleware/authMiddleware.js';
import accountRouter from './accountRouter.js';
import cartRouter from './cartRouter.js';
import { fetchNotifications } from '../middleware/notificationMiddleware.js';
import notificationRouter from './notificationRouter.js';
import statisticRouter from './statisticRouter.js';
import profileRouter from './profileRouter.js';
import { faker } from '@faker-js/faker';
import Order from '../models/order.js';
import Product from '../models/product.js';
import Customer from '../models/customer.js';
import User from '../models/user.js';

const rootRouter = express.Router();

rootRouter.use('/', accountRouter);

rootRouter.get("/data-mock-user", async (req, res) => {

    for (let index = 0; index < 70; index++) {
        const user = new User({
            email: faker.internet.email(),
            password: "abc123@",
            role: "SALE",
            fullName: faker.person.fullName(),
            gender: Math.random() > 0.7 ? "female" : "male",
            avatar: faker.image.avatar(),
            phoneNumber: faker.phone.number("09########"),
            birthday: faker.date.birthdate({max: 30, min: 18}),
            isActive: true,
            isLocked: false,
            isFirstLogined: false
        })
        await user.save();
    }
    res.send("Done");
})

rootRouter.get("/data-mock-user-2", async (req, res) => {
    const allUsers = await User.find();
    for (let index = 0; index < allUsers.length; index++) {
        const user = allUsers[index];
        user.isFirstLogin = false
        await user.save();
    }
    res.send("Done");
})

rootRouter.get("/data-mock-customer", async (req, res) => {

    for (let index = 0; index < 70; index++) {
        const customer = new Customer({
            phoneNumber: faker.phone.number("09########"),
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress()
        })
        await customer.save();
    }
    res.send("Done");
})

rootRouter.get("/data-mock", async (req, res) => {
    const allProducts = await Product.find();
    const allUsers = await User.find();
    const allCustomers = await Customer.find();

    for (let index = 0; index < 1000; index++) {
        let totalAmount = 0;
        let numberOfItems = Math.floor(1 + Math.random()*4);
        const user = allUsers[Math.floor(Math.random()*allUsers.length)]
        const customer = allCustomers[Math.floor(Math.random()*allCustomers.length)]
        let listProducts = []
        for (let i = 0; i < numberOfItems; i++) {
            const prod = allProducts[Math.floor(Math.random()*allProducts.length)]
            prod.isBought = true
            await prod.save()
            const quantity = Math.floor(1 + Math.random()*3);
            listProducts.push({
                productId: prod._id,
                quantity: quantity,
                totalPrice: prod.retailPrice * quantity
            })
            totalAmount += prod.retailPrice * quantity;
        }
        let temp = Math.floor(Math.random() * 100);
        const discount = Math.floor(Math.random()*20)
        const order = new Order({
            saleId: user._id,
            customerId: customer._id,
            products: listProducts,
            totalAmount,
            discount,
            finalAmount: totalAmount * (1 - (discount / 100)),
            moneyReceived: totalAmount * (1 - (discount / 100)) + temp,
            moneyBack: temp,
            purchaseDate: faker.date.between({ from: '2023-01-01T00:00:00.000Z', to: '2023-12-09T00:00:00.000Z' })
        });
        await order.save();
    }
    res.send("Done");
})

rootRouter.get('/contact-admin', (req, res) => {
    res.send('Your account is not activated. Please contact the administrator for the activation link.');
});

rootRouter.get('/', isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, (req, res) => {
    const { user } = req.session;

    if (user) {
        if (user.role === 'SALE') {
            res.render('pages/sales', { user });
        } else {
            res.render('pages/index', { user });
        }
    }
});

rootRouter.get('/home', isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, (req, res) => {
    const { user } = req.session;
    res.render('pages/index', { user });
});

rootRouter.use("/user", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN']), userRouter);
rootRouter.use("/product", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), productRouter);
rootRouter.use("/customer", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), customerRouter);
rootRouter.use("/order", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), orderRouter);
rootRouter.use("/cart", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['SALE']), cartRouter);
rootRouter.use("/notification", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN']), notificationRouter);
rootRouter.use("/statistic", isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), statisticRouter);
rootRouter.use('/profile', isAuthenticated, checkUserActivation, isFirstLogined, checkUserBlocked, fetchNotifications, requireRole(['ADMIN', 'SALE']), profileRouter);

export default rootRouter;
