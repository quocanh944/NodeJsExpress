import customer from '../models/customer.js';
import notification from '../models/notification.js';
import order from '../models/order.js';
import Order from '../models/order.js'
import product from '../models/product.js';

const getSalesData = async (startDate, endDate) => {
  console.log(startDate, endDate)
  const orders = await order.find({
    purchaseDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
  }).sort({ purchaseDate: 1 });

  console.log("orders: ", orders)

  const totalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const numberOfOrders = orders.length;
  const numberOfProducts = orders.reduce((acc, order) => acc + order.products.length, 0);

  return {
    totalAmount,
    numberOfOrders,
    numberOfProducts,
    orders
  };
};

const getDashboardData = async () => {
  const numberOfProducts = await product.countDocuments();
  const numberOfOrders = await order.countDocuments();
  const numberOfCustomers = await customer.countDocuments();
  const numberOfUnreadNotifications = await notification.countDocuments({ isRead: false });

  return {
    numberOfProducts,
    numberOfOrders,
    numberOfCustomers,
    numberOfUnreadNotifications
  };
};

const calculateProfitByDate = async (startDate, endDate) => {
  const orders = await order.aggregate([
    {
      $match: {
        purchaseDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
        totalRevenue: { $sum: "$totalAmount" },
        totalCost: { $sum: "$cost" }
      }
    },
    {
      $project: {
        date: "$_id",
        _id: 0,
        profit: { $subtract: ["$totalRevenue", "$totalCost"] }
      }
    },
    { $sort: { date: 1 } }
  ]);

  console.log(orders.map(order => ({
    date: order.date,
    profit: order.profit
  })));

  return orders.map(order => ({
    date: order.date,
    profit: order.profit
  }));
};

export { getSalesData, getDashboardData, calculateProfitByDate }
