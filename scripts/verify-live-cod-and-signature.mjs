import https from 'https';

function request(url, options = {}, body = null) {
  return new Promise((resolve) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
        });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function testCodAndVerify() {
  console.log('--- Testing Live API: POST /api/checkout/verify-payment with invalid signature ---');
  const verifyRes = await request(
    'https://patanjali-store.insforge.site/api/checkout/verify-payment',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      razorpay_order_id: 'order_TYTMhUMKIq6ZFA',
      razorpay_payment_id: 'pay_test_fake123',
      razorpay_signature: 'fake_signature_abc123',
      orderId: 'PAT-2026-9444',
      userId: null,
    }
  );
  console.log(`Verify Payment Response [HTTP ${verifyRes.statusCode}]:`, verifyRes.data);
  const verifyParsed = JSON.parse(verifyRes.data);
  if (verifyRes.statusCode === 400 && verifyParsed.error === 'Signature verification failed') {
    console.log('✓ Cryptographic signature tampering correctly rejected by live production server!');
  }

  console.log('\n--- Testing Live API: POST /api/checkout/cod ---');
  const codRes = await request(
    'https://patanjali-store.insforge.site/api/checkout/cod',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      userId: null,
      shippingAddress: {
        fullName: 'Lakshman Das',
        phone: '9876543210',
        addressLine1: 'Ganga Ghat',
        city: 'Rishikesh',
        state: 'Uttarakhand',
        pincode: '249201',
      },
      items: [
        { productId: 'pat-005', quantity: 1, selectedSize: '1kg' }
      ],
      couponCode: 'WELCOME10',
    }
  );
  console.log(`COD Order Response [HTTP ${codRes.statusCode}]:`, codRes.data);
  const codParsed = JSON.parse(codRes.data);
  if (codRes.statusCode === 200 && codParsed.success) {
    console.log(`✓ Live COD Order created successfully: ${codParsed.orderId}`);
    console.log(`✓ Redirect URL: ${codParsed.redirectUrl}`);
  }
}

testCodAndVerify();
