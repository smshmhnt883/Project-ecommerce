import { CartItem, Product } from '@/types';
import { insforge } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';

export const CART_STORAGE_PREFIX = 'patanjali_cart_';
export const COUPON_STORAGE_PREFIX = 'patanjali_coupon_';
export const GUEST_CART_KEY = 'patanjali_cart_guest';
export const GUEST_COUPON_KEY = 'patanjali_coupon_guest';

export function getCartStorageKey(userId?: string | null): string {
  return userId ? `${CART_STORAGE_PREFIX}${userId}` : GUEST_CART_KEY;
}

export function getCouponStorageKey(userId?: string | null): string {
  return userId ? `${COUPON_STORAGE_PREFIX}${userId}` : GUEST_COUPON_KEY;
}

export function clearGuestCartStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_CART_KEY);
    localStorage.removeItem(GUEST_COUPON_KEY);
    // Also remove any legacy un-scoped keys
    localStorage.removeItem('patanjali_cart');
    localStorage.removeItem('patanjali_coupon');
  } catch (e) {
    console.warn('Failed to clear guest cart storage:', e);
  }
}

export function clearUserCartStorage(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getCartStorageKey(userId));
    localStorage.removeItem(getCouponStorageKey(userId));
  } catch (e) {
    console.warn(`Failed to clear user cart storage for ${userId}:`, e);
  }
}

export function clearAllLegacyStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('patanjali_cart');
    localStorage.removeItem('patanjali_coupon');
  } catch (e) {
    console.warn('Failed to clear legacy storage:', e);
  }
}

export function mapDbCartRowToCartItem(row: any): CartItem {
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
}

export async function fetchRemoteCart(userId: string): Promise<CartItem[]> {
  try {
    const { data: remoteData, error } = await insforge.database
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);

    if (error || !remoteData) {
      console.warn(`Error fetching remote cart for user ${userId}:`, error);
      return [];
    }

    return remoteData.map(mapDbCartRowToCartItem);
  } catch (err) {
    console.warn('Remote cart fetch exception:', err);
    return [];
  }
}

export async function reconcileGuestCartWithRemote(
  userId: string,
  guestItems: CartItem[]
): Promise<CartItem[]> {
  try {
    // 1. Fetch remote items for this specific user
    const { data: remoteData, error: fetchError } = await insforge.database
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);

    const remoteItems: any[] = !fetchError && remoteData ? [...remoteData] : [];

    // 2. Reconcile with guest items if any
    if (guestItems.length > 0) {
      for (const guestItem of guestItems) {
        const size = guestItem.selectedSize || guestItem.product.size;
        const maxStock = guestItem.product.stock || 99;

        const existingRemote = remoteItems.find(
          (r) => r.product_id === guestItem.product.id && (r.selected_size || '') === (size || '')
        );

        if (existingRemote) {
          const summedQty = Math.min(existingRemote.quantity + guestItem.quantity, maxStock);
          await insforge.database
            .from('cart_items')
            .update({ quantity: summedQty })
            .eq('id', existingRemote.id)
            .eq('user_id', userId); // Extra safety: ensure user_id matches
          existingRemote.quantity = summedQty;
        } else {
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
    }

    return remoteItems.map(mapDbCartRowToCartItem);
  } catch (err) {
    console.warn('Cart reconciliation failed:', err);
    return [];
  }
}
