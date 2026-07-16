import React from 'react';

const MixPackOrderSummary = ({ item }) => {
  if (!item || !item.product || item.product.type !== 'mix_pack') return null;

  const { packs } = item.product;

  return (
    <div className="text-sm text-muted-foreground mt-1 space-y-1">
      {packs.map((pack, index) => {
        const flavoursList = Object.entries(pack.flavours)
          .filter(([_, quantity]) => quantity > 0)
          .map(([flavour, quantity]) => `${quantity}x ${flavour}`)
          .join(', ');

        return (
          <div key={index} className="pl-2 border-l-2 border-secondary/50">
            <span className="font-medium text-foreground/80">Pack {index + 1}:</span> {flavoursList}
          </div>
        );
      })}
    </div>
  );
};

export default MixPackOrderSummary;