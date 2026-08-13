'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { CartItem, Product, User } from '@/types';
import { storage, calcCartTotal, calcCartCount } from '@/lib/utils';

// ===== TYPES =====
interface AppState {
  cart: CartItem[];
  cartOpen: boolean;
  user: User | null;
  isAuthLoading: boolean;
  wishlist: string[];
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

type Action =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | { type: 'SET_TOAST'; payload: AppState['toast'] };

// ===== INITIAL STATE =====
const initialState: AppState = {
  cart: [],
  cartOpen: false,
  user: null,
  isAuthLoading: false,
  wishlist: [],
  toast: null,
};

// ===== REDUCER =====
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1 } = action.payload;
      const exists = state.cart.find(item => item.product.id === product.id);
      if (exists) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { product, quantity }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.product.id !== action.payload) };
    case 'UPDATE_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter(item => item.product.id !== action.payload.productId) };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_CART':
      return { ...state, cartOpen: action.payload !== undefined ? action.payload : !state.cartOpen };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTH_LOADING':
      return { ...state, isAuthLoading: action.payload };
    case 'TOGGLE_WISHLIST': {
      const id = action.payload;
      const inWishlist = state.wishlist.includes(id);
      return { ...state, wishlist: inWishlist ? state.wishlist.filter(i => i !== id) : [...state.wishlist, id] };
    }
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    default:
      return state;
  }
}

// ===== CONTEXT =====
interface AppContextValue extends AppState {
  dispatch: React.Dispatch<Action>;
  cartTotal: number;
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ===== PROVIDER =====
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist cart to localStorage
  useEffect(() => {
    const saved = storage.get<CartItem[]>('cart');
    if (saved?.length) {
      saved.forEach(item => dispatch({ type: 'ADD_TO_CART', payload: { product: item.product, quantity: item.quantity } }));
    }
    const savedWishlist = storage.get<string[]>('wishlist');
    if (savedWishlist) {
      savedWishlist.forEach(id => dispatch({ type: 'TOGGLE_WISHLIST', payload: id }));
    }
    const savedUser = storage.get<User>('user');
    if (savedUser) dispatch({ type: 'SET_USER', payload: savedUser });
  }, []);

  useEffect(() => {
    storage.set('cart', state.cart);
  }, [state.cart]);

  useEffect(() => {
    storage.set('wishlist', state.wishlist);
  }, [state.wishlist]);

  // Auto-hide toast
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3500);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    dispatch({ type: 'TOGGLE_CART', payload: true });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'TOGGLE_CART', payload: true }), []);
  const closeCart = useCallback(() => dispatch({ type: 'TOGGLE_CART', payload: false }), []);
  const toggleWishlist = useCallback((id: string) => dispatch({ type: 'TOGGLE_WISHLIST', payload: id }), []);
  const isInWishlist = useCallback((id: string) => state.wishlist.includes(id), [state.wishlist]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { message, type } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
    storage.remove('user');
    storage.remove('auth_token');
    // Clear middleware cookies
    document.cookie = 'auth_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
    dispatch({ type: 'SET_TOAST', payload: { message: 'Logged out successfully', type: 'info' } });
  }, []);

  const value: AppContextValue = {
    ...state,
    dispatch,
    cartTotal: calcCartTotal(state.cart),
    cartCount: calcCartCount(state.cart),
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    openCart,
    closeCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ===== HOOK =====
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
