import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();

    const { data: dbOrder, error: orderError } = await adminClient.database
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !dbOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const { data: itemsData } = await adminClient.database
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    const items = (itemsData || []).map((it: any) => {
      const prod = PRODUCTS.find((p) => p.id === it.product_id) || {
        id: it.product_id,
        name: it.product_name_snapshot,
        slug: 'product',
        category: 'Wellness',
        categorySlug: 'wellness',
        concernSlugs: [],
        description: '',
        shortDescription: '',
        price: Number(it.unit_price),
        mrp: Number(it.unit_price) * 1.1,
        discount: 10,
        images: [it.product_image_snapshot || '/products/patanjali-dant-kanti.jpg'],
        thumbnail: it.product_image_snapshot || '/products/patanjali-dant-kanti.jpg',
        sku: `PAT-${it.product_id}`,
        size: it.selected_size || 'Standard',
        stock: 100,
        inStock: true,
        rating: 4.8,
        reviewCount: 50,
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
        product: prod,
        quantity: it.quantity,
        price: Number(it.unit_price),
        selectedSize: it.selected_size || prod.size,
      };
    });

    const orderDate = new Date(dbOrder.created_at);
    const formattedDate = orderDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const estDate = new Date(orderDate.getTime() + 5 * 24 * 3600 * 1000).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

    const formattedOrder = {
      id: dbOrder.id,
      userId: dbOrder.user_id,
      items,
      subtotal: Number(dbOrder.subtotal),
      discount: Number(dbOrder.discount || 0),
      couponCode: dbOrder.coupon_code || undefined,
      shipping: Number(dbOrder.shipping_fee || 0),
      tax: Number(dbOrder.tax || 0),
      total: Number(dbOrder.total),
      shippingAddress: dbOrder.shipping_address_snapshot,
      deliveryMethod: 'standard',
      paymentMethod: dbOrder.payment_method || 'ONLINE_RAZORPAY',
      paymentStatus: dbOrder.payment_status || 'PAID',
      status: dbOrder.status,
      razorpayOrderId: dbOrder.razorpay_order_id,
      razorpayPaymentId: dbOrder.razorpay_payment_id,
      paymentDetails: {},
      orderStatus: dbOrder.order_status || 'placed',
      trackingTimeline: [],
      createdAt: formattedDate,
      estimatedDelivery: estDate,
    };

    return NextResponse.json({ success: true, order: formattedOrder });
  } catch (err: any) {
    console.error('Order details fetch error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
