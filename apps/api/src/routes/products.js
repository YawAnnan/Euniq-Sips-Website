import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /products - Get all products with pagination and optional filtering
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const status = req.query.status;

  // Validate pagination parameters
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive integers' });
  }

  const filter = status ? `status = "${status}"` : '';

  const result = await pb.collection('products').getList(page, limit, {
    filter: filter || undefined,
    sort: '-created',
  });

  logger.info(`Retrieved products - page: ${page}, limit: ${limit}, total: ${result.total}`);

  res.json({
    products: result.items,
    total: result.total,
    page: result.page,
    limit: result.perPage,
  });
});

// GET /products/:id - Get a specific product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const product = await pb.collection('products').getOne(id);

  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }

  logger.info(`Product retrieved: ${id}`);

  res.json(product);
});

// POST /products - Create a new product
router.post('/', async (req, res) => {
  const { productId, title, description, price, type, status, stock } = req.body;

  // Validate required fields
  if (!productId || !title || !price || !type || !status) {
    return res.status(400).json({
      error: 'Missing required fields: productId, title, price, type, status',
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a valid positive number' });
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ error: 'Stock must be a valid non-negative number' });
  }

  const product = await pb.collection('products').create({
    productId,
    title,
    description: description || '',
    price,
    type,
    status,
    stock: stock || 0,
  });

  logger.info(`Product created: ${product.productId}`);

  res.status(201).json(product);
});

// PUT /products/:id - Update product fields
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, type, status, stock } = req.body;

  const product = await pb.collection('products').getOne(id);

  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }

  // Validate price if provided
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ error: 'Price must be a valid positive number' });
  }

  // Validate stock if provided
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ error: 'Stock must be a valid non-negative number' });
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = price;
  if (type !== undefined) updates.type = type;
  if (status !== undefined) updates.status = status;
  if (stock !== undefined) updates.stock = stock;

  const updatedProduct = await pb.collection('products').update(id, updates);

  logger.info(`Product updated: ${id}`);

  res.json(updatedProduct);
});

// DELETE /products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const product = await pb.collection('products').getOne(id);

  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }

  await pb.collection('products').delete(id);

  logger.info(`Product deleted: ${id}`);

  res.json({ success: true, message: `Product ${id} deleted successfully` });
});

export default router;