import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, Minus, Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
    return total + price * item.quantity;
  }, 0);

  // Total is now simply the cost of the drinks purchased
  const total = subtotal;

  const formatPrice = (cents) => {
    if (cartItems.length === 0) return 'GHS 0.00';
    const currencyInfo = cartItems[0].variant.currency_info;
    const amount = (cents / 100).toFixed(2);
    return currencyInfo?.symbol ? `${currencyInfo.symbol}${amount}` : `GHS ${amount}`;
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - Euniq Sips</title>
          <meta name="description" content="View and manage your shopping cart" />
        </Helmet>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="mb-8">Shopping Cart</h1>

          <div className="text-center py-16 bg-card rounded-2xl">
            <ShoppingCartIcon className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Discover our premium collection and add some beverages to your cart
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/products">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${cartItems.length}) - Euniq Sips`}</title>
        <meta name="description" content="Review your cart and proceed to checkout" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/products')}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-2xl p-6 shadow-sm flex gap-6"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />

                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{item.product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.variant.title}</p>
                  <p className="text-lg font-bold text-primary">
                    {item.variant.price_formatted}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <Button
                    onClick={() => removeFromCart(item.variant.id)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm font-semibold">
                    {formatPrice((item.variant.sale_price_in_cents ?? item.variant.price_in_cents) * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-card rounded-2xl p-6 shadow-sm sticky top-24"
            >
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartPage;