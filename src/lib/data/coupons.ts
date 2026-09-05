import { Coupon } from '@/types';

export const VALID_COUPONS: Record<string, Coupon> = {
  WELCOME10: {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
    description: '10% off on your order with no minimum purchase',
    maxDiscount: 500,
  },
  SAVE100: {
    code: 'SAVE100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 799,
    description: 'Flat ₹100 off on orders above ₹799',
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountType: 'free_shipping',
    discountValue: 0,
    minOrderValue: 199,
    description: 'Free standard delivery on orders above ₹199',
  },
};

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

export function validateAndApplyCoupon(
  code: string,
  subtotal: number,
  shippingCost: number
): CouponValidationResult {
  const normalized = code.trim().toUpperCase();
  const coupon = VALID_COUPONS[normalized];

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      message: 'Invalid coupon code. Try WELCOME10, SAVE100, or FREESHIP.',
    };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Coupon '${coupon.code}' requires a minimum order value of ₹${coupon.minOrderValue}. Add ₹${coupon.minOrderValue - subtotal} more to redeem.`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  } else if (coupon.discountType === 'free_shipping') {
    discountAmount = shippingCost;
  }

  return {
    isValid: true,
    coupon,
    discountAmount,
    message: `Coupon '${coupon.code}' applied successfully! You saved ₹${discountAmount}.`,
  };
}
