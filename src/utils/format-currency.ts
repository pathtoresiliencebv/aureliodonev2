/**
 * Formats a price in cents to a currency string
 * @param amount - Price in cents (e.g., 2999 for $29.99)
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const dollars = amount / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars);
}

/**
 * Formats a price range for products with compare-at pricing
 * @param price - Current price in cents
 * @param compareAtPrice - Compare-at price in cents (optional)
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted price range string
 */
export function formatPriceRange(
  price: number,
  compareAtPrice?: number | null,
  currency: string = 'USD'
): string {
  const formattedPrice = formatCurrency(price, currency);

  if (compareAtPrice && compareAtPrice > price) {
    const formattedCompareAt = formatCurrency(compareAtPrice, currency);
    return `${formattedPrice} (was ${formattedCompareAt})`;
  }

  return formattedPrice;
}
