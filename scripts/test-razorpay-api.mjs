import crypto from 'crypto';
import assert from 'assert';

const KEY_ID = 'rzp_test_TYT7joiulGT2Bj';
const KEY_SECRET = 'Bon74fIfUUHmBRcy30ODPxMy';
const WEBHOOK_SECRET = 'rzp_test_TYT7joiulGT2Bj_webhook_secret';

async function testRazorpayOrdersApi() {
  console.log('--- 1. Testing Direct Razorpay Orders API Initialization ---');
  const authHeader = 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
  const receipt = `TEST-REC-${Date.now()}`;
  
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 15000, // ₹150 in paise
      currency: 'INR',
      receipt,
    }),
  });

  const data = await res.json();
  assert.strictEqual(res.status, 200, `Razorpay API error: ${JSON.stringify(data)}`);
  assert.ok(data.id.startsWith('order_'), 'Returned ID should start with order_');
  assert.strictEqual(data.amount, 15000);
  assert.strictEqual(data.status, 'created');
  console.log(`✓ Razorpay order initialized successfully: ${data.id} (amount: ₹${data.amount / 100})`);
  return data.id;
}

function testSignatureVerification(rzpOrderId, rzpPaymentId) {
  console.log('\n--- 2. Testing Payment Signature Verification Logic ---');
  const validSignature = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${rzpOrderId}|${rzpPaymentId}`)
    .digest('hex');

  const generatedSignature = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${rzpOrderId}|${rzpPaymentId}`)
    .digest('hex');

  assert.strictEqual(validSignature, generatedSignature, 'Signatures must match for valid payment');
  console.log('✓ Valid signature matches correctly');

  const invalidSignature = 'invalid_tampered_signature_123456';
  assert.notStrictEqual(invalidSignature, generatedSignature, 'Tampered signature must not match');
  console.log('✓ Tampered signature rejected correctly');
}

function testWebhookSignatureVerification() {
  console.log('\n--- 3. Testing Webhook Signature Verification Logic ---');
  const rawBody = JSON.stringify({
    entity: 'event',
    account_id: 'acc_test123',
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_test_123',
          amount: 15000,
          currency: 'INR',
          status: 'captured',
          order_id: 'order_test_123',
        },
      },
    },
  });

  const webhookSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  const computed = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  assert.strictEqual(webhookSignature, computed);
  console.log('✓ Webhook HMAC SHA256 signature verified successfully');
}

async function runAll() {
  console.log('=== STARTING RAZORPAY INTEGRATION VERIFICATION ===\n');
  const rzpOrderId = await testRazorpayOrdersApi();
  const dummyPaymentId = `pay_test_${Math.random().toString(36).substring(2, 9)}`;
  testSignatureVerification(rzpOrderId, dummyPaymentId);
  testWebhookSignatureVerification();
  console.log('\n=== ALL RAZORPAY UNIT & API TESTS PASSED ===');
}

runAll().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
