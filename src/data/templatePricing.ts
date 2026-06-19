// Template pricing configuration
// Amounts are in PAISE (1 INR = 100 paise)

export const TEMPLATE_PRICING: Record<string, { price: number; priceDisplay: string; validity: number }> = {
  'funnelad-elite-furniture': {
    price: 100,       // Rs 699
    priceDisplay: '₹1',
    validity: 30,       // days
  },
  'funnelad-elite-real-estate': {
    price: 149900,      // Rs 1,499
    priceDisplay: '₹1,499',
    validity: 30,
  },
  'funnelad-elite-cafe': {
    price: 39900,       // Rs 399
    priceDisplay: '₹399',
    validity: 30,
  },
};

export function getTemplatePrice(templateId: string) {
  return TEMPLATE_PRICING[templateId] || { price: 69900, priceDisplay: '₹699', validity: 30 };
}
