import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { formatCurrency } from '@/api/EcommerceApi';
import { vivaProducts } from '@/lib/vivaData';
import { calculatePrice, getTotalPrice } from '@/lib/pricingTiers';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

// Extract all currently valid variant IDs from the data source
const validVariantIds = new Set(vivaProducts.flatMap(p => p.variants.map(v => v.id)));

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Clean out any cart items that have an invalid/old variant ID, but allow mix packs
        const validItems = parsedCart.filter(item => 
          item.variant && item.variant.id && 
          (validVariantIds.has(item.variant.id) || item.variant.id.startsWith('mix-pack-'))
        );
        
        // Update storage immediately if we found and removed invalid items
        if (validItems.length !== parsedCart.length) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
        }
        
        return validItems;
      }
      return [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const getCartTotalQuantity = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
    return new Promise((resolve, reject) => {
      // Security check to ensure we only add recognized valid variants or mix packs
      const isMixPack = variant?.id?.startsWith('mix-pack-');
      if (!variant || !variant.id || (!validVariantIds.has(variant.id) && !isMixPack)) {
        return reject(new Error("Invalid product variant selected. Please refresh the page and try again."));
      }

      if (variant.manage_inventory && !isMixPack) {
        const existingItem = cartItems.find(item => item.variant.id === variant.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if ((currentCartQuantity + quantity) > availableQuantity) {
          const error = new Error(`Not enough stock for ${product.title} (${variant.title}). Only ${availableQuantity} left.`);
          return reject(error);
        }
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.variant.id === variant.id);
        if (existingItem && !isMixPack) {
          return prevItems.map(item =>
            item.variant.id === variant.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        // Mix packs are always added as new items to preserve unique configurations
        return [...prevItems, { product, variant, quantity }];
      });
      resolve();
    });
  }, [cartItems]);

  const removeFromCart = useCallback((variantId) => {
    setCartItems(prevItems => prevItems.filter(item => item.variant.id !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    if (!validVariantIds.has(variantId) && !variantId.startsWith('mix-pack-')) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    let totalCents = 0;
    let standardQty = 0;

    // Separate mix packs and standard items
    cartItems.forEach(item => {
      if (item.product.type === 'mix_pack') {
        totalCents += (item.product.price * 100) * item.quantity;
      } else {
        standardQty += item.quantity;
      }
    });

    if (standardQty > 0) {
      const { unitPrice } = calculatePrice(standardQty);
      const standardTotal = getTotalPrice(standardQty, unitPrice);
      totalCents += standardTotal * 100;
    }

    if (totalCents === 0) return formatCurrency(0, { symbol: 'GHS ' });
    
    return formatCurrency(totalCents, cartItems[0]?.variant?.currency_info || { symbol: 'GHS ' });
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartTotalQuantity,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartTotalQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
};