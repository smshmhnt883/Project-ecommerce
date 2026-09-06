'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Product, CartItem, Coupon } from '@/types';
import { validateAndApplyCoupon } from '@/lib/data/coupons';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { insforge } from '@/lib/insforge';
import {
  getCartStorageKey,
  getCouponStorageKey,
  clearGuestCartStorage,
  clearAllLegacyStorage,
  fetchRemoteCart,
  reconcileGuestCartWithRemote,
} from '@/services/cart';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 50;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Track previous user to detect logins, logouts, and account switches
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  // Load initial cart from client-side storage on mount
  useEffect(() => {
    try {
      clearAllLegacyStorage();
      const currentUserId = isAuthenticated && user?.id ? user.id : null;
      const cartKey = getCartStorageKey(currentUserId);
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const couponKey = getCouponStorageKey(currentUserId);
      const savedCoupon = localStorage.getItem(couponKey);
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setAppliedCoupon(parsed.coupon);
        setCouponDiscount(parsed.discount);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync user cart helper
  const syncUserCart = useCallback(async (userId: string, allowGuestReconcile: boolean) => {
    try {
      let guestItems: CartItem[] = [];
      if (allowGuestReconcile) {
        try {
          const guestJson = localStorage.getItem(getCartStorageKey(null));
          if (guestJson) {
            guestItems = JSON.parse(guestJson);
          }
        } catch (e) {
          console.warn('Error reading guest cart for reconcile:', e);
        }
      }

      let mergedItems: CartItem[] = [];
      if (guestItems.length > 0) {
        mergedItems = await reconcileGuestCartWithRemote(userId, guestItems);
        clearGuestCartStorage();
      } else {
        mergedItems = await fetchRemoteCart(userId);
      }

      setCart(mergedItems);
      try {
        localStorage.setItem(getCartStorageKey(userId), JSON.stringify(mergedItems));
      } catch {}
    } catch (err) {
      console.warn('Failed to sync user cart:', err);
    }
  }, []);

  // Handle auth transitions: Log In, Log Out, Account Switch
  useEffect(() => {
    if (!isInitialized) return;

    const currentUserId = isAuthenticated && user?.id ? user.id : null;

    // First time auth state resolves after mount
    if (previousUserIdRef.current === undefined) {
      previousUserIdRef.current = currentUserId;
      if (currentUserId) {
        syncUserCart(currentUserId, true);
      }
      return;
    }

    const prevUserId = previousUserIdRef.current;
    previousUserIdRef.current = currentUserId;

    // 1. LOGOUT: user was logged in, now logged out
    if (prevUserId && !currentUserId) {
      setCart([]);
      setAppliedCoupon(null);
      setCouponDiscount(0);
      clearGuestCartStorage();
      return;
    }

    // 2. ACCOUNT SWITCH: from User A directly to User B
    if (prevUserId && currentUserId && prevUserId !== currentUserId) {
      setCart([]);
      setAppliedCoupon(null);
      setCouponDiscount(0);
      // Load User B's cart without merging User A's items
      syncUserCart(currentUserId, false);
      return;
    }

    // 3. GUEST LOGIN: from guest (null) to logged in (currentUserId)
    if (!prevUserId && currentUserId) {
      syncUserCart(currentUserId, true);
      return;
    }
  }, [isAuthenticated, user?.id, isInitialized, syncUserCart]);

  // Listen to explicit auth:logout event across all tabs / handlers
  useEffect(() => {
    const handleLogoutEvent = () => {
      setCart([]);
      setAppliedCoupon(null);
      setCouponDiscount(0);
      clearGuestCartStorage();
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);

  // Save cart locally with user-scoped key
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const currentUserId = isAuthenticated && user?.id ? user.id : null;
      const key = getCartStorageKey(currentUserId);
      localStorage.setItem(key, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart, isInitialized, isAuthenticated, user?.id]);

  // Recalculate coupon discount if cart changes
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const rawDeliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const deliveryFee = appliedCoupon?.discountType === 'free_shipping' ? 0 : rawDeliveryFee;

  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      const result = validateAndApplyCoupon(appliedCoupon.code, subtotal, rawDeliveryFee);
      if (result.isValid) {
        setCouponDiscount(result.discountAmount);
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        const currentUserId = isAuthenticated && user?.id ? user.id : null;
        try {
          localStorage.removeItem(getCouponStorageKey(currentUserId));
        } catch {}
      }
    } else if (subtotal === 0) {
      setCouponDiscount(0);
    }
  }, [subtotal, appliedCoupon, rawDeliveryFee, isAuthenticated, user?.id]);

  const total = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const size = selectedSize || product.size;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedSize === size);
      if (existing) {
        const updatedQty = existing.quantity + quantity;
        if (isAuthenticated && user?.id) {
          insforge.database.from('cart_items').upsert({
            user_id: user.id,
            product_id: product.id,
            quantity: updatedQty,
            selected_size: size,
          }).then();
        }
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: updatedQty }
            : item
        );
      }

      if (isAuthenticated && user?.id) {
        insforge.database.from('cart_items').insert({
          user_id: user.id,
          product_id: product.id,
          quantity,
          selected_size: size,
        }).then();
      }

      return [...prev, { product, quantity, selectedSize: size }];
    });

    showToast(`Added "${product.name}" (${size}) to your bag.`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (isAuthenticated && user?.id) {
      insforge.database.from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .then();
    }
    showToast('Item removed from bag.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
    if (isAuthenticated && user?.id) {
      insforge.database.from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .then();
    }
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);

    const currentUserId = isAuthenticated && user?.id ? user.id : null;
    try {
      localStorage.removeItem(getCartStorageKey(currentUserId));
      localStorage.removeItem(getCouponStorageKey(currentUserId));
      clearAllLegacyStorage();
    } catch {}

    if (isAuthenticated && user?.id) {
      insforge.database.from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .then();
    }
  }, [isAuthenticated, user?.id]);

  const applyCoupon = (code: string) => {
    const result = validateAndApplyCoupon(code, subtotal, rawDeliveryFee);
    if (result.isValid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
      const currentUserId = isAuthenticated && user?.id ? user.id : null;
      try {
        localStorage.setItem(
          getCouponStorageKey(currentUserId),
          JSON.stringify({ coupon: result.coupon, discount: result.discountAmount })
        );
      } catch {}
      showToast(result.message, 'success');
      return { success: true, message: result.message };
    } else {
      showToast(result.message, 'error');
      return { success: false, message: result.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    const currentUserId = isAuthenticated && user?.id ? user.id : null;
    try {
      localStorage.removeItem(getCouponStorageKey(currentUserId));
    } catch {}
    showToast('Coupon code removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
