import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminClient } from '@/lib/insforge';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_TYT7joiulGT2Bj_webhook_secret';

export async function POST(req: NextRequest) {
  try {
    // 1. Read raw request text (MUST be raw unparsed string for cryptographic verification)
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.warn('Webhook received without x-razorpay-signature header.');
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    // 2. Compute expected HMAC SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Razorpay webhook signature verification failed.');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // 3. Process the verified event
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const adminClient = getAdminClient();

    console.log(`Razorpay Webhook Verified: ${eventType}`);

    if (eventType === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const rzpPaymentId = paymentEntity?.id;

      if (rzpOrderId) {
        const { data: matchingOrders, error } = await adminClient.database
          .from('orders')
          .select('*')
          .eq('razorpay_order_id', rzpOrderId);

        if (!error && matchingOrders && matchingOrders.length > 0) {
          const order = matchingOrders[0];
          if (order.status === 'PAYMENT_PENDING' || order.payment_status === 'PAYMENT_PENDING') {
            await adminClient.database
              .from('orders')
              .update({
                payment_status: 'PAID',
                status: 'PAID',
                razorpay_payment_id: rzpPaymentId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', order.id);

            // Clear customer cart upon captured payment
            if (order.user_id) {
              await adminClient.database
                .from('cart_items')
                .delete()
                .eq('user_id', order.user_id);
            }
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;

      if (rzpOrderId) {
        await adminClient.database
          .from('orders')
          .update({
            payment_status: 'PAYMENT_FAILED',
            status: 'PAYMENT_FAILED',
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', rzpOrderId);
      }
    }

    // Return HTTP 200 immediately
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Error processing Razorpay webhook:', err);
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed.' },
      { status: 500 }
    );
  }
}
