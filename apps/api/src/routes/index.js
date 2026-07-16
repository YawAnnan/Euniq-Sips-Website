import { Router } from 'express';
import healthCheck from './health-check.js';
import ordersRouter from './orders.js';
import paystackRouter from './paystack.js';
import productsRouter from './products.js';
import dashboardRouter from './dashboard.js';
import customersRouter from './customers.js';
import adminRouter from './admin.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/orders', ordersRouter);
    router.use('/products', productsRouter);
    router.get('/dashboard-stats', dashboardRouter);
    router.use('/paystack', paystackRouter);
    router.use('/customers', customersRouter);
    router.use('/admin', adminRouter);

    return router;
};