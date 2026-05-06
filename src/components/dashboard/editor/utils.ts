import type { Funnel } from '@/app/actions/funnels';
import type {
  CategoryItem,
  Content,
  HeroData,
  LocationData,
  ProductsData,
  Section,
  SectionId,
  TestimonialsData,
  WhatsAppData,
} from './types';

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&w=1200&q=80';
export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

const sanitizeLegacyText = (value: unknown): unknown => {
  if (typeof value === 'string') {
    let sanitized = value
      .replaceAll('\u00e2\u201a\u00b9', 'Rs ')
      .replaceAll('\u00e2\u20ac\u201d', '-')
      .replaceAll('\u00e2\u0161\u00a1', '')
      .replaceAll('\u00f0\u0178\u201d\u00a5', 'Best Value')
      .replaceAll('\u00e2\u00ad\u0090', 'Most Popular')
      .replaceAll('\u00f0\u0178\u2019\u017d', 'Premium');
    
    // IMAGE MIGRATION: Update broken/old Unsplash IDs to "Best of the Best" ones
    if (sanitized.includes('unsplash.com')) {
      sanitized = sanitized
        // Dining & Decor Category Fix
        .replace('photo-1588854337236-6889d631faa8', 'photo-1595515106969-1ce29566ff1c')
        .replace('photo-1616486338812-3dadae4b4ace', 'photo-1595515106969-1ce29566ff1c')
        // Old logo or hero fixes
        .replace('photo-1618220179428-22790b46a0eb', 'photo-1583847268964-b28dc2f51ac9');
    }

    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeLegacyText);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, childValue]) => [key, sanitizeLegacyText(childValue)])
    );
  }

  return value;
};

const defaultHeroData: HeroData = {
  tagline: 'Urban Living Furniture.',
  subTagline: 'Solid Wood Furniture at Factory Prices. Handcrafted in Jodhpur, delivered directly to your home.',
  heroCtaText: 'Find Your Perfect Furniture',
  heroCtaSubtext: 'No browsing. Just pick & chat',
};

const defaultCategories: CategoryItem[] = [
  {
    id: 'sofas',
    label: 'Luxury Sofas',
    tagline: 'Lounges & Recliners',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'beds',
    label: 'Solid Wood Beds',
    tagline: 'Master Bedroom Collections',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'dining',
    label: 'Dining & Decor',
    tagline: 'Factory-Direct Sets',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
  },
];

const defaultProducts: ProductsData = {
  products: [
    // SOFAS
    {
      id: 'p1',
      category_id: 'sofas',
      name: 'Modo Sheesham L-Shape',
      priceLabel: 'Rs 45,000',
      retailLabel: 'Rs 65,000',
      savingsLabel: 'Save 31%',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Only 2 frames ready',
      delivery: 'Delivery: 7-10 Days',
      rating: 4.8,
    },
    {
      id: 'p2',
      category_id: 'sofas',
      name: 'Velvet Royal Chesterfield',
      priceLabel: 'Rs 58,500',
      retailLabel: 'Rs 82,000',
      savingsLabel: 'Save 28%',
      image: 'https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Selling fast',
      delivery: 'Delivery: 5-7 Days',
      rating: 4.9,
    },
    {
      id: 'p3',
      category_id: 'sofas',
      name: 'Scandinavian 3-Seater',
      priceLabel: 'Rs 24,000',
      retailLabel: 'Rs 35,000',
      savingsLabel: 'Save 31%',
      image: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Limited Stock',
      delivery: 'Delivery: 5-7 Days',
      rating: 4.7,
    },
    // BEDS
    {
      id: 'p4',
      category_id: 'beds',
      name: 'Grand King Upholstered',
      priceLabel: 'Rs 38,000',
      retailLabel: 'Rs 55,000',
      savingsLabel: 'Save 30%',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      urgency: 'Direct from Factory',
      delivery: 'Delivery: 10-12 Days',
      rating: 4.8,
    },
    {
      id: 'p5',
      category_id: 'beds',
      name: 'Storage Queen Bed',
      priceLabel: 'Rs 32,500',
      retailLabel: 'Rs 48,000',
      savingsLabel: 'Save 32%',
      image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Most Popular',
      delivery: 'Delivery: 7-10 Days',
      rating: 4.9,
    },
    {
      id: 'p6',
      category_id: 'beds',
      name: 'Rustic Sheesham Original',
      priceLabel: 'Rs 28,000',
      retailLabel: 'Rs 42,000',
      savingsLabel: 'Save 33%',
      image: 'https://images.unsplash.com/photo-1616594111718-3617300c1448?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Jodhpur Special',
      delivery: 'Delivery: 12-15 Days',
      rating: 4.7,
    },
    // DINING
    {
      id: 'p7',
      category_id: 'dining',
      name: 'Marble Top 6-Seater',
      priceLabel: 'Rs 65,000',
      retailLabel: 'Rs 95,000',
      savingsLabel: 'Save 31%',
      image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Premium Finish',
      delivery: 'Delivery: 10-12 Days',
      rating: 4.9,
    },
    {
      id: 'p8',
      category_id: 'dining',
      name: 'Compact Walnut 4-Seater',
      priceLabel: 'Rs 22,500',
      retailLabel: 'Rs 32,000',
      savingsLabel: 'Save 29%',
      image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Space Saver',
      delivery: 'Delivery: 5-7 Days',
      rating: 4.8,
    },
    {
      id: 'p9',
      category_id: 'dining',
      name: 'Grand 8-Seater Banquet',
      priceLabel: 'Rs 85,000',
      retailLabel: 'Rs 1,20,000',
      savingsLabel: 'Save 29%',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1db208fa0?auto=format&fit=crop&w=1200&q=80',
      urgency: 'Exclusive Design',
      delivery: 'Delivery: 15-20 Days',
      rating: 5.0,
    },
  ],
  preTitle: 'Select Your Style',
  title: '', // Dynamic by default
  subTitle: 'Tap any product to get factory-direct pricing on WhatsApp.',
};

