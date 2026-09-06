'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Product } from '@/types';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { insforge } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_PREFIX = 'patanjali_wishlist_';
const GUEST_WISHLIST_KEY = 'patanjali_wishlist_guest';

function getWishlistStorageKey(userId?: string | null): string {
  return userId ? `${WISHLIST_STORAGE_PREFIX}${userId}` : GUEST_WISHLIST_KEY;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  // Load from local storage on mount
  useEffect(() => {
    try {
      localStorage.removeItem('patanjali_wishlist'); // Clean legacy un-scoped key
      const currentUserId = isAuthenticated && user?.id ? user.id : null;
      const key = getWishlistStorageKey(currentUserId);
      const saved = localStorage.getItem(key);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const syncRemoteWishlist = useCallback(async (userId: string) => {
    try {
      const { data, error } = await insforge.database
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', userId);

      if (!error && data) {
        const productIds = new Set(data.map((d: any) => d.product_id));
        const remoteProducts = PRODUCTS.filter((p) => productIds.has(p.id));
        setWishlist(remoteProducts);
        try {
          localStorage.setItem(getWishlistStorageKey(userId), JSON.stringify(remoteProducts));
        } catch {}
      }
    } catch (err) {
      console.warn('Wishlist sync warning:', err);
    }
  }, []);

  // Handle auth transitions: Log in, Log out, Account switch
  useEffect(() => {
    if (!isInitialized) return;

    const currentUserId = isAuthenticated && user?.id ? user.id : null;

    if (previousUserIdRef.current === undefined) {
      previousUserIdRef.current = currentUserId;
      if (currentUserId) {
        syncRemoteWishlist(currentUserId);
      }
      return;
    }

    const prevUserId = previousUserIdRef.current;
    previousUserIdRef.current = currentUserId;

    // 1. Logout: reset wishlist to empty
    if (prevUserId && !currentUserId) {
      setWishlist([]);
      try {
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      } catch {}
      return;
    }

    // 2. Account switch: clear old user items and load new user's items
    if (prevUserId && currentUserId && prevUserId !== currentUserId) {
      setWishlist([]);
      syncRemoteWishlist(currentUserId);
      return;
    }

    // 3. Guest login: load remote wishlist
    if (!prevUserId && currentUserId) {
      syncRemoteWishlist(currentUserId);
      return;
    }
  }, [isAuthenticated, user?.id, isInitialized, syncRemoteWishlist]);

  // Listen to explicit auth:logout
  useEffect(() => {
    const handleLogout = () => {
      setWishlist([]);
      try {
        localStorage.removeItem(GUEST_WISHLIST_KEY);
        localStorage.removeItem('patanjali_wishlist');
      } catch {}
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Save to scoped storage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const currentUserId = isAuthenticated && user?.id ? user.id : null;
      const key = getWishlistStorageKey(currentUserId);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist, isInitialized, isAuthenticated, user?.id]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      if (isAuthenticated && user?.id) {
        insforge.database
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .then();
      }
      showToast(`Removed "${product.name}" from your wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      if (isAuthenticated && user?.id) {
        insforge.database
          .from('wishlist_items')
          .upsert({
            user_id: user.id,
            product_id: product.id,
          })
          .then();
      }
      showToast(`Saved "${product.name}" to your wishlist.`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    if (isAuthenticated && user?.id) {
      insforge.database
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .then();
    }
    showToast('Item removed from wishlist.', 'info');
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1, product.size);
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
