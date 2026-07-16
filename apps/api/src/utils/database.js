import 'dotenv/config';

// In-memory database for orders
const ordersDB = new Map();

// Initialize with mock orders for testing
const initializeMockOrders = () => {
  const mockOrders = [
    {
      orderId: 'ord_mock_1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      totalAmount: 299.99,
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
      items: [
        {
          productId: 'PROD-001',
          productName: 'Wireless Headphones',
          quantity: 1,
          price: 79.99,
        },
        {
          productId: 'PROD-004',
          productName: 'Portable Charger',
          quantity: 2,
          price: 49.99,
        },
      ],
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentStatus: 'Paid',
    },
    {
      orderId: 'ord_mock_2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      totalAmount: 124.97,
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'dispatched',
      items: [
        {
          productId: 'PROD-003',
          productName: 'Phone Case',
          quantity: 3,
          price: 24.99,
        },
        {
          productId: 'PROD-005',
          productName: 'Screen Protector',
          quantity: 2,
          price: 9.99,
        },
      ],
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      paymentStatus: 'Paid',
    },
    {
      orderId: 'ord_mock_3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      totalAmount: 89.98,
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      items: [
        {
          productId: 'PROD-002',
          productName: 'USB-C Cable',
          quantity: 5,
          price: 12.99,
        },
      ],
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
      paymentStatus: 'Pending',
    },
  ];

  mockOrders.forEach(order => {
    ordersDB.set(order.orderId, order);
  });
};

// Initialize on module load
initializeMockOrders();

const database = {
  // Orders operations
  createOrder: (orderData) => {
    const orderId = `ord_${Date.now()}`;
    const order = {
      orderId,
      ...orderData,
      orderDate: new Date().toISOString(),
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'Pending',
      createdAt: new Date().toISOString(),
    };
    ordersDB.set(orderId, order);
    return order;
  },

  getOrderById: (orderId) => {
    return ordersDB.get(orderId) || null;
  },

  getOrders: (page = 1, limit = 10) => {
    const allOrders = Array.from(ordersDB.values());
    const total = allOrders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = allOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
    };
  },

  searchOrders: (criteria) => {
    const results = [];
    for (const order of ordersDB.values()) {
      if (criteria.orderId && order.orderId === criteria.orderId) {
        results.push(order);
      }
      if (criteria.email && order.customerEmail === criteria.email) {
        results.push(order);
      }
    }
    // Remove duplicates
    return Array.from(new Map(results.map(o => [o.orderId, o])).values());
  },

  updateOrder: (orderId, updates) => {
    const order = ordersDB.get(orderId);
    if (!order) return null;
    const updatedOrder = { ...order, ...updates };
    ordersDB.set(orderId, updatedOrder);
    return updatedOrder;
  },

  getAllOrders: () => {
    return Array.from(ordersDB.values());
  },
};

export default database;
export { database };