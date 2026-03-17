export type Product = {
  id: string;
  name: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  variants: { id: string; name: string; price: number; stock: number }[];
  specifications: { name: string; value: string }[];
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEndTime?: string;
  relatedProducts: string[];
};

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Aura Pro Max Wireless Earbuds',
    description: 'Experience premium sound with active noise cancellation and 40-hour battery life.',
    price: 4500,
    compareAtPrice: 5500,
    images: ['https://picsum.photos/seed/earbuds1/800/800', 'https://picsum.photos/seed/earbuds2/800/800'],
    category: 'Audio',
    brand: 'Aura',
    stock: 50,
    variants: [
      { id: 'v1', name: 'Midnight Black', price: 4500, stock: 25 },
      { id: 'v2', name: 'Frost White', price: 4500, stock: 25 },
    ],
    specifications: [
      { name: 'Bluetooth', value: '5.3' },
      { name: 'Battery Life', value: 'Up to 40 hours' },
      { name: 'ANC', value: 'Yes, up to 40dB' },
    ],
    isFeatured: true,
    isFlashSale: true,
    flashSaleEndTime: new Date(Date.now() + 86400000).toISOString(),
    relatedProducts: ['p2', 'p3'],
  },
  {
    id: 'p2',
    name: 'Titanium Smartwatch Series X',
    description: 'Track your fitness, heart rate, and notifications with this sleek titanium smartwatch.',
    price: 8900,
    images: ['https://picsum.photos/seed/watch1/800/800'],
    category: 'Wearables',
    brand: 'Titanium',
    stock: 15,
    variants: [],
    specifications: [
      { name: 'Display', value: '1.43" AMOLED' },
      { name: 'Water Resistance', value: '5ATM' },
      { name: 'Battery', value: '14 Days' },
    ],
    isFeatured: true,
    isFlashSale: false,
    relatedProducts: ['p1'],
  },
  {
    id: 'p3',
    name: 'GamerX Mechanical Keyboard',
    description: 'RGB mechanical keyboard with custom tactile switches for the ultimate gaming experience.',
    price: 3200,
    compareAtPrice: 4000,
    images: ['https://picsum.photos/seed/keyboard1/800/800'],
    category: 'Gaming',
    brand: 'GamerX',
    stock: 100,
    variants: [
      { id: 'v3', name: 'Blue Switches', price: 3200, stock: 50 },
      { id: 'v4', name: 'Red Switches', price: 3200, stock: 50 },
    ],
    specifications: [
      { name: 'Switches', value: 'Custom Tactile' },
      { name: 'Backlight', value: 'RGB 16.8M Colors' },
      { name: 'Connectivity', value: 'Wired USB-C' },
    ],
    isFeatured: false,
    isFlashSale: false,
    relatedProducts: [],
  }
];

export async function getProducts() {
  // In a real app, this would fetch from a database.
  // For now, we return the initial products.
  return initialProducts;
}

export async function getProductById(id: string) {
  return initialProducts.find(p => p.id === id);
}
