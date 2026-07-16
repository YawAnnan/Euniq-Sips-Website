const baseProduct = {
  price_in_cents: 9000,
  pack_size: '200ml',
  pieces_per_pack: 27,
};

const variantMapping = {
  'viva-orange': 'variant_01KVFR785EAGCJMCP8NHVGFP1M',
  'viva-guava': 'variant_01KVFR7NVV9TGNVGEAB5NTWGYD',
  'viva-mango': 'variant_01KVFR81RN9NV7QJ7E197ZARGV',
  'viva-apple': 'variant_01KVFR8CYMNP26TDPM6NWXJ33J',
  'viva-pineapple': 'variant_01KVFR8S144800BABFZPV1J83N',
  'viva-grape': 'variant_01KVFR95ND32HRKXJCB94B2R2Z',
  'viva-cocktail': 'variant_01KVFR9J721MEQJGQ7YFPZQ9N4',
  'viva-banana-milk': 'variant_01KVFR9XMYMYVRN5GTVFF37J1T',
  'viva-chocolate-milk': 'variant_01KVFRA9CWSP0ZPABP1X80S46C',
  'viva-strawberry-milk': 'variant_01KVFRA9CWSP0ZPABP1X80S46C_STRAWBERRY'
};

const createVariants = (id) => {
  return [
    {
      id: variantMapping[id],
      name: `Standard Pack (27 pcs)`,
      title: `Standard Pack (27 pcs)`,
      sku: `VIVA-${id.toUpperCase()}`,
      price: 90,
      minQuantity: 1,
      price_in_cents: 9000,
      price_formatted: 'GHS 90.00',
      currency_info: { symbol: 'GHS ' },
      inventory_quantity: 5000,
      manage_inventory: false
    }
  ];
};

