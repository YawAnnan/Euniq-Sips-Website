import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

const VALID_STATUSES = ['pending', 'confirmed', 'packaging', 'dispatched', 'delivered', 'cancelled'];

// Helper to safely format address and phone since they share the shippingAddress text field in DB
const formatOrder = (order) => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Processing',
    packaging: 'Processing',
    dispatched: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  let address = order.shippingAddress;
  let phone = '';

  try {
    const parsed = JSON.parse(order.shippingAddress);

    if (parsed && typeof parsed === 'object' && parsed.address !== undefined) {
      address = parsed.address;
      phone = parsed.phone || '';
    }
  } catch (e) {
    // String fallback if it's an old order without JSON payload
  }

  return {
    ...order,
    status: statusMap[order.status] || order.status,
    email: order.customerEmail,
    phone: phone,
    deliveryAddress: address,
    shippingAddress: address,
  };
};

// POST /orders - Create a new order
router.post('/', async (req, res) => {
  const { customerName, customerEmail, phoneNumber, deliveryAddress, shippingAddress, totalAmount, items, status, paymentStatus } = req.body;

  const actualAddress = deliveryAddress || shippingAddress;

  // Validate required fields
  if (!customerName || !customerEmail || !totalAmount || !items || !actualAddress) {
    return res.status(400).json({
      error: 'Missing required fields: customerName, customerEmail, totalAmount, items, deliveryAddress',
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items must be a non-empty array' });
  }

  // Combine into a JSON string to fit into the existing PocketBase 'shippingAddress' text field
  const packedAddress = JSON.stringify({
    address: actualAddress,
    phone: phoneNumber || ''
  });

  const order = await pb.collection('orders').create({
    orderId: `ORD-${Date.now()}`,
    customerName,
    customerEmail,
    customerNumber: phoneNumber || '',
    totalAmount,
    items,
    shippingAddress: packedAddress,
    status: status || 'pending',
    paymentStatus: paymentStatus || 'Pending',
    orderDate: new Date().toISOString(),
  });

  logger.info(`Order created: ${order.orderId}`);

  res.status(201).json(formatOrder(order));
});

// GET /orders - Get all orders with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Validate pagination parameters
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive integers' });
  }

  const result = await pb.collection('orders').getList(page, limit, {
    sort: '-orderDate',
  });

  logger.info(`Retrieved orders - page: ${page}, limit: ${limit}, total: ${result.totalItems}`);

  res.json({
    orders: result.items.map(formatOrder),
    total: result.totalItems,
    page: result.page,
    limit: result.perPage,
  });
});

router.get('/search', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      error: 'Email required'
    });
  }

  const result = await pb.collection('orders').getList(1, 50, {
    filter: `customerEmail="${email}"`,
    sort: '-orderDate'
  });

  res.json(result.items.map(formatOrder));
});

// GET /orders/:orderId - Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pb.collection('orders').getList(1, 1, {
      filter: `orderId="${orderId}"`
    });

    if (result.items.length === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    res.json(formatOrder(result.items[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to retrieve order'
    });
  }
});

// PUT /orders/:orderId - Update order status and details
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status, shippingAddress, items, paymentStatus, customerNumber } = req.body;

  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  // Validate status if provided
  if (status && !VALID_STATUSES.includes(status.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  const updates = {};
  if (status) updates.status = status.toLowerCase();
  
  if (shippingAddress) {
    // Ensure we maintain the JSON structure if it already existed
    let phone = '';
    try {
      const parsed = JSON.parse(order.shippingAddress);
      phone = parsed.phone || '';
    } catch (e) {
      // Ignore
    }
    updates.shippingAddress = JSON.stringify({ address: shippingAddress, phone });
  }
  
  if (items) updates.items = items;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (customerNumber !== undefined) updates.customerNumber = customerNumber;

  const updatedOrder = await pb.collection('orders').update(orderId, updates);

  logger.info(`Order updated: ${orderId}`);

  res.json(formatOrder(updatedOrder));
});

// DELETE /orders/:orderId - Delete an order
router.delete('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  await pb.collection('orders').delete(orderId);

  logger.info(`Order deleted: ${orderId}`);

  res.json({ success: true, message: `Order ${orderId} deleted successfully` });
});

export default router;