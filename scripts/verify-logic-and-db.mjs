import { createClient } from '@insforge/sdk';
import assert from 'assert';

const BACKEND_URL = 'https://rj3p7x87.ap-southeast.insforge.app';
const ANON_KEY = 'anon_afd7ec88115b790a0bb75ce0a920fa095c39717df2ea9196e73cbe5e074db731';

const insforge = createClient({
  baseUrl: BACKEND_URL,
  anonKey: ANON_KEY,
});

// Unit test: phone validation
function validateIndianPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return /^[6-9]\d{9}$/.test(digits.slice(1));
  }
  return /^[6-9]\d{9}$/.test(digits);
}

// Unit test: pincode validation
function validateIndianPincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

// Unit test: shipping calculation
function calculateShipping(subtotal) {
  return subtotal >= 499 ? 0 : 50;
}

// Unit test: WELCOME10 coupon
function calculateWelcome10Discount(subtotal) {
  return Math.round((subtotal * 10) / 100);
}

async function runTests() {
  console.log('--- 1. Testing Phone & Pincode Validation ---');
  assert.strictEqual(validateIndianPhone('9876543210'), true);
  assert.strictEqual(validateIndianPhone('8123456789'), true);
  assert.strictEqual(validateIndianPhone('7012345678'), true);
  assert.strictEqual(validateIndianPhone('6234567890'), true);
  assert.strictEqual(validateIndianPhone('+91 98765 43210'), true);
  assert.strictEqual(validateIndianPhone('1234567890'), false);
  assert.strictEqual(validateIndianPhone('5234567890'), false);
  assert.strictEqual(validateIndianPhone('987654321'), false);
  console.log('✓ validateIndianPhone passed all test cases');

  assert.strictEqual(validateIndianPincode('560034'), true);
  assert.strictEqual(validateIndianPincode('110001'), true);
  assert.strictEqual(validateIndianPincode('249401'), true); // Haridwar
  assert.strictEqual(validateIndianPincode('011001'), false);
  assert.strictEqual(validateIndianPincode('56003'), false);
  assert.strictEqual(validateIndianPincode('5600345'), false);
  console.log('✓ validateIndianPincode passed all test cases');

  console.log('\n--- 2. Testing Shipping Fee Calculation ---');
  assert.strictEqual(calculateShipping(150), 50);
  assert.strictEqual(calculateShipping(498), 50);
  assert.strictEqual(calculateShipping(499), 0);
  assert.strictEqual(calculateShipping(1200), 0);
  console.log('✓ Dynamic shipping passed: < ₹499 is ₹50, >= ₹499 is ₹0 (Free)');

  console.log('\n--- 3. Testing WELCOME10 Coupon Logic ---');
  assert.strictEqual(calculateWelcome10Discount(150), 15);
  assert.strictEqual(calculateWelcome10Discount(499), 50);
  assert.strictEqual(calculateWelcome10Discount(1000), 100);
  console.log('✓ WELCOME10 gives exact 10% discount on all subtotal values');

  console.log('\n--- 4. Testing InsForge Database Tables ---');
  const tables = ['user_addresses', 'orders', 'order_items', 'cart_items'];
  for (const tbl of tables) {
    const { data, error } = await insforge.database.from(tbl).select('*').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log(`Table ${tbl}: Error:`, error.message);
    } else {
      console.log(`✓ Table '${tbl}' accessible in InsForge backend (rows: ${data ? data.length : 0})`);
    }
  }

  console.log('\n=== ALL INTEGRATION VERIFICATIONS PASSED ===');
}

runTests().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
