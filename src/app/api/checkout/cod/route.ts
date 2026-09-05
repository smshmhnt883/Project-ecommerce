import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';
import { validateAndApplyCoupon } from '@/lib/data/coupons';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, shippingAddress, items, couponCode } = body;

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Delivery shipping address is required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();

    // 1. Fetch real prices from database or authoritative catalog (NEVER trust client prices)
    const { data: dbProducts } = await adminClient.database.from('products').select('*');
    const catalog = (dbProducts && dbProducts.length > 0) ? dbProducts : PRODUCTS;

    let calculatedSubtotal = 0;
    const verifiedItems: {
      productId: string;
      name: string;
      image: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      selectedSize: string;
    }[] = [];

    for (const it of items) {
      const pId = it.productId || it.product?.id;
      const prod = catalog.find((p: any) => p.id === pId) || PRODUCTS.find((p) => p.id === pId);
      if (!prod) {
        return NextResponse.json(
          { error: `Product ${pId} could not be found in our Ayurvedic catalog.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const unitPrice = Number(prod.price);
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        productId: prod.id,
        name: prod.name,
        image: prod.thumbnail || prod.images?.[0] || '/products/patanjali-dant-kanti.jpg',
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
        selectedSize: it.selectedSize || prod.size || 'Standard',
      });
    }

    // 2. Shipping Calculation: Subtotal >= ₹499 is Free; Subtotal < ₹499 is ₹50
    const rawShippingFee = calculatedSubtotal >= 499 ? 0 : 50;

    // 3. Coupon Calculation
    let calculatedDiscount = 0;
    let finalShippingFee = rawShippingFee;

    if (couponCode) {
      const couponResult = validateAndApplyCoupon(couponCode, calculatedSubtotal, rawShippingFee);
      if (couponResult.isValid) {
        calculatedDiscount = couponResult.discountAmount;
        if (couponResult.coupon?.discountType === 'free_shipping') {
          finalShippingFee = 0;
        }
      }
    }

    const finalTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + finalShippingFee);
    const orderId = `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Insert order with status: "PLACED", payment_status: "PENDING_ON_DELIVERY", payment_method: "COD"
    const { error: orderInsertError } = await adminClient.database.from('orders').insert({
      id: orderId,
      user_id: userId || null,
      order_number: orderId,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shipping_fee: finalShippingFee,
      tax: 0,
      total: finalTotal,
      payment_status: 'PENDING_ON_DELIVERY',
      payment_method: 'COD',
      order_status: 'placed',
      status: 'PLACED',
      shipping_address_snapshot: shippingAddress,
      coupon_code: couponCode || null,
    });

    if (orderInsertError) {
      console.error('InsForge COD order creation error:', orderInsertError);
    }

    // 5. Insert order items
    for (const it of verifiedItems) {
      await adminClient.database.from('order_items').insert({
        order_id: orderId,
        product_id: it.productId,
        product_name_snapshot: it.name,
        product_image_snapshot: it.image,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        total_price: it.totalPrice,
        selected_size: it.selectedSize,
      });
    }

    // 6. Clear user's remote cart in InsForge
    if (userId) {
      await adminClient.database.from('cart_items').delete().eq('user_id', userId);
    }

    return NextResponse.json({
      success: true,
      orderId,
      redirectUrl: `/order-success/${orderId}`,
    });
  } catch (error: any) {
    console.error('Unexpected error in COD order creation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place Cash on Delivery order.' },
      { status: 500 }
    );
  }
}
