'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, CartItem, Coupon } from '@/types';
import { validateAndApplyCoupon } from '@/lib/data/coupons';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { insforge } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';

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

  // Load initial cart
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('patanjali_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('patanjali_coupon');
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

  // Sync / Reconcile guest cart with InsForge when user logs in
  useEffect(() => {
    const userId = user?.id;
    if (!isAuthenticated || !userId) return;

    async function reconcileGuestCart() {
      try {
        // 1. Fetch existing remote cart items from InsForge
        const { data: remoteData, error: fetchError } = await insforge.database
          .from('cart_items')
          .select('*')
          .eq('user_id', userId);

        let remoteItems: any[] = !fetchError && remoteData ? [...remoteData] : [];

        // 2. Read temporary guest cart items from localStorage
        let guestItems: CartItem[] = [];
        try {
          const guestCartJson = localStorage.getItem('patanjali_cart');
          if (guestCartJson) {
            guestItems = JSON.parse(guestCartJson);
          }
        } catch {}

        // 3. Reconcile if guest items exist
        if (guestItems.length > 0) {
          for (const guestItem of guestItems) {
            const size = guestItem.selectedSize || guestItem.product.size;
            const maxStock = guestItem.product.stock || 99;

            const existingRemote = remoteItems.find(
              (r) => r.product_id === guestItem.product.id && (r.selected_size || '') === (size || '')
            );

            if (existingRemote) {
              // Product exists in both: sum quantities respecting max inventory
              const summedQty = Math.min(existingRemote.quantity + guestItem.quantity, maxStock);
              await insforge.database
                .from('cart_items')
                .update({ quantity: summedQty })
                .eq('id', existingRemote.id);
              existingRemote.quantity = summedQty;
            } else {
              // Product only exists in guest cart: add to user's remote database cart
              const newQty = Math.min(guestItem.quantity, maxStock);
              const { data: inserted } = await insforge.database
                .from('cart_items')
                .insert({
                  user_id: userId,
                  product_id: guestItem.product.id,
                  quantity: newQty,
                  selected_size: size,
                })
                .select();

              if (inserted && inserted.length > 0) {
                remoteItems.push(inserted[0]);
              } else {
                remoteItems.push({
                  user_id: userId,
                  product_id: guestItem.product.id,
                  quantity: newQty,
                  selected_size: size,
                });
              }
            }
          }

          // Clear temporary guest cart from localStorage
          localStorage.removeItem('patanjali_cart');
        }

        // 4. Map remoteItems to CartItem[] as the single source of truth
        const merged: CartItem[] = remoteItems.map((row: any) => {
          const product = PRODUCTS.find((p) => p.id === row.product_id) || {
            id: row.product_id,
            name: 'Ayurvedic Product',
            slug: 'product',
            category: 'Wellness',
            categorySlug: 'wellness',
            concernSlugs: [],
            description: '',
            shortDescription: '',
            price: 150,
            mrp: 175,
            discount: 14,
            images: ['/products/patanjali-dant-kanti.jpg'],
            thumbnail: '/products/patanjali-dant-kanti.jpg',
            sku: `PAT-${row.product_id}`,
            size: row.selected_size || 'Standard',
            stock: 100,
            inStock: true,
            rating: 4.8,
            reviewCount: 120,
            featured: false,
            bestseller: false,
            ingredients: [],
            benefits: [],
            usage: '',
            manufacturer: {
              name: 'Patanjali Ayurved Limited',
              address: 'Haridwar, Uttarakhand',
              license: 'A-2878/99',
              shelfLife: '24 Months',
              countryOfOrigin: 'India',
            },
          };

          return {
            product,
            quantity: row.quantity,
            selectedSize: row.selected_size || product.size,
          };
        });

        // Update in-memory state instantly without page refresh
        setCart(merged);
      } catch (err) {
        console.warn('Cart reconciliation issue:', err);
      }
    }

    reconcileGuestCart();
  }, [isAuthenticated, user?.id]);

  // Save cart locally
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('patanjali_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart, isInitialized]);

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
        localStorage.removeItem('patanjali_coupon');
      }
    } else if (subtotal === 0) {
      setCouponDiscount(0);
    }
  }, [subtotal, appliedCoupon, rawDeliveryFee]);

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
    localStorage.removeItem('patanjali_cart');
    localStorage.removeItem('patanjali_coupon');

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
      localStorage.setItem('patanjali_coupon', JSON.stringify({ coupon: result.coupon, discount: result.discountAmount }));
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
    localStorage.removeItem('patanjali_coupon');
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