export const vivaProducts = [
  {
    ...baseProduct,
    id: 'viva-orange',
    variantId: variantMapping['viva-orange'],
    title: 'Viva Orange Nectar',
    subtitle: 'Packed with vitamin C and pure sunshine.',
    description: 'Packed with vitamin C and pure sunshine. A zesty, refreshing classic that brightens up even the busiest days.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/41639b09f4762f94237695fcfae3b96f.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/41639b09f4762f94237695fcfae3b96f.png'],
    category: 'Nectars',
    variants: createVariants('viva-orange')
  },
  {
    ...baseProduct,
    id: 'viva-guava',
    variantId: variantMapping['viva-guava'],
    title: 'Viva Guava Nectar',
    subtitle: 'Lush, velvety sweetness of vine-ripened guavas.',
    description: 'Experience the lush, velvety sweetness of vine-ripened guavas. It\'s a bold, exotic retreat in every sip.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/539b9accfddf5590b002c2eb84035ec3.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/539b9accfddf5590b002c2eb84035ec3.png'],
    category: 'Nectars',
    variants: createVariants('viva-guava')
  },
  {
    ...baseProduct,
    id: 'viva-mango',
    variantId: variantMapping['viva-mango'],
    title: 'Viva Mango Nectar',
    subtitle: 'Rich, honey-like creaminess of premium mangoes.',
    description: 'Indulge in the rich, honey-like creaminess of premium mangoes. Simply pure, sunshine-infused perfection.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/222b76261528c4319405ee0a0af80334.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/222b76261528c4319405ee0a0af80334.png'],
    category: 'Nectars',
    variants: createVariants('viva-mango')
  },
  {
    ...baseProduct,
    id: 'viva-apple',
    variantId: variantMapping['viva-apple'],
    title: 'Viva Apple Juice',
    subtitle: 'Clean, crisp, and wonderfully invigorating.',
    description: 'Clean, crisp, and wonderfully invigorating. A timeless classic that delivers a burst of orchard-fresh vitality.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/d047f5ccc045640ae30e6862ee0f933b.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/d047f5ccc045640ae30e6862ee0f933b.png'],
    category: 'Juices',
    variants: createVariants('viva-apple')
  },
  {
    ...baseProduct,
    id: 'viva-pineapple',
    variantId: variantMapping['viva-pineapple'],
    title: 'Viva Pineapple Juice',
    subtitle: 'Sharp, mouth-watering sweetness of tropical pineapple.',
    description: 'Turn up the energy with the sharp, mouth-watering sweetness of tropical pineapple. A true palate cleanser.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/0a055a6cef75c8be1b233c51f3fe0a4a.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/0a055a6cef75c8be1b233c51f3fe0a4a.png'],
    category: 'Juices',
    variants: createVariants('viva-pineapple')
  },
  {
    ...baseProduct,
    id: 'viva-grape',
    variantId: variantMapping['viva-grape'],
    title: 'Viva Grape Nectar',
    subtitle: 'Sophisticated, dark, and juicy notes.',
    description: 'Savour the sophisticated, dark, and juicy notes of premium grapes. Bold flavor with a smooth finish.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/7f89ee8e61d8d62f71b39384ffeda9d3.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/7f89ee8e61d8d62f71b39384ffeda9d3.png'],
    category: 'Nectars',
    variants: createVariants('viva-grape')
  },
  {
    ...baseProduct,
    id: 'viva-cocktail',
    variantId: variantMapping['viva-cocktail'],
    title: 'Viva Cocktail Nectar',
    subtitle: 'Signature blend of secret sun-ripened fruits.',
    description: 'Can\'t decide? Enjoy our signature blend of secret sun-ripened fruits. A complex, multi-layered experience.',
    image: 'https://horizons-cdn.hostinger.com/ab45d734-d1d9-4929-8778-149a5e45c679/a84a299d3000aed0ea4dbb058c188e73.png',
    images: ['https://horizons-cdn.hostinger.com/ab45d734-d1d9-4929-8778-149a5e45c679/a84a299d3000aed0ea4dbb058c188e73.png'],
    category: 'Nectars',
    variants: createVariants('viva-cocktail')
  },
  {
    ...baseProduct,
    id: 'viva-banana-milk',
    variantId: variantMapping['viva-banana-milk'],
    title: 'Viva Banana Milk Mix',
    subtitle: 'Velvety fusion of real banana puree and silky milk.',
    description: 'A velvety fusion of real banana puree and silky milk. It\'s like a hug in a glass—perfect for your midday recharge.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/a8418ad53e17034dfe240a3a6b16792e.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/a8418ad53e17034dfe240a3a6b16792e.png'],
    category: 'Milk Mixes',
    variants: createVariants('viva-banana-milk')
  },
  {
    ...baseProduct,
    id: 'viva-chocolate-milk',
    variantId: variantMapping['viva-chocolate-milk'],
    title: 'Viva Chocolate Milk Mix',
    subtitle: 'Rich, creamy, and dangerously smooth.',
    description: 'Rich, creamy, and dangerously smooth. We\'ve combined the finest cocoa with fresh milk for the ultimate treat.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/05e9d41027538cb45cde2f6de07b3056.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/05e9d41027538cb45cde2f6de07b3056.png'],
    category: 'Milk Mixes',
    variants: createVariants('viva-chocolate-milk')
  },
  {
    ...baseProduct,
    id: 'viva-strawberry-milk',
    variantId: variantMapping['viva-strawberry-milk'],
    title: 'Viva Strawberry Milk Mix',
    subtitle: 'Sweet, sun-ripened strawberries and farm-fresh cream.',
    description: 'The perfect balance of sweet, sun-ripened strawberries and farm-fresh cream. A timeless, dreamy favourite.',
    image: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/929e8b7d62ccc3cb0abf6525472c50c9.png',
    images: ['https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/929e8b7d62ccc3cb0abf6525472c50c9.png'],
    category: 'Milk Mixes',
    variants: createVariants('viva-strawberry-milk')
  }
];