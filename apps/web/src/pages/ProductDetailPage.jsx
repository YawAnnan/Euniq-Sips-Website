import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, ArrowLeft, Package, ShieldCheck, CheckCircle2, ImageOff, ArrowRight, Tag } from 'lucide-react';
import { vivaProducts } from '@/lib/vivaData';
import { pricingTiers, calculatePrice } from '@/lib/pricingTiers';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart, cartItems, getCartTotalQuantity } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const foundProduct = vivaProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedVariant(foundProduct.variants[0]);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild>
          <Link to="/products">Return to Store</Link>
        </Button>
      </div>
    );
  }

  const minQuantity = selectedVariant?.minQuantity || 1;
  const hasCartItems = cartItems.length > 0;

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setQuantity(val);
    }
  };

  const handleBlur = () => {
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (quantity < variant.minQuantity) {
      setQuantity(variant.minQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
      return;
    }

    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      
      const newTotalQty = getCartTotalQuantity() + quantity;
      const { tierName, unitPrice } = calculatePrice(newTotalQty);

      toast({
        title: "Added to cart",
        description: `Current tier: ${tierName} at GH₵${unitPrice}/pack.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding to cart",
        description: error.message,
      });
    }
  };

  const handleProceedToCart = () => {
    navigate('/cart');
  };

  const imgSrc = product.image || (product.images && product.images[0]);
  
  // Calculate projected tier based on what they're adding + what's in cart
  const projectedTotalQty = getCartTotalQuantity() + quantity;
  const projectedPricing = calculatePrice(projectedTotalQty);

  return (
    <>
      <Helmet>
        <title>{product.title} - Viva Sips Collection</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="bg-background py-8 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium">
            <ArrowLeft size={16} />
            Back to Collection
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Image Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="lg:col-span-5 relative"
            >
              <div className="bg-white rounded-3xl border border-border p-8 flex items-center justify-center shadow-sm aspect-square relative sticky top-24">
                <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-sm z-10">
                  {product.category}
                </div>
                {!imgError && imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.title}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 w-full h-full">
                    <ImageOff className="w-12 h-12 opacity-30 mb-4" />
                    <span className="text-sm font-medium opacity-60">Image not available</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }} 
              className="lg:col-span-7 flex flex-col"
            >
              <div className="mb-6 border-b border-border pb-6">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight text-balance">{product.title}</h1>
                <p className="text-xl text-muted-foreground font-medium">{product.subtitle}</p>
              </div>

              <div className="mb-8">
                <p className="text-foreground text-lg leading-relaxed max-w-[65ch]">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                   <div className="bg-muted/40 rounded-2xl p-5 border border-border/50 flex items-start gap-3">
                     <Package className="w-6 h-6 text-primary shrink-0" />
                     <div>
                       <p className="font-semibold text-foreground">Pack Details</p>
                       <p className="text-sm text-muted-foreground mt-1">{product.pieces_per_pack} pieces ({product.pack_size})</p>
                     </div>
                   </div>
                   <div className="bg-muted/40 rounded-2xl p-5 border border-border/50 flex items-start gap-3">
                     <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                     <div>
                       <p className="font-semibold text-foreground">Quality</p>
                       <p className="text-sm text-muted-foreground mt-1">Premium Ingredients</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Volume Pricing Tiers Table */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Volume Pricing Tiers
                </h3>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-3 bg-muted/50 p-4 border-b border-border text-sm font-semibold text-foreground">
                    <div>Tier</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Price per Pack</div>
                  </div>
                  <div className="divide-y border-border">
                    {pricingTiers.map((tier, idx) => (
                      <div key={idx} className={`grid grid-cols-3 p-4 text-sm items-center transition-colors ${projectedPricing.tierName === tier.name ? 'bg-primary/5 font-small text-primary' : 'text-muted-foreground hover:bg-muted/20'}`}>
                        <div>{tier.name}</div>
                        <div className="text-center">{tier.description}</div>
                        <div className="text-right font-bold">GH₵{tier.unitPrice.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  * Pricing is automatically applied based on total packs in your cart across all flavors.
                </p>
              </div>

              {/* Add to Cart Actions */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-md mt-auto">
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Select Flavor Variant</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <div 
                          key={variant.id}
                          onClick={() => handleVariantSelect(variant)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:border-primary/30'
                          } flex justify-between items-center`}
                        >
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{variant.name}</h4>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm font-medium text-foreground mb-2">Quantity to Add</label>
                    <div className="flex">
                      <input
                        type="number"
                        min={minQuantity}
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={handleBlur}
                        className="w-full sm:w-32 h-14 text-center border-2 border-border rounded-xl bg-background font-bold text-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex-grow w-full">
                     <Button 
                        onClick={handleAddToCart} 
                        size="lg" 
                        className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold shadow-md rounded-xl active:scale-[0.98] transition-transform"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" /> 
                        Add to Cart
                        <span className="ml-2 px-2 py-0.5 bg-background/20 rounded text-sm font-medium">
                          GH₵{projectedPricing.unitPrice}/pk
                        </span>
                      </Button>
                  </div>
                </div>

                {hasCartItems && (
                  <Button 
                    variant="outline"
                    onClick={handleProceedToCart} 
                    size="lg" 
                    className="w-full h-14 text-foreground text-lg font-semibold rounded-xl border-2 hover:bg-muted active:scale-[0.98] transition-all mt-4"
                  >
                    View Cart & Checkout <ArrowRight className="ml-2 h-5 w-5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;