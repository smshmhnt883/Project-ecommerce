import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminClient } from '@/lib/insforge';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Bon74fIfUUHmBRcy30ODPxMy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay verification parameters.' },
        { status: 400 }
      );
    }

    // 1. Verify HMAC SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isMatch = expectedSignature === razorpay_signature;
    const adminClient = getAdminClient();

    if (!isMatch) {
      console.warn('Razorpay signature mismatch for order:', orderId);
      // Mark order as PAYMENT_FAILED in database
      await adminClient.database
        .from('orders')
        .update({
          payment_status: 'PAYMENT_FAILED',
          status: 'PAYMENT_FAILED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      return NextResponse.json(
        { success: false, error: 'Signature verification failed' },
        { status: 400 }
      );
    }

    // 2. Signature verified: update order status to PAID
    const { error: updateError } = await adminClient.database
      .from('orders')
      .update({
        payment_status: 'PAID',
        status: 'PAID',
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order to PAID:', updateError);
    }

    // 3. Clear customer's remote cart in InsForge
    if (userId) {
      await adminClient.database.from('cart_items').delete().eq('user_id', userId);
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/order-success/${orderId}`,
    });
  } catch (error: any) {
    console.error('Unexpected error in verify-payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
