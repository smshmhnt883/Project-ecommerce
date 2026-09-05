export const createRazorpayOrder = async (payload: any) => {
  const res = await fetch('/api/checkout/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res;
};

export const verifyPayment = async (payload: any) => {
  const res = await fetch('/api/checkout/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res;
};

export const placeCodOrder = async (payload: any) => {
  const res = await fetch('/api/checkout/cod', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res;
};
