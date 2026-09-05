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

async function verify() {
  console.log('=== VERIFYING LIVE PRODUCTION RAZORPAY DEPLOYMENT ===\n');

  // 1. Check pages
  const pages = [
    'https://patanjali-store.insforge.site/',
    'https://patanjali-store.insforge.site/checkout',
    'https://patanjali-store.insforge.site/order-success',
  ];

  for (const p of pages) {
    const res = await request(p, { method: 'GET' });
    console.log(`[HTTP ${res.statusCode}] ${p}`);
  }

  // 2. Test Live API: create-razorpay-order
  console.log('\n--- Testing Live API: POST /api/checkout/create-razorpay-order ---');
  const testPayload = {
    userId: null,
    shippingAddress: {
      fullName: 'Sita Ram',
      phone: '9876543210',
      addressLine1: 'Ashram Road',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249401',
    },
    items: [
      { productId: 'pat-001', quantity: 2, selectedSize: '100g' }
    ],
    couponCode: 'WELCOME10',
  };

  const createRes = await request(
    'https://patanjali-store.insforge.site/api/checkout/create-razorpay-order',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    testPayload
  );

  console.log(`Live API Response [HTTP ${createRes.statusCode}]:`, createRes.data);
  try {
    const parsed = JSON.parse(createRes.data);
    if (parsed.razorpayOrderId) {
      console.log(`✓ Real Razorpay Order ID created on live production: ${parsed.razorpayOrderId}`);
      console.log(`✓ InsForge Order ID created: ${parsed.orderId}`);
      console.log(`✓ Amount in paise: ${parsed.amount} (INR ${parsed.total})`);
    } else {
      console.warn('Response did not contain razorpayOrderId:', parsed);
    }
  } catch (e) {
    console.error('Failed to parse API response JSON:', e);
  }

  console.log('\n=== LIVE PRODUCTION VERIFICATION COMPLETE ===');
}

verify();