const defaultTestimonials: TestimonialsData = {
  testimonials: [
    {
      id: 't1',
      name: 'Rahul S.',
      city: 'Mumbai',
      text: 'Saved Rs 35k compared to local retail stores. The Sheesham wood feels extremely premium.',
      rating: 5,
    },
    {
      id: 't2',
      name: 'Priya K.',
      city: 'Bangalore',
      text: 'Loved the fact that they sent me photos straight from their Jodhpur factory before shipping. 10/10.',
      rating: 5,
    },
    {
      id: 't3',
      name: 'Ananya M.',
      city: 'Delhi',
      text: 'Incredible design and flawless finish. The buying experience over WhatsApp was so simple.',
      rating: 5,
    },
  ],
};

const defaultLocation: LocationData = {
  experienceCenterName: 'Urban Living Studio',
  experienceCenterAddress: 'Plot 42, Sector 43, Golf Course Road, Gurgaon',
  mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
  mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.119140935912!2d77.08581027549615!3d28.5060447757342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1945c5896ec1%3A0xc6a82708dd2b75a4!2sCyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1709212000000!5m2!1sen!2sin',
};

const defaultWhatsAppData: WhatsAppData = {
  title: 'Get Best Price Instantly',
  subTitle: 'Chat directly with factory & save more',
  ctaText: 'Chat Directly with Factory',
  welcomeMessage: 'Hi Urban Living,\n\nI’m planning to buy furniture.\n\nHere’s what I’m looking for:\n• Requirement: {category}\n\nPlease share:\n1. Final factory price\n2. Available customization options\n3. Delivery time to my pincode',
  productInquiryText: 'Hi Urban Living,\n\nI’m interested in this:\n\n• Product: {product_name}\n\nPlease share:\n1. Best final factory price\n2. Customization (size, fabric, wood)\n3. Delivery time to my city',
};

export const createDefaultSections = (): Section[] => [
  { id: 'content', type: 'hero', enabled: true, data: defaultHeroData },
  { 
    id: 'categories', 
    type: 'categories', 
    enabled: true, 
    data: { 
      categories: defaultCategories,
      title: 'What are you looking for?',
      subTitle: 'Select a category to view our factory-direct collections.',
      helpTitle: 'Need help?',
      helpSubTitle: 'Chat directly with factory'
    } 
  },
  { id: 'products', type: 'products', enabled: true, data: defaultProducts },
  { id: 'testimonials', type: 'testimonials', enabled: true, data: defaultTestimonials },
  { id: 'location', type: 'location', enabled: true, data: defaultLocation },
  { id: 'whatsapp', type: 'whatsapp', enabled: true, data: defaultWhatsAppData },
];

export const createInitialContent = (funnel: Funnel): Content => {
  const saved = funnel.story_mode_data?.[0]?.content as Content | undefined;
  const defaults = createDefaultSections();

  if (saved && Array.isArray(saved.sections)) {
    const content = sanitizeLegacyText(saved) as Content;
    
    // Ensure 'whatsapp' section exists for existing funnels
    if (!content.sections.find(s => s.id === 'whatsapp')) {
      const whatsappDefault = defaults.find(s => s.id === 'whatsapp');
      if (whatsappDefault) {
        content.sections.push(whatsappDefault);
      }
    }
    
    return content;
  }

  return {
    storeName: 'Urban Living',
    logoUrl: 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=300&q=80',
    whatsappNumber: '919876543210',
    sections: defaults,
  };
};

export const getSectionData = <T,>(content: Content, id: SectionId, fallback: T): T => {
  return (content.sections.find((section) => section.id === id)?.data as T | undefined) ?? fallback;
};

export const formatProductPrice = (price?: number | null) => {
  if (!price || Number.isNaN(price)) return 'Rs 0';
  return `Rs ${price.toLocaleString('en-IN')}`;
};
