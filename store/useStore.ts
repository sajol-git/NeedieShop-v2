import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProducts, type Product } from '@/lib/products';

export type { Product };

export type CartItem = {
  product: Product;
  variantId?: string;
  quantity: number;
};

export type OrderStatusUpdate = {
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  message: string;
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
  trackingNumber?: string;
  trackingHistory: OrderStatusUpdate[];
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
  offerBanners: string[];
  copyrightText: string;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setCategories: (categories: string[]) => void;
  setBrands: (brands: string[]) => void;
  setOfferBanners: (banners: string[]) => void;
  setCopyrightText: (text: string) => void;
  
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isCartOpen: boolean) => void;
  
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  setUser: (user: StoreState['user']) => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: initialProducts,
      categories: ['Gadgets', 'Wearables', 'Audio', 'Gaming'],
      brands: ['Aura', 'Titanium', 'GamerX'],
      cart: [],
      orders: [
        {
          id: 'ORD-1710632400000',
          items: [
            {
              product: initialProducts[0],
              quantity: 1,
            }
          ],
          total: 125060,
          subtotal: 125000,
          shippingFee: 60,
          advancePayment: 0,
          dueAmount: 125060,
          status: 'Shipped',
          customerInfo: {
            name: 'Demo User',
            phone: '01712345678',
            address: 'House 1, Road 1, Dhanmondi, Dhaka',
            zone: 'Inside Dhaka',
          },
          trackingHistory: [
            { status: 'Pending', date: '2026-03-15T10:00:00Z', message: 'Order placed successfully.' },
            { status: 'Processing', date: '2026-03-15T14:00:00Z', message: 'Our team is preparing your order.' },
            { status: 'Shipped', date: '2026-03-16T09:00:00Z', message: 'Your order has been handed over to the courier.' },
          ],
          createdAt: '2026-03-15T10:00:00Z',
        },
        {
          id: 'ORD-1710546000000',
          items: [
            {
              product: initialProducts[1],
              quantity: 2,
            }
          ],
          total: 17120,
          subtotal: 17000,
          shippingFee: 120,
          advancePayment: 0,
          dueAmount: 17120,
          status: 'Delivered',
          customerInfo: {
            name: 'Demo User',
            phone: '01712345678',
            address: 'House 1, Road 1, Dhanmondi, Dhaka',
            zone: 'Inside Dhaka',
          },
          trackingHistory: [
            { status: 'Pending', date: '2026-03-14T08:00:00Z', message: 'Order placed successfully.' },
            { status: 'Processing', date: '2026-03-14T11:00:00Z', message: 'Our team is preparing your order.' },
            { status: 'Shipped', date: '2026-03-14T16:00:00Z', message: 'Your order has been handed over to the courier.' },
            { status: 'Delivered', date: '2026-03-15T12:00:00Z', message: 'Order delivered successfully.' },
          ],
          createdAt: '2026-03-14T08:00:00Z',
        }
      ],
      user: {
        id: 'user-1',
        name: 'Demo User',
        phone: '01712345678',
        email: 'demo@example.com',
        role: 'user'
      },
      isCartOpen: false,
      offerBanners: [],
      copyrightText: '© 2026 NeedieShop. All rights reserved.',

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
      setOfferBanners: (offerBanners) => set({ offerBanners }),
      setCopyrightText: (copyrightText) => set({ copyrightText }),

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
        orders: state.orders.map((o) => {
          if (o.id === id) {
            const messages = {
              Pending: 'Order placed successfully.',
              Processing: 'Our team is preparing your order.',
              Shipped: 'Your order has been handed over to the courier.',
              Delivered: 'Order delivered successfully.',
              Cancelled: 'Order has been cancelled.',
            };
            return {
              ...o,
              status,
              trackingHistory: [
                ...o.trackingHistory,
                {
                  status,
                  date: new Date().toISOString(),
                  message: messages[status],
                },
              ],
            };
          }
          return o;
        }),
      })),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'needieshop-storage',
    }
  )
);
