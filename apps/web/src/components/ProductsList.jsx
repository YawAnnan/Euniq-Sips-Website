import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ImageOff } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { vivaProducts } from '@/lib/vivaData';

const getProductImageUrl = (product) => {
  if (product.image) return product.image;
  if (product.imageUrl) return product.imageUrl;
  if (product.images && product.images.length > 0) {
    return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
  }
  return null;
};

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const imgSrc = getProductImageUrl(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm product-card-hover group h-full flex flex-col">
          <div className="relative product-image-container h-72 overflow-hidden rounded-t-xl bg-muted flex items-center justify-center p-4">            {!imgError && imgSrc ? (
              <img
                src={imgSrc}
                alt={product.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <ImageOff className="w-8 h-8 opacity-40 mb-2" />
                <span className="text-xs opacity-60">Image unavailable</span>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-[hsl(var(--retail-badge,220_100%_50%))] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </div>
            <div className="absolute top-3 right-3 bg-[hsl(var(--wholesale-badge,150_100%_30%))] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Package className="w-3 h-3" />
              {product.pieces_per_pack || 27} pcs
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{product.subtitle}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                <span className="text-sm font-medium">Retail</span>
                <span className="font-bold text-primary">GHS 90.00</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-xs text-muted-foreground">Wholesale (Begins at 50+ packs)</span>
                <span className="text-sm font-semibold"> Tiered Bulk Pricing </span>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto">
              Select Option
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsList = ({ limit }) => {
  const displayProducts = limit ? vivaProducts.slice(0, limit) : vivaProducts;

  if (displayProducts.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {displayProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;