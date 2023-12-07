import express from 'express';
import { getSalesData, getStatisticView, getDashboardData, getProfitData } from '../controller/statisticController.js';

const statisticRouter = express.Router();

statisticRouter.get('/', getStatisticView)

statisticRouter.get('/sales-data', getSalesData);

statisticRouter.get('/dashboard', getDashboardData);

statisticRouter.get('/profit', getProfitData);

export default statisticRouter;
