import * as statisticService from '../service/statisticService.js';

const getStatisticView = (req, res) => {
  res.render('pages/statistic')
}

const getSalesData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await statisticService.getSalesData(startDate, endDate);
    res.json(data);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getDashboardData = async (req, res) => {
  try {
    const data = await statisticService.getDashboardData();

    console.log(data)

    res.status(200).json({ message: true, data });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getProfitData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const profitData = await statisticService.calculateProfitByDate(startDate, endDate);
    res.json(profitData);
  } catch (error) {
    console.error('Error fetching profit data:', error);
    res.status(500).send('Internal Server Error');
  }
};

export {
  getSalesData, getStatisticView, getDashboardData, getProfitData
}
