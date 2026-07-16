export const pricingTiers = [
  { min: 0, max: 49, name: 'Retail', unitPrice: 90, description: '1-49 packs' },
  { min: 50, max: 199, name: 'Wholesale Tier 1', unitPrice: 88, description: '50-199 packs' },
  { min: 200, max: 499, name: 'Wholesale Tier 2', unitPrice: 87, description: '200-499 packs' },
  { min: 500, max: 999, name: 'Wholesale Tier 3', unitPrice: 85, description: '500-999 packs' },
  { min: 1000, max: Infinity, name: 'Wholesale Tier 4', unitPrice: 83, description: '1000+ packs' }
];

export const calculatePrice = (quantity) => {
  const safeQty = Math.max(0, quantity || 0);
  const tier = pricingTiers.find(t => safeQty >= t.min && safeQty <= t.max) || pricingTiers[pricingTiers.length - 1];
  const nextTier = pricingTiers.find(t => t.min > safeQty) || null;
  
  return {
    unitPrice: tier.unitPrice,
    tierName: tier.name,
    tierDescription: tier.description,
    nextTier
  };
};

export const getTotalPrice = (quantity, unitPrice) => {
  return Math.max(0, quantity || 0) * (unitPrice || 0);
};