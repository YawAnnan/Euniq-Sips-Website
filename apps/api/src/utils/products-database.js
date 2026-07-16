import 'dotenv/config';

// In-memory database for products
const productsDB = new Map();

// Initialize with sample products
const initializeProducts = () => {
  const sampleProducts = [
    {
      id: 'PROD-001',
      title: 'Wireless Headphones',
      price: 79.99,
      stock: 45,
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation',
    },
    {
      id: 'PROD-002',
      title: 'USB-C Cable',
      price: 12.99,
      stock: 150,
      category: 'Accessories',
      description: 'Durable USB-C charging and data cable',
    },
    {
      id: 'PROD-003',
      title: 'Phone Case',
      price: 24.99,
      stock: 200,
      category: 'Accessories',
      description: 'Protective phone case with premium materials',
    },
    {
      id: 'PROD-004',
      title: 'Portable Charger',
      price: 49.99,
      stock: 80,
      category: 'Electronics',
      description: '20000mAh portable power bank with fast charging',
    },
    {
      id: 'PROD-005',
      title: 'Screen Protector',
      price: 9.99,
      stock: 300,
      category: 'Accessories',
      description: 'Tempered glass screen protector',
    },
  ];

  sampleProducts.forEach(product => {
    productsDB.set(product.id, product);
  });
};

// Initialize on module load
initializeProducts();

const productsDatabase = {
  // Products operations
  getAllProducts: () => {
    return Array.from(productsDB.values());
  },

  getProductById: (productId) => {
    return productsDB.get(productId) || null;
  },

  updateProduct: (productId, updates) => {
    const product = productsDB.get(productId);
    if (!product) return null;
    const updatedProduct = { ...product, ...updates };
    productsDB.set(productId, updatedProduct);
    return updatedProduct;
  },

  updateProductPrice: (productId, price) => {
    return productsDatabase.updateProduct(productId, { price });
  },

  updateProductStock: (productId, stock) => {
    return productsDatabase.updateProduct(productId, { stock });
  },
};

export default productsDatabase;
export { productsDatabase };