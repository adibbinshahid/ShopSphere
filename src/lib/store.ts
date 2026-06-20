'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: get().items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) });
        }
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'shopsphere-cart' }
  )
);

interface AdminStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

import { products as initialProducts } from './products';

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      addProduct: (product) => set({ products: [...get().products, product] }),
      updateProduct: (id, data) => set({ products: get().products.map((p) => p.id === id ? { ...p, ...data } : p) }),
      deleteProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
    }),
    { name: 'shopsphere-admin' }
  )
);

export interface CarouselItem {
  id: number;
  image: string;
  label?: string;
  badge?: string;
}

const defaultCarouselItems: CarouselItem[] = [
  { id: 1, image: '/Hero1.png', label: 'New Arrival', badge: 'New' },
  { id: 2, image: '/Hero2.png', label: 'Trending Now', badge: 'Trending' },
  { id: 3, image: '/Hero3.png', label: 'Bestseller', badge: 'Bestseller' },
  { id: 4, image: '/Hero4.png', label: 'Hot Deal', badge: 'Sale' },
  { id: 5, image: '/Hero5.png', label: 'Featured Pick', badge: 'Hot' },
];

interface CarouselStore {
  items: CarouselItem[];
  interval: number;
  addItem: (item: CarouselItem) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, data: Partial<CarouselItem>) => void;
  reorderItems: (items: CarouselItem[]) => void;
  setInterval: (ms: number) => void;
}

export const useCarouselStore = create<CarouselStore>()(
  persist(
    (set, get) => ({
      items: defaultCarouselItems,
      interval: 1000,
      addItem: (item) => set({ items: [...get().items, item] }),
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateItem: (id, data) => set({ items: get().items.map(i => i.id === id ? { ...i, ...data } : i) }),
      reorderItems: (items) => set({ items }),
      setInterval: (ms) => set({ interval: ms }),
    }),
    { name: 'shopsphere-carousel', version: 4 }
  )
);

// ─── Cart Animation Store ────────────────────────────────────────────────────
interface CartAnimStore {
  fly: { id: number; x: number; y: number; image: string } | null;
  toast: { name: string; image: string; price: number } | null;
  trigger: (x: number, y: number, image: string, name: string, price: number) => void;
  clearFly: () => void;
  clearToast: () => void;
}
export const useCartAnimStore = create<CartAnimStore>()((set) => ({
  fly: null,
  toast: null,
  trigger: (x, y, image, name, price) =>
    set({ fly: { id: Date.now(), x, y, image }, toast: { name, image, price } }),
  clearFly: () => set({ fly: null }),
  clearToast: () => set({ toast: null }),
}));

// ─── Customer User Store ────────────────────────────────────────────────────
export interface UserOrder {
  id: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Cancelled';
  items: { name: string; qty: number; price: number; image: string }[];
  total: number;
  eta?: string;
}

export interface SavedCard {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface UserCoupon {
  code: string;
  desc: string;
  discount: string;
  expires: string;
  used: boolean;
}

export interface CustomerUser {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
  address: string;
}

interface UserStore {
  isLoggedIn: boolean;
  user: CustomerUser | null;
  orders: UserOrder[];
  cards: SavedCard[];
  coupons: UserCoupon[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const DUMMY_USER: CustomerUser = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+1 (555) 012-3456',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  memberSince: 'January 2024',
  tier: 'Gold',
  points: 2450,
  address: '42 Maple Street, Apt 3B, New York, NY 10001',
};

const DUMMY_ORDERS: UserOrder[] = [
  {
    id: 'SS-10042', date: 'Jun 18, 2026', status: 'In Transit', eta: 'Jun 23, 2026',
    total: 89.99,
    items: [{ name: 'AirPods Pro Wireless Headphones', qty: 1, price: 89.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' }],
  },
  {
    id: 'SS-10093', date: 'Jun 21, 2026', status: 'Processing', eta: 'Jun 26, 2026',
    total: 124.98,
    items: [
      { name: 'Yoga Mat Premium', qty: 1, price: 54.99, image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=100&h=100&fit=crop' },
      { name: 'Pro Gym Duffle Bag', qty: 1, price: 69.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' },
    ],
  },
  {
    id: 'SS-10078', date: 'Jun 14, 2026', status: 'Delivered',
    total: 199.99,
    items: [{ name: 'Smart Watch Series X', qty: 1, price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' }],
  },
  {
    id: 'SS-10031', date: 'May 28, 2026', status: 'Delivered',
    total: 169.98,
    items: [
      { name: 'Vitamin C Serum', qty: 2, price: 39.99, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop' },
      { name: 'Matte Lipstick Collection', qty: 1, price: 24.99, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop' },
      { name: 'Wireless Charging Pad', qty: 1, price: 34.99, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop' },
    ],
  },
  {
    id: 'SS-09987', date: 'Apr 10, 2026', status: 'Delivered',
    total: 349.99,
    items: [{ name: 'Modern Accent Chair', qty: 1, price: 349.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop' }],
  },
  {
    id: 'SS-09801', date: 'Mar 3, 2026', status: 'Cancelled',
    total: 129.99,
    items: [{ name: 'Minimalist Leather Sneakers', qty: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' }],
  },
];

const DUMMY_CARDS: SavedCard[] = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '09/28', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '8888', expiry: '03/27', isDefault: false },
];

const DUMMY_COUPONS: UserCoupon[] = [
  { code: 'GOLD20', desc: '20% off for Gold members', discount: '20% OFF', expires: 'Jul 31, 2026', used: false },
  { code: 'FREESHIP', desc: 'Free shipping on any order', discount: 'FREE SHIP', expires: 'Aug 15, 2026', used: false },
  { code: 'BIRTHDAY15', desc: 'Happy birthday! 15% off', discount: '15% OFF', expires: 'Jul 5, 2026', used: false },
  { code: 'SUMMER10', desc: 'Summer sale extra discount', discount: '10% OFF', expires: 'Jun 30, 2026', used: true },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      orders: DUMMY_ORDERS,
      cards: DUMMY_CARDS,
      coupons: DUMMY_COUPONS,
      login: (email, pass) => {
        if (email === 'alex@example.com' && pass === 'demo123') {
          set({ isLoggedIn: true, user: DUMMY_USER });
          return true;
        }
        return false;
      },
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    { name: 'shopsphere-user', partialize: (s) => ({ isLoggedIn: s.isLoggedIn, user: s.user }) }
  )
);

// ─── Admin Auth Store ────────────────────────────────────────────────────────
interface AuthStore {
  isAuthenticated: boolean;
  pinPending: boolean;
  pinCallback: (() => void) | null;
  login: (user: string, pass: string) => boolean;
  verifyPin: (pin: string) => boolean;
  requestPin: (cb: () => void) => void;
  cancelPin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      pinPending: false,
      pinCallback: null,
      login: (user, pass) => {
        if (user === 'admin' && pass === 'admin') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      verifyPin: (pin) => {
        if (pin === '2342') {
          const cb = get().pinCallback;
          set({ pinPending: false, pinCallback: null });
          cb?.();
          return true;
        }
        return false;
      },
      requestPin: (cb) => set({ pinPending: true, pinCallback: cb }),
      cancelPin: () => set({ pinPending: false, pinCallback: null }),
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: 'shopsphere-auth', partialize: (s) => ({ isAuthenticated: s.isAuthenticated }) }
  )
);
