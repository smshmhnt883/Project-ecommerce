export function generateOrderId(): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAT-2026-${randomStr}`;
}
