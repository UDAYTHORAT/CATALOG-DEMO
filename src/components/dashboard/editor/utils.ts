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
export const REAL_ESTATE_TEMPLATE_ID = 'funnelad-elite-real-estate';

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

const defaultRealEstateHeroData: HeroData = {
  tagline: 'Own The Skyline.',
  subTagline: 'Private sky decks. Resort living. Starting Rs 2.9 Cr.',
  heroCtaText: 'See Available Residences',
  heroCtaSubtext: 'Get floor plan on WhatsApp',
  trustBadges: ['Freehold', '87% Reserved', 'EV Parking', 'Gaggenau', 'Sea Link · 4 min', 'Private Ownership'],
  heroBadge: 'Superstructure Complete',
  ownership: 'Freehold',
  possession: 'Q4 2025',
  startingPrice: '₹ 6.2 Cr',
  status: 'Ready to Move',
};

const defaultCategories: CategoryItem[] = [
  {
    id: 'sofas',
    label: 'SOFA',
    tagline: 'Short collection tagline.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  },
];

const defaultRealEstateCategories: CategoryItem[] = [
  {
    id: 'family',
    label: 'Family Living',
    tagline: 'Spacious 3-4 BHK homes',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'investment',
    label: 'Investment Property',
    tagline: 'High ROI and rental yield',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'luxury',
    label: 'Luxury Lifestyle',
    tagline: 'Skyline views and private decks',
    image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'weekend',
    label: 'Weekend Escape',
    tagline: 'Resort feel, city access',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rental',
    label: 'Rental Income',
    tagline: 'Fully managed leasing',
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=1200&q=80',
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
  ],
  preTitle: 'Select Your Style',
  title: '', // Dynamic by default
  subTitle: 'Tap any product to get factory-direct pricing on WhatsApp.',
};;

const defaultRealEstateProducts: ProductsData = {
  products: [
    {
      id: 'compact',
      category_id: 'family',
      name: '2 BHK Compact',
      priceLabel: '₹ 2.9 Cr',
      urgency: '5 Units Left',
      delivery: 'Ready to Move',
      dimensions: '1,200 sqft',
      description: 'Efficiently designed 2-bedroom residence with an open-plan living space and a private balcony.',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2400&q=80',
      rooms: [
        {
          id: 'living',
          name: 'Living Room',
          area: '320 sqft',
          img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
          details: ['Engineered wood floors', 'Full-height windows', 'Open kitchen view'],
          direction: { x: 0, y: 0, scale: 1 },
          x: 6, y: 8, w: 56, h: 44,
          label: 'Living'
        },
        {
          id: 'kitchen',
          name: 'Kitchen',
          area: '140 sqft',
          img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80',
          details: ['Modular kitchen', 'Quartz countertop', 'Built-in chimney'],
          direction: { x: -40, y: 0, scale: 1.02 },
          x: 6, y: 56, w: 36, h: 36,
          label: 'Kitchen'
        },
        {
          id: 'master',
          name: 'Master Bedroom',
          area: '240 sqft',
          img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80',
          details: ['Ensuite bathroom', 'Walk-in wardrobe', 'Balcony access'],
          direction: { x: 40, y: 20, scale: 1.04 },
          x: 46, y: 56, w: 48, h: 36,
          label: 'Master'
        },
        {
          id: 'bedroom2',
          name: 'Bedroom 2',
          area: '180 sqft',
          img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=2400&q=80',
          details: ['City view', 'Built-in storage', 'Attached bathroom'],
          direction: { x: 30, y: 10, scale: 1 },
          x: 66, y: 8, w: 28, h: 44,
          label: 'Bed 2'
        }
      ]
    },
    {
      id: 'signature',
      category_id: 'luxury',
      name: '3 BHK Signature',
      priceLabel: '₹ 6.2 Cr',
      urgency: '3 Units Remaining',
      delivery: 'Possession: Q4 2025',
      dimensions: '1,850 sqft',
      description: 'Sea-facing living volume with private deck and architectural light wells.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
      rooms: [
        {
          id: 'living',
          name: 'Living Room',
          area: '450 sqft',
          img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
          details: ['Italian travertine floors', 'Acoustic glass', 'Skyline-facing deck'],
          direction: { x: 0, y: 0, scale: 1 },
          x: 6, y: 8, w: 56, h: 44,
          label: 'Living'
        },
        {
          id: 'kitchen',
          name: 'Kitchen',
          area: '210 sqft',
          img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80',
          details: ['Gaggenau appliances', 'Calacatta marble island', 'Concealed pantry'],
          direction: { x: -40, y: 0, scale: 1.02 },
          x: 6, y: 56, w: 36, h: 36,
          label: 'Kitchen'
        },
        {
          id: 'master',
          name: 'Master Suite',
          area: '320 sqft',
          img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80',
          details: ['Floor-to-ceiling glazing', 'Walk-in wardrobe', 'Private terrace'],
          direction: { x: 40, y: 20, scale: 1.04 },
          x: 46, y: 56, w: 48, h: 36,
          label: 'Master'
        },
        {
          id: 'deck',
          name: 'Private Deck',
          area: '180 sqft',
          img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80',
          details: ['Cantilevered terrace', 'Sea breeze orientation', 'Teak decking'],
          direction: { x: 0, y: -40, scale: 0.98 },
          x: 66, y: 8, w: 28, h: 44,
          label: 'Deck'
        }
      ]
    },
    {
      id: 'penthouse',
      category_id: 'luxury',
      name: '4 BHK Penthouse',
      priceLabel: '₹ 8.5 Cr',
      urgency: 'Last Unit Available',
      delivery: 'Possession: Q4 2025',
      dimensions: '2,140 sqft',
      description: 'Full-floor residence with private plunge pool and 360° skyline.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80',
      rooms: [
        {
          id: 'living',
          name: 'Living Room',
          area: '450 sqft',
          img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
          details: ['Italian travertine floors', 'Acoustic glass', 'Skyline-facing deck'],
          direction: { x: 0, y: 0, scale: 1 },
          x: 6, y: 6, w: 60, h: 38,
          label: 'Living'
        },
        {
          id: 'kitchen',
          name: 'Kitchen',
          area: '210 sqft',
          img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80',
          details: ['Gaggenau appliances', 'Calacatta marble island', 'Concealed pantry'],
          direction: { x: -40, y: 0, scale: 1.02 },
          x: 70, y: 6, w: 24, h: 38,
          label: 'Kitchen'
        },
        {
          id: 'master',
          name: 'Master Suite',
          area: '320 sqft',
          img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80',
          details: ['Floor-to-ceiling glazing', 'Walk-in wardrobe', 'Private terrace'],
          direction: { x: 40, y: 20, scale: 1.04 },
          x: 6, y: 48, w: 44, h: 44,
          label: 'Master'
        },
        {
          id: 'guest',
          name: 'Guest Suite',
          area: '240 sqft',
          img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=2400&q=80',
          details: ['Independent entry', 'Ensuite bath', 'City views'],
          direction: { x: 30, y: 10, scale: 1 },
          x: 54, y: 48, w: 22, h: 44,
          label: 'Guest'
        },
        {
          id: 'deck',
          name: 'Private Deck',
          area: '180 sqft',
          img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80',
          details: ['Cantilevered terrace', 'Sea breeze orientation', 'Teak decking'],
          direction: { x: 0, y: -40, scale: 0.98 },
          x: 80, y: 48, w: 14, h: 44,
          label: 'Deck'
        }
      ]
    }
  ],
  preTitle: 'Handpicked For Your Lifestyle',
  title: '',
  subTitle: 'Tap any residence to get the floor plan and pricing on WhatsApp.',
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

const defaultRealEstateTestimonials: TestimonialsData = {
  testimonials: [
    {
      id: 'rt1',
      name: 'Vikram S.',
      city: 'Pune',
      text: 'We booked within a week. The tour felt premium and the view sealed the decision.',
      rating: 5,
    },
    {
      id: 'rt2',
      name: 'Meera A.',
      city: 'Mumbai',
      text: 'The sales gallery experience was effortless. WhatsApp updates and floor plans were instant.',
      rating: 5,
    },
    {
      id: 'rt3',
      name: 'Rahul D.',
      city: 'Bangalore',
      text: 'We chose the investment unit after seeing the rental projections. Smoothest purchase ever.',
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

const defaultRealEstateLocation: LocationData = {
  experienceCenterName: 'Aurelia Sky Gallery',
  experienceCenterAddress: 'Tower 3, Baner Hills, Pune',
  mapImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  mapLink: 'https://www.google.com/maps?q=Baner%20Pune&output=embed',
};

const defaultWhatsAppData: WhatsAppData = {
  title: 'Get Best Price Instantly',
  subTitle: 'Chat directly with factory & save more',
  ctaText: 'Chat Directly with Factory',
  welcomeMessage: 'Hi {store_name},\n\nI’m planning to buy furniture.\n\nHere’s what I’m looking for:\n• Requirement: {category}\n\nPlease share:\n1. Final factory price\n2. Available customization options\n3. Delivery time to my pincode',
  productInquiryText: 'Hi {store_name},\n\nI’m interested in this:\n\n• Product: {product_name}\n\nPlease share:\n1. Best final factory price\n2. Customization (size, fabric, wood)\n3. Delivery time to my city',
};

const defaultRealEstateWhatsAppData: WhatsAppData = {
  title: 'Get Floor Plan Instantly',
  subTitle: 'Luxury advisors reply within minutes',
  ctaText: 'Get Floor Plan on WhatsApp',
  welcomeMessage: 'Hi {store_name},\n\nI am interested in a luxury residence.\n\nPreference: {category}\n\nPlease share:\n1. Available units and pricing\n2. Floor plans and sizes\n3. Possession timeline',
  productInquiryText: 'Hi {store_name},\n\nI want details for {product_name}.\n\nPlease share:\n1. Latest pricing and floor plan\n2. Availability and view options\n3. Site visit slots',
};

export const createDefaultSections = (templateId?: string): Section[] => {
  const isRealEstate = templateId === REAL_ESTATE_TEMPLATE_ID;

  return [
    { id: 'content', type: 'hero', enabled: true, data: isRealEstate ? defaultRealEstateHeroData : defaultHeroData },
    {
      id: 'categories',
      type: 'categories',
      enabled: true,
      data: {
        categories: isRealEstate ? defaultRealEstateCategories : defaultCategories,
        title: isRealEstate ? 'What kind of home are you looking for?' : 'What are you looking for?',
        subTitle: isRealEstate
          ? 'Select your lifestyle and we will personalize the residences.'
          : 'Select a category to view our factory-direct collections.',
        helpTitle: isRealEstate ? 'Need a private tour?' : 'Need help?',
        helpSubTitle: isRealEstate ? 'Chat with a luxury advisor' : 'Chat directly with factory',
      },
    },
    { id: 'products', type: 'products', enabled: true, data: isRealEstate ? defaultRealEstateProducts : defaultProducts },
    { id: 'testimonials', type: 'testimonials', enabled: true, data: isRealEstate ? defaultRealEstateTestimonials : defaultTestimonials },
    { id: 'location', type: 'location', enabled: true, data: isRealEstate ? defaultRealEstateLocation : defaultLocation },
    { id: 'whatsapp', type: 'whatsapp', enabled: true, data: isRealEstate ? defaultRealEstateWhatsAppData : defaultWhatsAppData },
  ];
};

export const createInitialContent = (funnel: Funnel): Content => {
  const saved = funnel.story_mode_data?.[0]?.content as Content | undefined;
  const templateId = funnel.story_mode_data?.[0]?.templateId as string | undefined;
  const defaults = createDefaultSections(templateId);
  const isRealEstate = templateId === REAL_ESTATE_TEMPLATE_ID;

  if (saved && Array.isArray(saved.sections)) {
    const content = sanitizeLegacyText(saved) as Content;
    
    // Ensure all default sections exist for existing funnels
    defaults.forEach((defSection) => {
      if (!content.sections.find((s) => s.id === defSection.id)) {
        content.sections.push(structuredClone(defSection));
      }
    });
    
    return content;
  }

  return {
    storeName: isRealEstate ? 'Aurelia Residences' : 'Urban Living',
    logoUrl: isRealEstate
      ? 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=300&q=80',
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
