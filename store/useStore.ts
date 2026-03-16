import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export type CartItem = {
  product: Product;
  variantId?: string;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shippingFee: number;
  advancePayment: number;
  dueAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    zone: 'Inside Dhaka' | 'Outside Dhaka';
  };
  createdAt: string;
};

type StoreState = {
  products: Product[];
  categories: string[];
  brands: string[];
  cart: CartItem[];
  orders: Order[];
  user: { id: string; name: string; phone: string; email: string; role: 'user' | 'admin' | 'suspect' } | null;
  isCartOpen: boolean;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setCategories: (categories: string[]) => void;
  setBrands: (brands: string[]) => void;
  
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isCartOpen: boolean) => void;
  
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  setUser: (user: StoreState['user']) => void;
};

const initialProducts: Product[] = [
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

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: initialProducts,
      categories: ['Gadgets', 'Wearables', 'Audio', 'Gaming'],
      brands: ['Aura', 'Titanium', 'GamerX'],
      cart: [],
      orders: [],
      user: null,
      isCartOpen: false,

      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),
      setCategories: (categories) => set({ categories }),
      setBrands: (brands) => set({ brands }),

      addToCart: (product, variantId, quantity = 1) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (item) => item.product.id === product.id && item.variantId === variantId
        );

        if (existingItemIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += quantity;
          return { cart: newCart };
        }

        return { cart: [...state.cart, { product, variantId, quantity }] };
      }),
      removeFromCart: (productId, variantId) => set((state) => ({
        cart: state.cart.filter((item) => !(item.product.id === productId && item.variantId === variantId)),
      })),
      updateCartQuantity: (productId, variantId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.product.id === productId && item.variantId === variantId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        ),
      })),
      clearCart: () => set({ cart: [] }),
      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      })),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'needieshop-storage',
    }
  )
);
