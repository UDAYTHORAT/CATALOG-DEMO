import type { Variants } from 'framer-motion';

export interface FunnelProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  image_url_2: string | null;
  category: string | null;
  dimensions: string | null;
}

export type LandingCategory = {
  key: string; label: string; icon: string; matchers: string[];
};
export type LandingConfig = {
  kicker: string; title: string; subtitle: string; ratingLine: string;
  categories: LandingCategory[]; trustBullets: string[];
  ctaHelper: string; ctaLabel: string;
  mapEmbedUrl?: string; mapAddress?: string;
};
export type ProductSlotConfig = {
  badge: string; ctaLabel: string; highlight: boolean; benefitsFallback: string[];
};
export type ProductsConfig = {
  headerKicker: string; slots: ProductSlotConfig[];
  extraTitle: string; extraSubtitle: string;
};
export type WhatsAppConfig = {
  messageWithProduct: string; messageNoProduct: string;
};
export type ThemeConfig = {
  background: string; text: string; card: string;
  accent: string; accentText: string; whatsapp: string;
};
export type Step = 'landing' | 'categories' | 'products' | 'details';

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const ease = [0.25, 1, 0.35, 1] as const;
export const pageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  in: { opacity: 1, x: 0, transition: { duration: 0.5, ease, staggerChildren: 0.06, delayChildren: 0.05 } },
  out: (dir: number) => ({ opacity: 0, x: dir < 0 ? 24 : -24, transition: { duration: 0.25 } }),
};
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  in: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export const defaultLanding: LandingConfig = {
  kicker: 'FunnelAd', title: 'Your Store', subtitle: 'Find the right product in seconds\nGet best price directly on WhatsApp',
  ratingLine: '4.8 rating • 500+ customers',
  categories: [
    { key: 'sofas', label: 'Sofas', icon: '🛋', matchers: ['sofa', 'sofas'] },
    { key: 'beds', label: 'Beds', icon: '🛏', matchers: ['bed', 'beds'] },
    { key: 'dining', label: 'Dining', icon: '🍽', matchers: ['dining', 'table'] },
  ],
  trustBullets: ['Premium quality', 'Fast delivery', 'Best price guarantee'],
  ctaHelper: 'Get best deal on WhatsApp', ctaLabel: 'Chat Now',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.119140935912!2d77.08581027549615!3d28.5060447757342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1945c5896ec1%3A0xc6a82708dd2b75a4!2sCyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1709212000000!5m2!1sen!2sin',
  mapAddress: 'Cyber City, Gurugram, Haryana'
};

export const defaultProducts: ProductsConfig = {
  headerKicker: 'Tap → See → Chat → Buy',
  slots: [
    { badge: '🔥 Best Value', ctaLabel: 'Get Best Price', highlight: true, benefitsFallback: ['Perfect for modern homes', 'High comfort'] },
    { badge: '⭐ Most Popular', ctaLabel: 'Get Price', highlight: false, benefitsFallback: ['Ideal for families', 'Easy maintenance'] },
    { badge: '💎 Premium', ctaLabel: 'Get Price', highlight: false, benefitsFallback: ['High-end finish', 'Premium look'] },
  ],
  extraTitle: 'Not sure which one is right?', extraSubtitle: 'Chat on WhatsApp for best deal & options',
};

export const defaultWhatsApp: WhatsAppConfig = {
  messageWithProduct: "Hi, I'm interested in a {category}.\n\nI liked the {product}.\n\nPlease share best price, available options, and delivery details.",
  messageNoProduct: "Hi, I'm interested in a {category}.\n\nPlease share best price, available options, and delivery details.",
};

export const defaultTheme: ThemeConfig = {
  background: '#F5F2EC', text: '#2C2A28', card: '#ffffff',
  accent: '#D47A5A', accentText: '#ffffff', whatsapp: '#25d366',
};

export function getBenefits(product: FunnelProduct | undefined, fallback: string[]): string[] {
  if (!product?.description) return fallback;
  const parts = product.description.replace(/\r/g, '').split(/\n|•/).map(s => s.trim()).filter(Boolean);
  return parts.length >= 2 ? parts.slice(0, 3) : fallback;
}
