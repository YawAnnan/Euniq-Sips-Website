import express from 'express';
import database from '../utils/database.js';
import productsDatabase from '../utils/products-database.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /dashboard-stats - Get dashboard statistics
router.get('/', async (req, res) => {
  const allOrders = database.getAllOrders();
  const allProducts = productsDatabase.getAllProducts();

  // Calculate total orders
  const totalOrders = allOrders.length;

  // Calculate total revenue
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // Calculate recent orders (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentOrdersCount = allOrders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= sevenDaysAgo;
  }).length;

  // Calculate top products by sales count
  const productSalesMap = new Map();
  allOrders.forEach(order => {
    (order.items || []).forEach(item => {
      const productId = item.productId || item.id;
      const currentSales = productSalesMap.get(productId) || 0;
      productSalesMap.set(productId, currentSales + item.quantity);
    });
  });

  const topProducts = Array.from(productSalesMap.entries())
    .map(([productId, sales]) => {
      const product = productsDatabase.getProductById(productId);
      return {
        id: productId,
        title: product ? product.title : 'Unknown Product',
        sales,
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  logger.info('Dashboard stats retrieved');

  res.json({
    totalOrders,
    totalRevenue,
    recentOrdersCount,
    topProducts,
  });
});

export default router;