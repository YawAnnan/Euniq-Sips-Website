import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /customers - Get all customers with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Validate pagination parameters
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive integers' });
  }

  const result = await pb.collection('customers').getList(page, limit, {
    sort: '-created',
  });

  logger.info(`Retrieved customers - page: ${page}, limit: ${limit}, total: ${result.total}`);

  res.json({
    customers: result.items,
    total: result.total,
    page: result.page,
    limit: result.perPage,
  });
});

// GET /customers/:id - Get a specific customer by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const customer = await pb.collection('customers').getOne(id);

  if (!customer) {
    throw new Error(`Customer not found: ${id}`);
  }

  logger.info(`Customer retrieved: ${id}`);

  res.json(customer);
});

// POST /customers - Create a new customer
router.post('/', async (req, res) => {
  const { email, name, phone, address, totalOrders, totalSpent } = req.body;

  // Validate required fields
  if (!email || !name) {
    return res.status(400).json({
      error: 'Missing required fields: email, name',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const customer = await pb.collection('customers').create({
    email,
    name,
    phone: phone || '',
    address: address || '',
    totalOrders: totalOrders || 0,
    totalSpent: totalSpent || 0,
  });

  logger.info(`Customer created: ${customer.id}`);

  res.status(201).json(customer);
});

// PUT /customers/:id - Update customer fields
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, phone, address, totalOrders, totalSpent } = req.body;

  const customer = await pb.collection('customers').getOne(id);

  if (!customer) {
    throw new Error(`Customer not found: ${id}`);
  }

  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }

  const updates = {};
  if (email !== undefined) updates.email = email;
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (totalOrders !== undefined) updates.totalOrders = totalOrders;
  if (totalSpent !== undefined) updates.totalSpent = totalSpent;

  const updatedCustomer = await pb.collection('customers').update(id, updates);

  logger.info(`Customer updated: ${id}`);

  res.json(updatedCustomer);
});

// DELETE /customers/:id - Delete a customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const customer = await pb.collection('customers').getOne(id);

  if (!customer) {
    throw new Error(`Customer not found: ${id}`);
  }

  await pb.collection('customers').delete(id);

  logger.info(`Customer deleted: ${id}`);

  res.json({ success: true, message: `Customer ${id} deleted successfully` });
});

export default router;