import express from 'express';
import database from '../utils/database.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /orders - Get all orders
router.get('/', async (req, res) => {
  const allOrders = database.getAllOrders();

  const formattedOrders = allOrders.map(order => ({
    id: order.orderId,
    customerName: order.customerName,
    customerEmail: order.email,
    total: order.totalAmount,
    status: order.status,
    date: order.orderDate,
    items: (order.items || []).map(item => ({
      productId: item.productId || item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  }));

  logger.info(`Retrieved ${formattedOrders.length} orders`);

  res.json(formattedOrders);
});

// POST /orders/:id/status - Update order status
router.post('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const order = database.getOrderById(id);

  if (!order) {
    throw new Error(`Order not found: ${id}`);
  }

  const updatedOrder = database.updateOrder(id, { status });

  logger.info(`Order status updated: ${id} -> ${status}`);

  res.json({
    id: updatedOrder.orderId,
    customerName: updatedOrder.customerName,
    customerEmail: updatedOrder.email,
    total: updatedOrder.totalAmount,
    status: updatedOrder.status,
    date: updatedOrder.orderDate,
    items: (updatedOrder.items || []).map(item => ({
      productId: item.productId || item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  });
});

export default router;