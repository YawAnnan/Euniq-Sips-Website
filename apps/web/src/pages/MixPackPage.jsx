import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { ShoppingCart, AlertCircle, CheckCircle2, Plus, Minus } from 'lucide-react';

const FLAVOURS = [
  'Strawberry' , 'Mango' , 'Cocktail', 'Pineapple' , 'Guava' ,
  'Orange', 'Banana', 'Chocolate', 'Apple', 'Grapes'
];

const PIECES_PER_PACK = 27;
const PRICE_PER_PACK = 90;

const MixPackPage = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [numPacks, setNumPacks] = useState(1);
  const [packsData, setPacksData] = useState([{ flavours: {} }]);

  // Initialize flavours to 0
  useEffect(() => {
  setPacksData(prev =>
    Array.from({ length: numPacks }, (_, i) => {
      if (prev[i]) return prev[i];

      const initialFlavours = {};
      FLAVOURS.forEach(f => {
        initialFlavours[f] = 0;
      });

      return { flavours: initialFlavours };
    })
  );
}, [numPacks]);

  const handleFlavourChange = (packIndex, flavour, value) => {
    const numValue = parseInt(value, 10) || 0;
    if (numValue < 0) return;

    setPacksData(prev => {
      const newPacks = [...prev];
      const currentTotal = Object.entries(newPacks[packIndex].flavours)
        .filter(([f]) => f !== flavour)
        .reduce((sum, [_, qty]) => sum + qty, 0);
      
      // Prevent exceeding 27
      const allowedValue = Math.min(numValue, PIECES_PER_PACK - currentTotal);
      
      newPacks[packIndex] = {
        ...newPacks[packIndex],
        flavours: {
          ...newPacks[packIndex].flavours,
          [flavour]: allowedValue
        }
      };
      return newPacks;
    });
  };

  const getPackTotal = (packIndex) => {
    if (!packsData[packIndex]) return 0;
    return Object.values(packsData[packIndex].flavours).reduce((sum, qty) => sum + qty, 0);
  };

  const isAllValid = packsData.every((_, index) => getPackTotal(index) === PIECES_PER_PACK);

  const handleAddToCart = () => {
    if (!isAllValid) return;

    const mixPackProduct = {
      id: `mix-pack-${Date.now()}`,
      title: `Custom Mix Pack (${numPacks} ${numPacks === 1 ? 'Pack' : 'Packs'})`,
      type: 'mix_pack',
      packs: packsData,
      totalPacks: numPacks,
      price: PRICE_PER_PACK,
      image: 'https://horizons-cdn.hostinger.com/ab45d734-d1d9-4929-8778-149a5e45c679/a84a299d3000aed0ea4dbb058c188e73.png' // Using cocktail image as fallback
    };

    const mixPackVariant = {
      id: `mix-pack-var-${Date.now()}`,
      name: 'Custom Selection',
      price_in_cents: PRICE_PER_PACK * 100,
      currency_info: { symbol: 'GHS ' },
      manage_inventory: false
    };

    addToCart(mixPackProduct, mixPackVariant, numPacks, 999)
      .then(() => {
        toast({
          title: "Added to Cart",
          description: "Your custom mix pack has been added to your cart.",
        });
        // Reset form
        setNumPacks(1);
        const resetFlavours = {};
        FLAVOURS.forEach(f => resetFlavours[f] = 0);
        setPacksData([{ flavours: resetFlavours }]);
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      });
  };

  return (
    <>
      <Helmet>
        <title>Build Your Mix Pack - Euniq Sips</title>
      </Helmet>

      <div className="bg-background min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Build Your Mix Pack</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Customize your perfect box. Select exactly 27 pieces per pack from our premium flavours.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How many packs?</h3>
              <p className="text-sm text-muted-foreground">Each pack contains 27 pieces (GHS 90/pack)</p>
            </div>
            <div className="flex items-center gap-4 bg-muted p-2 rounded-xl">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setNumPacks(Math.max(1, numPacks - 1))}
                disabled={numPacks <= 1}
                className="h-10 w-10 rounded-lg"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold w-8 text-center">{numPacks}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setNumPacks(Math.min(5, numPacks + 1))}
                disabled={numPacks >= 5}
                className="h-10 w-10 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {packsData.map((pack, packIndex) => {
              const total = getPackTotal(packIndex);
              const isValid = total === PIECES_PER_PACK;
              const remaining = PIECES_PER_PACK - total;

              return (
                <motion.div 
                  key={packIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card border-2 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300 ${isValid ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-border'}`}
                >
                  <div className="flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Pack {packIndex + 1}</h2>
                      <p className="text-muted-foreground">Allocate your 27 pieces</p>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full font-medium ${isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {isValid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      <span>{total} / {PIECES_PER_PACK} Selected</span>
                      {!isValid && <span className="text-sm opacity-80 ml-2">({remaining} left)</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {FLAVOURS.map(flavour => (
                    <div
                      key={flavour}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors min-h-[150px]"
                    >
                      <span className="font-semibold text-center text-sm mb-4">
                        {flavour}
                      </span>

                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-md"
                          onClick={() =>
                            handleFlavourChange(
                              packIndex,
                              flavour,
                              (pack.flavours[flavour] || 0) - 1
                            )
                          }
                          disabled={(pack.flavours[flavour] || 0) <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="w-10 text-center font-bold text-lg">
                          {pack.flavours[flavour] || 0}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-md"
                          onClick={() =>
                            handleFlavourChange(
                              packIndex,
                              flavour,
                              (pack.flavours[flavour] || 0) + 1
                            )
                          }
                          disabled={remaining <= 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="sticky bottom-[env(safe-area-inset-bottom)] z-30 mt-8">
           <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-4 md:px-6 md:py-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary-foreground/10">
              <div>
                <p className="text-primary-foreground/80 font-medium mb-1">Total Price</p>
                <p className="text-2xl md:text-3xl font-bold">GHS {(numPacks * PRICE_PER_PACK).toFixed(2)}</p>
              </div>
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                disabled={!isAllValid}
                className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-6 text-base font-bold rounded-xl shadow-lg"              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAllValid ? 'Add to Cart' : 'Complete Selection to Add'}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MixPackPage;