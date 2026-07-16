import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Tag, TrendingDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { calculatePrice } from '@/lib/pricingTiers';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartTotalQuantity } = useCart();

  const totalQty = getCartTotalQuantity();
  const { tierName, unitPrice, nextTier } = calculatePrice(totalQty);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl flex flex-col rounded-l-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-card-foreground">Your Order</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-card-foreground hover:bg-muted rounded-full">
                <X />
              </Button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center opacity-70">
                  <ShoppingCartIcon size={56} className="mb-4 text-primary" />
                  <p className="text-lg">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                    <Tag className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{tierName}: GH₵{unitPrice}/pack</p>
                      {nextTier && (
                        <p className="text-sm text-primary/80 mt-1 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Add {nextTier.min - totalQty} more packs for {nextTier.name} at GH₵{nextTier.unitPrice}/pack
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    {cartItems.map(item => (
                      <div key={item.variant.id} className="flex items-center gap-4 bg-muted/30 border border-border p-3 rounded-xl transition-colors hover:bg-muted/50">
                        <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-lg border border-border/50 bg-white" />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-card-foreground line-clamp-1">{item.product.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.variant.name || item.variant.title}</p>
                          <p className="text-sm text-primary font-bold mt-1">
                            GH₵{unitPrice.toFixed(2)}
                            <span className="text-muted-foreground font-normal text-xs ml-1">/pack</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center bg-background border border-border rounded-lg p-0.5 shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} 
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} 
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.variant.id)} 
                            className="text-muted-foreground hover:text-destructive text-xs font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border bg-card">
                <div className="flex justify-between items-center mb-6 text-card-foreground">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground font-medium">Total ({totalQty} packs)</span>
                    {totalQty >= 50 && (
                      <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full mt-1 w-fit">
                        Volume savings applied
                      </span>
                    )}
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight">{getCartTotal()}</span>
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-lg rounded-xl shadow-md active:scale-[0.98] transition-all">
                  <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                    Checkout Securely
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;