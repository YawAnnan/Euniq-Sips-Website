import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Package, Info, ImageOff } from 'lucide-react';
import { vivaProducts } from '@/lib/vivaData';

const getProductImageUrl = (product) => {
  if (product.image) return product.image;
  if (product.imageUrl) return product.imageUrl;
  if (product.images && product.images.length > 0) {
    return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
  }
  return null;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const imgSrc = getProductImageUrl(product);

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm product-card-hover group h-full flex flex-col">
        <div className="relative product-image-container h-72 overflow-hidden rounded-t-xl bg-muted flex items-center justify-center p-4">          {!imgError && imgSrc ? (
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
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{product.subtitle}</p>
          
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium">Retail</span>
              <span className="font-bold text-primary">GHS 90</span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-xs text-muted-foreground">Wholesale</span>
              <span className="text-sm font-semibold text-primary">
                Tiered Bulk Pricing  </span>
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto">
            View Options
          </Button>
        </div>
      </div>
    </Link>
  );
};

const ProductsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Nectars', 'Juices', 'Milk Mixes'];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...vivaProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep default order
        break;
    }

    return filtered;
  }, [selectedCategories, sortBy]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <Helmet>
        <title>Viva Sips Collection - Euniq Sips</title>
        <meta name="description" content="Browse our complete collection of premium Viva beverages including Nectars, Juices, and Milk Mixes." />
      </Helmet>

      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">The Viva Collection</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Exquisite varieties. Crafted for retail excellence and wholesale value.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Pricing Info Banner */}
        <div className="bg-muted border border-border rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-primary rounded-full p-2 text-primary-foreground shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Pricing Structure</h3>
            <p className="text-sm text-muted-foreground">
              Retail: <strong className="text-foreground">GHS 90</strong> / pack (under 50 packs) •{" "}
              Wholesale Tier 1: <strong className="text-foreground">GHS 88</strong> / pack (50–199 packs) •{" "}
              Wholesale Tier 2: <strong className="text-foreground">GHS 87</strong> / pack (200–499 packs) •{" "}
              Wholesale Tier 3: <strong className="text-foreground">GHS 85</strong> / pack (500–999 packs) •{" "}
              Wholesale Tier 4: <strong className="text-foreground">GHS 83</strong> / pack (1,000+ packs).{" "}
              All packs contain 27 pieces (200ml).
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <div className="ml-auto flex items-center gap-4">
            <Label htmlFor="sort" className="text-sm font-medium">Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Featured</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Product Type</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category} className="flex items-center gap-3">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <Package className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="font-semibold mb-2">Bulk Orders?</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Enjoy our tiered wholesale pricing, starting at GHS 88 per pack for orders of 50 packs and above, with even better rates as your order volume increases.
              </p>
              <Button className="w-full bg-background text-foreground hover:bg-muted" size="sm">
                Contact Sales
              </Button>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <p className="text-muted-foreground mb-4 text-lg">No products match your filters</p>
                <Button
                  onClick={() => setSelectedCategories([])}
                  variant="outline"
                  className="border-primary text-primary"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="h-full"
                  >
                     <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;