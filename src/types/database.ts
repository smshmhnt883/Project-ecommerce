import { Product, Address, Order, OrderItem, User } from './index';

export interface DbProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  subcategory: string | null;
  price: number;
  mrp: number;
  discount_percentage: number;
  sku: string | null;
  stock_quantity: number;
  size: string;
  unit: string | null;
  ingredients: string | null;
  usage: string | null;
  product_information: string | null;
  featured: boolean;
  bestseller: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  alt_text: string | null;
  created_at: string;
}

export interface DbCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_size: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface DbAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line: string;
  apartment: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  is_default: boolean;
  type: 'home' | 'work' | 'other';
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  user_id: string;
  order_number: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_status: string;
  payment_method: string;
  order_status: string;
  status?: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  shipping_address_snapshot: any;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  product_image_snapshot: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_size: string | null;
  created_at: string;
}

export interface DbReview {
  id: string;
  product_id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface DbUserAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Convert DbAddress to frontend Address
export function mapDbAddressToAddress(db: DbAddress): Address {
  return {
    id: db.id,
    fullName: db.full_name,
    phone: db.phone,
    addressLine1: db.address_line,
    addressLine2: db.apartment || undefined,
    city: db.city,
    state: db.state,
    pincode: db.pincode,
    landmark: db.landmark || undefined,
    isDefault: db.is_default,
    type: db.type,
  };
}

// Convert DbUserAddress to frontend Address
export function mapDbUserAddressToAddress(db: DbUserAddress): Address {
  return {
    id: db.id,
    fullName: db.full_name,
    phone: db.phone_number,
    addressLine1: db.address_line1,
    addressLine2: db.address_line2 || undefined,
    city: db.city,
    state: db.state,
    pincode: db.pincode,
    landmark: db.address_line2 || undefined,
    isDefault: db.is_default,
    type: 'home',
  };
}
