export function calculateDiscount(subtotal: number, discount: string): number {
  if (!discount) return 0;

  if (discount.endsWith('%')) {
    const percent = parseFloat(discount.replace('%', '')) || 0;
    return subtotal * (percent / 100);
  }

  const value = parseFloat(discount) || 0;
  return value;
}
