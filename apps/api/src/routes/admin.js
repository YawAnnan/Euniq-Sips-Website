import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!pb.authStore.isValid) {
      return res.status(401).json({ error: 'Unauthorized: Not authenticated' });
    }

    // Check if the authenticated user is an admin
    const adminUser = await pb.collection('admin_users').getOne(pb.authStore.model.id);

    if (!adminUser) {
      return res.status(403).json({ error: 'Forbidden: Not an admin user' });
    }

    req.adminUser = adminUser;
    next();
  } catch (error) {
    logger.error('Admin check failed:', error);
    return res.status(403).json({ error: 'Forbidden: Admin verification failed' });
  }
};

// POST /admin/login - Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const authData = await pb.collection('admin_users').authWithPassword(email, password);

    logger.info(`Admin user logged in: ${email}`);

    res.json({
      token: authData.token,
      admin: authData.record,
    });
  } catch (error) {
    logger.error(`Admin login failed for ${email}:`, error);
    throw new Error('Invalid email or password');
  }
});

// GET /admin/users - Get all admin users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Validate pagination parameters
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive integers' });
  }

  const result = await pb.collection('admin_users').getList(page, limit, {
    sort: '-created',
  });

  logger.info(`Retrieved admin users - page: ${page}, limit: ${limit}, total: ${result.total}`);

  res.json({
    users: result.items,
    total: result.total,
    page: result.page,
    limit: result.perPage,
  });
});

// GET /admin/users/:id - Get a specific admin user (admin only)
router.get('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  const adminUser = await pb.collection('admin_users').getOne(id);

  if (!adminUser) {
    throw new Error(`Admin user not found: ${id}`);
  }

  logger.info(`Admin user retrieved: ${id}`);

  res.json(adminUser);
});

// POST /admin/users - Create a new admin user (admin only)
router.post('/users', isAdmin, async (req, res) => {
  const { email, password, name, role } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Missing required fields: email, password, name',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const adminUser = await pb.collection('admin_users').create({
    email,
    password,
    passwordConfirm: password,
    name,
    role: role || 'admin',
  });

  logger.info(`Admin user created: ${adminUser.email}`);

  res.status(201).json(adminUser);
});

// PUT /admin/users/:id - Update admin user (admin only)
router.put('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { email, name, role, password } = req.body;

  const adminUser = await pb.collection('admin_users').getOne(id);

  if (!adminUser) {
    throw new Error(`Admin user not found: ${id}`);
  }

  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }

  // Validate password length if provided
  if (password && password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const updates = {};
  if (email !== undefined) updates.email = email;
  if (name !== undefined) updates.name = name;
  if (role !== undefined) updates.role = role;
  if (password !== undefined) {
    updates.password = password;
    updates.passwordConfirm = password;
  }

  const updatedAdminUser = await pb.collection('admin_users').update(id, updates);

  logger.info(`Admin user updated: ${id}`);

  res.json(updatedAdminUser);
});

// DELETE /admin/users/:id - Delete admin user (admin only)
router.delete('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  const adminUser = await pb.collection('admin_users').getOne(id);

  if (!adminUser) {
    throw new Error(`Admin user not found: ${id}`);
  }

  // Prevent deleting the current authenticated admin
  if (id === pb.authStore.model.id) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }

  await pb.collection('admin_users').delete(id);

  logger.info(`Admin user deleted: ${id}`);

  res.json({ success: true, message: `Admin user ${id} deleted successfully` });
});

export default router;