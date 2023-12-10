import express from 'express';
import { getSalesData, getStatisticView, getDashboardData, getProfitData } from '../controller/statisticController.js';
import { requireRole } from '../middleware/authMiddleware.js';

const statisticRouter = express.Router();

statisticRouter.get('/', getStatisticView)

statisticRouter.get('/sales-data', getSalesData);

statisticRouter.get('/dashboard', getDashboardData);

statisticRouter.get('/profit', requireRole(['ADMIN']), getProfitData);

export default statisticRouter;
