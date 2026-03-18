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
    ipAddress?: string;
  };
  trackingNumber?: string;
  trackingHistory: OrderStatusUpdate[];
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  photo?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  photo?: string;
};

type StoreState = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  cart: CartItem[];
  orders: Order[];
  user: { 
    id: string; 
    name: string; 
    phone: string; 
    email: string; 
    role: 'user' | 'admin' | 'suspect'; 
    isProfileCompleted: boolean; 
    isEmailVerified: boolean; 
    isPhoneVerified: boolean;
    registrationDate: string;
    ipAddress?: string;
  } | null;
  isCartOpen: boolean;
  offerBanners: string[];
  copyrightText: string;
  heroBanners: { id: number; title: string; image: string; link: string; status: 'Active' | 'Inactive' }[];
  footerContent: {
    address: string;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setCategories: (categories: Category[]) => void;
  setBrands: (brands: Brand[]) => void;
  setOfferBanners: (banners: string[]) => void;
  setCopyrightText: (text: string) => void;
  setHeroBanners: (banners: StoreState['heroBanners']) => void;
  setFooterContent: (content: StoreState['footerContent']) => void;
  
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isCartOpen: boolean) => void;
  
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  setUser: (user: StoreState['user']) => void;
  init: () => Promise<void>;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: [],
      categories: [],
      brands: [],
      cart: [],
      orders: [],
      user: null,
      isCartOpen: false,
      offerBanners: [],
      copyrightText: '',
      heroBanners: [],
      footerContent: {
        address: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        youtube: '',
      },

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
      setHeroBanners: (heroBanners) => set({ heroBanners }),
      setFooterContent: (footerContent) => set({ footerContent }),

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

      init: async () => {
        const { supabase } = await import('@/lib/supabase');
        
        // Fetch Categories
        const { data: categories } = await supabase.from('categories').select('*');
        if (categories) set({ categories });

        // Fetch Brands
        const { data: brands } = await supabase.from('brands').select('*');
        if (brands) set({ brands });

        // Fetch Products
        const { getProducts } = await import('@/lib/products');
        const products = await getProducts();
        set({ products });

        // Fetch Banners
        const { data: banners } = await supabase.from('banners').select('*').eq('status', 'Active');
        if (banners) {
          set({ 
            heroBanners: banners.filter(b => b.type === 'hero'),
            offerBanners: banners.filter(b => b.type === 'offer').map(b => b.image)
          });
        }

        // Fetch Settings
        const { data: settings } = await supabase.from('settings').select('*');
        if (settings) {
          const footer = settings.find(s => s.key === 'footer_content')?.value;
          const copyright = settings.find(s => s.key === 'copyright_text')?.value;
          if (footer) set({ footerContent: footer });
          if (copyright) set({ copyrightText: copyright });
        }
      }
    }),
    {
      name: 'needieshop-storage',
    }
  )
);
