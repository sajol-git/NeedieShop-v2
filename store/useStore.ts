import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from '@/lib/products';

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
  initialized: boolean;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setCategories: (categories: Category[]) => void;
  setBrands: (brands: Brand[]) => void;
  setOfferBanners: (banners: string[]) => void;
  setCopyrightText: (text: string) => Promise<void>;
  setHeroBanners: (banners: StoreState['heroBanners']) => void;
  setFooterContent: (content: StoreState['footerContent']) => Promise<void>;
  
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isCartOpen: boolean) => void;
  
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
      initialized: false,

      setProducts: (products) => set({ products }),
      addProduct: async (product) => {
        const { db } = await import('@/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'products', product.id), {
          ...product,
          createdAt: new Date().toISOString()
        });
      },
      setOrders: (orders) => set({ orders }),
      addOrder: async (order) => {
        const { db } = await import('@/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'orders', order.id), {
          ...order,
          createdAt: new Date().toISOString()
        });
      },
      updateOrderStatus: async (id, status) => {
        const { db } = await import('@/firebase');
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
        
        const messages = {
          Pending: 'Order placed successfully.',
          Processing: 'Our team is preparing your order.',
          Shipped: 'Your order has been handed over to the courier.',
          Delivered: 'Order delivered successfully.',
          Cancelled: 'Order has been cancelled.',
        };

        await updateDoc(doc(db, 'orders', id), {
          status,
          trackingHistory: arrayUnion({
            status,
            date: new Date().toISOString(),
            message: messages[status],
          })
        });
      },
      updateProduct: async (id, updates) => {
        const { db } = await import('@/firebase');
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'products', id), updates);
      },
      deleteProduct: async (id) => {
        const { db } = await import('@/firebase');
        const { doc, deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'products', id));
      },
      setCategories: (categories) => set({ categories }),
      setBrands: (brands) => set({ brands }),
      setOfferBanners: (offerBanners) => set({ offerBanners }),
      setCopyrightText: async (copyrightText) => {
        const { db } = await import('@/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'settings', 'copyright_text'), { key: 'copyright_text', value: copyrightText }, { merge: true });
      },
      setHeroBanners: (heroBanners) => set({ heroBanners }),
      setFooterContent: async (footerContent) => {
        const { db } = await import('@/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'settings', 'footer_content'), { key: 'footer_content', value: footerContent }, { merge: true });
      },

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

      setUser: (user) => set({ user }),

      init: async () => {
        const { initialized } = useStore.getState();
        if (initialized) return;
        set({ initialized: true });

        const { db, auth } = await import('@/firebase');
        const { onSnapshot, collection, query, orderBy, doc, getDoc, setDoc } = await import('firebase/firestore');
        const { onAuthStateChanged } = await import('firebase/auth');

        // Auth Listener
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              set({ user: userDoc.data() as StoreState['user'] });
            } else {
              // Create user doc if it doesn't exist
              const newUser: StoreState['user'] = {
                id: user.uid,
                name: user.displayName || '',
                phone: '',
                email: user.email || '',
                role: user.email === 'shadikulislamsajol@gmail.com' ? 'admin' : 'user',
                isProfileCompleted: false,
                isEmailVerified: user.emailVerified,
                isPhoneVerified: false,
                registrationDate: new Date().toISOString(),
              };
              await setDoc(doc(db, 'users', user.uid), newUser);
              set({ user: newUser });
            }
          } else {
            set({ user: null });
          }
        });

        // Products Listener
        onSnapshot(collection(db, 'products'), (snapshot) => {
          const products = snapshot.docs.map(doc => doc.data() as Product);
          set({ products });
        });

        // Categories Listener
        onSnapshot(collection(db, 'categories'), (snapshot) => {
          const categories = snapshot.docs.map(doc => doc.data() as Category);
          set({ categories });
        });

        // Brands Listener
        onSnapshot(collection(db, 'brands'), (snapshot) => {
          const brands = snapshot.docs.map(doc => doc.data() as Brand);
          set({ brands });
        });

        // Orders Listener
        onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
          const orders = snapshot.docs.map(doc => doc.data() as Order);
          set({ orders });
        });

        // Settings Listener
        onSnapshot(collection(db, 'settings'), (snapshot) => {
          const settings = snapshot.docs.map(doc => doc.data());
          const footer = settings.find(s => s.key === 'footer_content')?.value;
          const copyright = settings.find(s => s.key === 'copyright_text')?.value;
          const hero = settings.find(s => s.key === 'hero_banners')?.value;
          const offer = settings.find(s => s.key === 'offer_banners')?.value;
          if (footer) set({ footerContent: footer });
          if (copyright) set({ copyrightText: copyright });
          if (hero) set({ heroBanners: hero });
          if (offer) set({ offerBanners: offer });
        });
      }
    }),
    {
      name: 'needieshop-storage',
    }
  )
);
