export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(mrp: number, price: number): number {
  if (mrp <= price || mrp === 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function amountToPaise(amount: number): number {
  return Math.round(amount * 100);
}
