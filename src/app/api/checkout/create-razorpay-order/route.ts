import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';
import { validateAndApplyCoupon } from '@/lib/data/coupons';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TYT7joiulGT2Bj';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Bon74fIfUUHmBRcy30ODPxMy';

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
    const amountInPaise = Math.round(finalTotal * 100);

    const orderId = `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Initialize order via Razorpay Orders API
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId,
          userId: userId || 'guest',
        },
      }),
    });

    if (!rzpRes.ok) {
      const errText = await rzpRes.text();
      console.error('Razorpay Orders API error:', errText);
      return NextResponse.json(
        { error: 'Failed to initialize payment with Razorpay. Please verify credentials or try again.' },
        { status: 502 }
      );
    }

    const rzpOrder = await rzpRes.json();

    // 5. Insert order row in InsForge orders table with status PAYMENT_PENDING
    const { error: orderInsertError } = await adminClient.database.from('orders').insert({
      id: orderId,
      user_id: userId || null,
      order_number: orderId,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shipping_fee: finalShippingFee,
      tax: 0,
      total: finalTotal,
      payment_status: 'PAYMENT_PENDING',
      payment_method: 'ONLINE_RAZORPAY',
      order_status: 'placed',
      status: 'PAYMENT_PENDING',
      razorpay_order_id: rzpOrder.id,
      shipping_address_snapshot: shippingAddress,
      coupon_code: couponCode || null,
    });

    if (orderInsertError) {
      console.error('InsForge order creation error:', orderInsertError);
    }

    // Insert order items
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

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      orderId,
      subtotal: calculatedSubtotal,
      shipping: finalShippingFee,
      discount: calculatedDiscount,
      total: finalTotal,
    });
  } catch (error: any) {
    console.error('Unexpected error in create-razorpay-order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while creating Razorpay order.' },
      { status: 500 }
    );
  }
}
