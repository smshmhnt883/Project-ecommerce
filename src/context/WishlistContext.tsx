'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('patanjali_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync with InsForge wishlist_items when user is logged in
  useEffect(() => {
    const userId = user?.id;
    if (!isAuthenticated || !userId) {
      return;
    }

    async function syncWishlist() {
      try {
        const { data, error } = await insforge.database
          .from('wishlist_items')
          .select('product_id')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          const productIds = new Set(data.map((d: any) => d.product_id));
          const remoteProducts = PRODUCTS.filter((p) => productIds.has(p.id));
          if (remoteProducts.length > 0) {
            setWishlist(remoteProducts);
          }
        }
      } catch (err) {
        console.warn('Wishlist sync warning:', err);
      }
    }

    syncWishlist();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('patanjali_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist, isInitialized]);

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
