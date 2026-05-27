export type SectionId = 'content' | 'categories' | 'products' | 'testimonials' | 'location' | 'whatsapp';
export type TabId = 'store' | 'layouts' | SectionId;
export type PreviewMode = 'mobile' | 'tablet' | 'desktop';

export interface CategoryItem {
  id: string;
  label: string;
  tagline: string;
  image: string;
}

export interface ProductBenefit {
  title: string;
  desc: string;
}

export interface ProductItem {
  id: string;
  category_id: string;
  name: string;
  priceLabel: string;
  retailLabel?: string;
  savingsLabel?: string;
  image: string;
  image2?: string;
  urgency: string;
  delivery: string;
  rating?: number;
  description?: string;
  benefits?: ProductBenefit[];
  tier?: 'best_value' | 'most_popular' | 'premium';
  dimensions?: string;
  material?: string;
  finish?: string;
  rooms?: any[];
  compassAngle?: number;
  sunSide?: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
  automotive?: string;
  spaceCtaText?: string;
  facing?: string;
  specifications?: { label: string; value: string }[];
  propertyDetailsTitle?: string;
  ownershipLabel?: string;
  ownership?: string;
  deliveryLabel?: string;
  automotiveLabel?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  image?: string;
  detail1?: string;
  detail2?: string;
}

export interface HeroData {
  tagline: string;
  subTagline: string;
  heroCtaText: string;
  heroCtaSubtext: string;
  trustBarTop1?: string;
  trustBarBottom1?: string;
  trustBarTop2?: string;
  trustBarBottom2?: string;
  trustBarTop3?: string;
  trustBarBottom3?: string;
  heroImage?: string;
  // Real estate specific fields
  trustBadges?: string[];
  heroBadge?: string;
  ownership?: string;
  possession?: string;
  startingPrice?: string;
  status?: string;
  automotive?: string;
  spaceCtaText?: string;
  emotionalTitle?: string;
  emotionalBody?: string;
  emotionalImage?: string;
}

export interface CategoriesData {
  categories: CategoryItem[];
  title?: string;
  subTitle?: string;
  helpTitle?: string;
  helpSubTitle?: string;
}

export interface ProductsData {
  products: ProductItem[];
  preTitle?: string;
  title?: string;
  subTitle?: string;
}

export interface TestimonialsData {
  testimonials: TestimonialItem[];
}

export interface LocationData {
  experienceCenterName: string;
  experienceCenterAddress: string;
  mapImage: string;
  mapLink: string;
}

export interface WhatsAppData {
  title: string;
  subTitle: string;
  ctaText: string;
  welcomeMessage: string;
  productInquiryText: string;
}

export type Section =
  | { id: 'content'; type: 'hero'; data: HeroData; enabled: boolean }
  | { id: 'categories'; type: 'categories'; data: CategoriesData; enabled: boolean }
  | { id: 'products'; type: 'products'; data: ProductsData; enabled: boolean }
  | { id: 'testimonials'; type: 'testimonials'; data: TestimonialsData; enabled: boolean }
  | { id: 'location'; type: 'location'; data: LocationData; enabled: boolean }
  | { id: 'whatsapp'; type: 'whatsapp'; data: WhatsAppData; enabled: boolean };

export interface Content {
  sections: Section[];
  storeName: string;
  logoUrl: string;
  whatsappNumber: string;
}
