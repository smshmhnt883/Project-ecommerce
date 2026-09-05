export interface ProductIngredient {
  name: string;
  botanicalName?: string;
  purpose?: string;
}

export interface ProductManufacturer {
  name: string;
  address: string;
  license: string;
  fssai?: string;
  shelfLife: string;
  countryOfOrigin: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  concernSlugs: string[];
  description: string;
  shortDescription: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  thumbnail: string;
  sku: string;
  size: string;
  availableSizes?: string[];
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  badge?: string;
  ingredients: ProductIngredient[];
  benefits: string[];
  usage: string;
  storage?: string;
  safetyWarning?: string;
  manufacturer: ProductManufacturer;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  image: string;
  iconName?: string;
  itemCount: number;
}

export interface Concern {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  image: string;
  accentColor?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderValue: number;
  description: string;
  maxDiscount?: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  emailVerified?: boolean;
  addresses: Address[];
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export type OrderStage = 
  | 'placed' 
  | 'payment_confirmed' 
  | 'processing' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered';

export interface TrackingStep {
  stage: OrderStage;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: PaymentMethod | string;
  paymentStatus: string;
  status?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentDetails?: {
    upiId?: string;
    cardLast4?: string;
    cardType?: string;
    bankName?: string;
    walletName?: string;
    method?: string;
  };
  orderStatus: OrderStage;
  trackingTimeline: TrackingStep[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userLocation?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Combo {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  productIds: string[];
  mrp: number;
  price: number;
  discount: number;
  image: string;
  badge: string;
  includes: string[];
}

export interface FilterState {
  category: string | null;
  concern: string | null;
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  inStockOnly: boolean;
  minDiscount: number;
  size: string | null;
}

export type SortOption = 
  | 'recommended' 
  | 'bestseller' 
  | 'newest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating-desc';
