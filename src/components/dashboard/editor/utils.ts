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
  trustBarTop1: '1200+ Homes',
  trustBarBottom1: 'Delivered',
  trustBarTop2: '4.9★',
  trustBarBottom2: 'Client Rating',
  trustBarTop3: 'Factory Direct',
  trustBarBottom3: 'Pricing',
};

const defaultRealEstateHeroData: HeroData = {
  tagline: 'Own The Skyline',
  subTagline: 'Private sea-facing residences with panoramic views.',
  heroCtaText: 'Explore Residences',
  heroCtaSubtext: 'Get floor plan on WhatsApp',
  trustBadges: ['Vastu Compliant', '87% Reserved', 'EV Parking', 'School 5 Mins', 'Sea Link · 4 min', 'Freehold'],
  heroBadge: 'Exclusive Release',
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
      delivery: '7-10 Days',
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
      delivery: '5-7 Days',
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
      delivery: '5-7 Days',
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
      facing: 'West Facing',
      description: 'Efficiently designed 2-bedroom residence with an open-plan living space and a private balcony.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=80',
      specifications: [
        { label: 'Configuration', value: '2 Bed, 2 Bath' },
        { label: 'Status', value: 'Ready to Move' },
        { label: 'Vastu', value: '100% Compliant' },
        { label: 'Floor Level', value: 'High-Rise (25th+)' },
        { label: 'Parking', value: '1 Covered Spot' },
        { label: 'Maintenance', value: '₹8,500/Month' }
      ],
      rooms: [
        // Base Rooms (Drawn First)
        { id: 'deck', type: 'balcony', name: 'Sunset Balcony', area: '450 sqft', img: '/2BHK/2BHK-BALCONY.png', details: ['Outdoor seating space', 'Clear glass railing'], direction: {x:0,y:0,scale:1}, x: 5, y: 5, w: 90, h: 15, label: 'SUNSET BALCONY (WEST ↑)' },
        { id: 'living', type: 'living', name: 'Living & Dining Area', area: '850 sqft', img: '/2BHK/2BHK-LIVING.png', details: ['Large gathering space', 'Premium marble flooring'], direction: {x:0,y:0,scale:1}, x: 5, y: 20, w: 90, h: 30, label: 'LIVING + DINING' },
        { id: 'kitchen', type: 'kitchen', name: 'Modern Kitchen', area: '320 sqft', img: '/2BHK/2BHK-KITCHEN.png', details: ['Large island counter', 'Built-in premium appliances'], direction: {x:0,y:0,scale:1}, x: 41, y: 50, w: 54, h: 15, label: 'KITCHEN' },
        { id: 'master', type: 'bedroom', name: 'Master Bedroom', area: '550 sqft', img: '/2BHK/2BHK-MASTER BEDROOM.png', details: ['Soundproof windows', 'Wooden wall paneling'], direction: {x:0,y:0,scale:1}, x: 47, y: 75, w: 48, h: 20, label: 'MASTER BEDROOM' },
        { id: 'bed2', type: 'bedroom', name: 'Guest Bedroom', area: '340 sqft', img: '/2BHK/2BHK-GUEST-ROOM.png', details: ['Attached bathroom', 'Large full-height windows'], direction: {x:0,y:0,scale:1}, x: 5, y: 75, w: 42, h: 20, label: 'GUEST BEDROOM' },
        
        // Connectors & Foyers
        { id: 'entrance', type: 'entrance', name: 'Entrance Lobby', area: '180 sqft', img: '/2BHK/2BHK-ENTRY.png', details: ['Wide double-door entry', 'Wall display area'], direction: {x:0,y:0,scale:1}, x: 5, y: 50, w: 36, h: 15, label: '↓ ENTRANCE' },
        { id: 'corridor', type: 'corridor', name: 'Main Passage', area: '210 sqft', img: '/2BHK/2BHK -PRIVATE PASSAGE.png', details: ['Extra hidden storage', 'Bright ceiling lights'], direction: {x:0,y:0,scale:1}, x: 5, y: 65, w: 63, h: 10, label: 'PASSAGE' },
        
        // Overlapping Sub-Rooms (Carved out, Drawn on Top)
        { id: 'utility', type: 'utility', name: 'Utility Area', area: '80 sqft', img: '/2BHK/2BHK-UTILITY.png', details: ['Washing machine space', 'Separate maid access'], direction: {x:0,y:0,scale:1}, x: 80, y: 50, w: 15, h: 15, label: 'UTILITY' },
        { id: 'powder', type: 'bathroom', name: 'Powder Room', area: '60 sqft', img: '/2BHK/2BHK-POWDER.png', details: ['Guest toilet', 'Modern washbasin'], direction: {x:0,y:0,scale:1}, x: 68, y: 65, w: 27, h: 10, label: 'POWDER ROOM' },
        { id: 'mbath', type: 'bathroom', name: 'Master Bathroom', area: '120 sqft', img: '/2BHK/2BHK-MASTER BATHROOM.png', details: ['Large bathtub', 'Glass shower area'], direction: {x:0,y:0,scale:1}, x: 80, y: 75, w: 15, h: 10, label: 'MASTER BATH' },
        { id: 'mcloset', type: 'corridor', name: 'Walk-in Closet', area: '80 sqft', img: '/2BHK/2BHK-WALKING.png', details: ['Glass wardrobes', 'Lots of storage space'], direction: {x:0,y:0,scale:1}, x: 80, y: 85, w: 15, h: 10, label: 'CLOSET' },
        { id: 'bath2', type: 'bathroom', name: 'Guest Bathroom', area: '80 sqft', img: '/2BHK/2BHK-GUEST BATH.png', details: ['Modern mirror design', 'Premium shower fittings'], direction: {x:0,y:0,scale:1}, x: 5, y: 75, w: 10, h: 10, label: 'BATH' }
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
      facing: 'East Facing',
      description: 'Spacious 3-bedroom luxury apartment featuring panoramic city views, an expansive living area, and premium finishes.',
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=2400&q=80',
      specifications: [
        { label: 'Configuration', value: '3 Bed, 3 Bath, Balcony' },
        { label: 'Status', value: 'Ready to Move' },
        { label: 'Vastu', value: 'East-Facing Compliant' },
        { label: 'Ceiling Height', value: '10.5 ft Clearance' },
        { label: 'Floor Level', value: 'Premium Podium' },
        { label: 'Parking', value: '2 Covered Spots' }
      ],
      rooms: [
        // Base Rooms (Drawn First)
        { id: 'deck', type: 'balcony', name: 'Large Balcony', area: '450 sqft', img: '', details: ['Clear views', 'Space for outdoor dining'], direction: {x:0,y:0,scale:1}, x: 5, y: 5, w: 90, h: 15, label: 'BALCONY (WEST ↑)' },
        
        { id: 'living', type: 'living', name: 'Main Living Room', area: '650 sqft', img: '', details: ['High ceiling', 'Wide city views'], direction: {x:0,y:0,scale:1}, x: 5, y: 20, w: 55, h: 25, label: 'LIVING ROOM' },
        { id: 'dining', type: 'dining', name: 'Family Dining Area', area: '320 sqft', img: '', details: ['Space for big table', 'Bright lighting'], direction: {x:0,y:0,scale:1}, x: 60, y: 20, w: 35, h: 25, label: 'DINING AREA' },
        
        // Connectors & Kitchen
        { id: 'entrance', type: 'entrance', name: 'Entrance Foyer', area: '150 sqft', img: '', details: ['Private entry', 'Welcoming design'], direction: {x:0,y:0,scale:1}, x: 5, y: 45, w: 25, h: 15, label: '↓ ENTRANCE' },
        { id: 'kitchen', type: 'kitchen', name: 'Open Kitchen', area: '350 sqft', img: '', details: ['Breakfast counter', 'Easy flow to dining'], direction: {x:0,y:0,scale:1}, x: 30, y: 45, w: 65, h: 15, label: 'KITCHEN' },
        
        { id: 'corridor', type: 'corridor', name: 'Main Corridor', area: '200 sqft', img: '', details: ['Bright hallway', 'Connecting all bedrooms'], direction: {x:0,y:0,scale:1}, x: 5, y: 60, w: 90, h: 10, label: 'CORRIDOR' },
        
        // Private Wing (Bedrooms)
        { id: 'bed2', type: 'bedroom', name: 'Kids / Guest Bedroom', area: '280 sqft', img: '', details: ['Study corner', 'Attached bathroom'], direction: {x:0,y:0,scale:1}, x: 5, y: 70, w: 25, h: 25, label: 'BEDROOM 2' },
        { id: 'master', type: 'bedroom', name: 'Master Bedroom', area: '450 sqft', img: '', details: ['Large windows', 'Big walk-in closet'], direction: {x:0,y:0,scale:1}, x: 30, y: 70, w: 40, h: 25, label: 'MASTER BEDROOM' },
        { id: 'bed3', type: 'bedroom', name: 'Third Bedroom', area: '280 sqft', img: '', details: ['Great city views', 'Comfortable seating space'], direction: {x:0,y:0,scale:1}, x: 70, y: 70, w: 25, h: 25, label: 'BEDROOM 3' },
        
        // Overlapping Sub-Rooms (Carved out, visually receded small boxes)
        { id: 'utility', type: 'utility', name: 'Utility Area', area: '60 sqft', img: '', details: ['Washing machine space'], direction: {x:0,y:0,scale:1}, x: 80, y: 45, w: 15, h: 10, label: 'UTILITY' },
        { id: 'powder', type: 'bathroom', name: 'Powder Room', area: '40 sqft', img: '', details: ['Guest toilet'], direction: {x:0,y:0,scale:1}, x: 80, y: 60, w: 15, h: 10, label: 'POWDER' },
        { id: 'mbath', type: 'bathroom', name: 'Master Bathroom', area: '80 sqft', img: '', details: ['Two washbasins', 'Spacious shower'], direction: {x:0,y:0,scale:1}, x: 55, y: 70, w: 15, h: 10, label: 'MASTER BATH' },
        { id: 'mcloset', type: 'corridor', name: 'Walk-in Closet', area: '60 sqft', img: '', details: ['Bright lighting', 'Lots of space'], direction: {x:0,y:0,scale:1}, x: 55, y: 80, w: 15, h: 10, label: 'CLOSET' },
        { id: 'bath2', type: 'bathroom', name: 'Attached Bathroom', area: '45 sqft', img: '', details: ['Inside the bedroom'], direction: {x:0,y:0,scale:1}, x: 5, y: 85, w: 10, h: 10, label: 'BATH' },
        { id: 'bath3', type: 'bathroom', name: 'Attached Bathroom', area: '45 sqft', img: '', details: ['Inside the bedroom'], direction: {x:0,y:0,scale:1}, x: 85, y: 85, w: 10, h: 10, label: 'BATH' }
      ]
    },
    {
      id: 'penthouse',
      category_id: 'luxury',
      name: '4 BHK Penthouse',
      priceLabel: '₹ 8.5 Cr',
      urgency: 'Last Unit Available',
      delivery: 'Possession: Q4 2025',
      dimensions: '3,200 sqft',
      facing: 'North-East Facing',
      description: 'Ultra-luxury penthouse with a private sky garden, a home theater lounge, and an exclusive glass library corridor.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80',
      specifications: [
        { label: 'Configuration', value: '4 Bed, 4 Bath, Terrace' },
        { label: 'Status', value: 'Under Construction' },
        { label: 'Vastu', value: 'North-East Entry' },
        { label: 'Elevator', value: 'Private Lift Lobby' },
        { label: 'Parking', value: '3 Dedicated Spaces' },
        { label: 'Maintenance', value: 'Concierge Included' }
      ],
      rooms: [
        // 1. The Sky Garden (West Light Experience)
        { id: 'deck', type: 'balcony', name: 'Terrace Garden', area: '600 sqft', img: '', details: ['Plants and greenery', 'Water feature'], direction: {x:0,y:0,scale:1}, x: 5, y: 5, w: 90, h: 15, label: 'TERRACE (WEST ↑)' },

        // 2. The Grand Social Axis
        { id: 'living', type: 'living', name: 'Main Living Room', area: '800 sqft', img: '', details: ['Huge seating area', 'TV and media setup'], direction: {x:0,y:0,scale:1}, x: 5, y: 20, w: 40, h: 25, label: 'LIVING ROOM' },
        { id: 'dining', type: 'dining', name: 'Large Dining Area', area: '450 sqft', img: '', details: ['Space for 8 people', 'Beautiful lighting'], direction: {x:0,y:0,scale:1}, x: 45, y: 20, w: 25, h: 25, label: 'DINING AREA' },
        { id: 'kitchen', type: 'kitchen', name: 'Spacious Kitchen', area: '450 sqft', img: '', details: ['Open counter design', 'Lots of storage cabinets'], direction: {x:0,y:0,scale:1}, x: 70, y: 20, w: 25, h: 25, label: 'KITCHEN' },

        // 3. Arrival Sequence & Service
        { id: 'bed4', type: 'bedroom', name: 'Guest Bedroom', area: '350 sqft', img: '', details: ['Close to the main door', 'Very private'], direction: {x:0,y:0,scale:1}, x: 5, y: 45, w: 30, h: 15, label: 'GUEST BEDROOM' },
        { id: 'niche', type: 'corridor', name: 'Display Area', area: '150 sqft', img: '', details: ['Wooden divider', 'Space for artwork'], direction: {x:0,y:0,scale:1}, x: 35, y: 45, w: 10, h: 15, label: 'DISPLAY' },
        { id: 'entrance', type: 'entrance', name: 'Main Entrance Lobby', area: '300 sqft', img: '', details: ['Wide entry', 'Hidden ceiling lights'], direction: {x:0,y:0,scale:1}, x: 45, y: 45, w: 25, h: 15, label: '↓ MAIN ENTRANCE' },
        { id: 'spine', type: 'corridor', name: 'Service Corridor', area: '250 sqft', img: '', details: ['Hidden doors', 'Separate staff path'], direction: {x:0,y:0,scale:1}, x: 70, y: 45, w: 25, h: 15, label: 'SERVICE PATH' },

        // 4. Circulation
        { id: 'corridor', type: 'corridor', name: 'Glass Corridor', area: '400 sqft', img: '', details: ['Glass walls on one side', 'Very bright'], direction: {x:0,y:0,scale:1}, x: 5, y: 60, w: 90, h: 10, label: 'MAIN CORRIDOR' },

        // 5. Private Suites
        { id: 'bed2', type: 'bedroom', name: 'Second Master Bedroom', area: '400 sqft', img: '', details: ['Great outside views', 'Large attached bathroom'], direction: {x:0,y:0,scale:1}, x: 5, y: 70, w: 25, h: 25, label: 'BEDROOM 2' },
        { id: 'bed3', type: 'bedroom', name: 'Third Bedroom', area: '400 sqft', img: '', details: ['Premium styling', 'Very spacious'], direction: {x:0,y:0,scale:1}, x: 30, y: 70, w: 25, h: 25, label: 'BEDROOM 3' },
        { id: 'master', type: 'bedroom', name: 'Grand Master Bedroom', area: '750 sqft', img: '', details: ['Reading corner', 'Biggest room in house'], direction: {x:0,y:0,scale:1}, x: 55, y: 70, w: 40, h: 25, label: 'GRAND MASTER' },

        // Overlapping Sub-Rooms (Carved out, receding)
        { id: 'mcloset', type: 'corridor', name: 'Large Walk-in Closet', area: '150 sqft', img: '', details: ['Island storage in middle', 'Dressing table area'], direction: {x:0,y:0,scale:1}, x: 80, y: 70, w: 15, h: 10, label: 'CLOSET' },
        { id: 'mbath', type: 'bathroom', name: 'Luxury Master Bathroom', area: '180 sqft', img: '', details: ['Big bathtub', 'Double shower space'], direction: {x:0,y:0,scale:1}, x: 80, y: 80, w: 15, h: 15, label: 'MASTER BATH' },
        
        { id: 'powder', type: 'bathroom', name: 'Powder Room', area: '40 sqft', img: '', details: ['Hidden door design'], direction: {x:0,y:0,scale:1}, x: 35, y: 45, w: 10, h: 5, label: 'POWDER' },
        
        { id: 'bath4', type: 'bathroom', name: 'Guest Bathroom', area: '60 sqft', img: '', details: ['Easy access from room'], direction: {x:0,y:0,scale:1}, x: 5, y: 45, w: 10, h: 10, label: 'BATH' },
        
        { id: 'staff', type: 'bedroom', name: 'Maid Room', area: '80 sqft', img: '', details: ['Separate back door entry'], direction: {x:0,y:0,scale:1}, x: 85, y: 45, w: 10, h: 10, label: 'MAID' },
        { id: 'utility', type: 'utility', name: 'Utility & Laundry', area: '80 sqft', img: '', details: ['Washing machine setup'], direction: {x:0,y:0,scale:1}, x: 70, y: 45, w: 15, h: 10, label: 'UTILITY' },

        { id: 'bath2', type: 'bathroom', name: 'Attached Bathroom', area: '60 sqft', img: '', details: ['Glass shower area'], direction: {x:0,y:0,scale:1}, x: 5, y: 85, w: 10, h: 10, label: 'BATH' },
        { id: 'bath3', type: 'bathroom', name: 'Attached Bathroom', area: '60 sqft', img: '', details: ['Glass shower area'], direction: {x:0,y:0,scale:1}, x: 30, y: 85, w: 10, h: 10, label: 'BATH' }
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
      text: 'Looks even better in person.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      detail1: 'Delivered in 9 Days',
      detail2: 'Custom walnut finish',
    },
    {
      id: 't2',
      name: 'Priya K.',
      city: 'Bangalore',
      text: 'Exactly what we wanted.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
      detail1: 'Delivered in 11 Days',
      detail2: 'Solid Sheesham Wood',
    },
    {
      id: 't3',
      name: 'Ananya M.',
      city: 'Delhi',
      text: 'Flawless quality & finish.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      detail1: 'Delivered in 7 Days',
      detail2: 'Teak wood & bouclé fabric',
    },
  ],
};

const defaultRealEstateTestimonials: TestimonialsData = {
  testimonials: [
    {
      id: 'rt1',
      name: 'Vikram S.',
      city: 'Pune',
      text: 'The ventilation and privacy were the main reasons we booked.',
      rating: 5,
    },
    {
      id: 'rt2',
      name: 'Meera A.',
      city: 'Mumbai',
      text: 'My parents loved the sunlight in the living room.',
      rating: 5,
    },
    {
      id: 'rt3',
      name: 'Rahul D.',
      city: 'Bangalore',
      text: 'The floor plan felt much bigger in person.',
      rating: 5,
    },
  ],
};

const defaultLocation: LocationData = {
  experienceCenterName: 'Urban Living Studio',
  experienceCenterAddress: 'Plot 42, Sector 43, Golf Course Road, Gurgaon',
  mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
  mapLink: 'https://www.google.com/maps?q=Cyber%20City%2C%20Gurugram%2C%20Haryana&output=embed',
};

const defaultRealEstateLocation: LocationData = {
  experienceCenterName: 'Aurelia Sky Gallery',
  experienceCenterAddress: 'Worli Sea Face · Mumbai',
  mapImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  mapLink: 'https://www.google.com/maps?q=Baner%20Pune&output=embed',
  connectivity: [
    { label: "Highway", time: "3 min" },
    { label: "Hospital", time: "5 min" },
    { label: "Airport", time: "25 min" },
    { label: "Metro", time: "8 min" },
  ],
};

const defaultWhatsAppData: WhatsAppData = {
  title: 'Get Best Price Instantly',
  subTitle: 'Chat directly with factory & save more',
  ctaText: 'Chat Directly with Factory',
  welcomeMessage: 'Hi {store_name},\n\nI’m planning to buy furniture.\n\nHere’s what I’m looking for:\n• Requirement: {category}\n\nPlease share:\n1. Final factory price\n2. Available customization options\n3. Delivery time to my pincode',
  productInquiryText: 'Hi {store_name},\n\nI’m interested in this:\n\n• Product: {product_name}\n\nPlease share:\n1. Best final factory price\n2. Customization (size, fabric, wood)\n3. Delivery time to my city',
};

const defaultRealEstateWhatsAppData: WhatsAppData = {
  title: 'Chat',
  subTitle: 'Visit',
  ctaText: 'Explore',
  welcomeMessage: 'Hi {company_name},\n\nI am interested in a luxury residence.\n\nPreference: {category}\n\nPlease share:\n1. Available units and pricing\n2. Floor plans and sizes\n3. Possession timeline',
  productInquiryText: 'Hi {company_name},\n\nI want details for {residence}.\n\nPlease share:\n1. Latest pricing and floor plan\n2. Availability and view options\n3. Site visit slots',
  conciergeOptions: [
    { 
      label: 'Explore Availability', 
      action: 'explore current availability',
      message: 'Hello {company_name},\n\nI would like to explore current availability for the {residence}.\n\nPlease share the next steps.' 
    },
    { 
      label: 'Request Floorplans', 
      action: 'request detailed floorplans',
      message: 'Hello {company_name},\n\nI would like to request detailed floorplans for the {residence}.\n\nPlease share the next steps.' 
    },
    { 
      label: 'Arrange Viewing', 
      action: 'arrange a private viewing',
      message: 'Hello {company_name},\n\nI would like to arrange a private viewing for the {residence}.\n\nPlease share the next steps.' 
    },
    { 
      label: 'Investment Details', 
      action: 'discuss investment details',
      message: 'Hello {company_name},\n\nI would like to discuss investment details for the {residence}.\n\nPlease share the next steps.' 
    },
  ],
  visitOptions: ['Morning Tour', 'Sunset Viewing', 'Weekend Visit'],
  conciergeMessageTemplate: 'Hello {company_name},\n\nI would like to {intent} for the {residence}.\n\nPlease share the next steps.',
  visitMessageTemplate: 'Hello {company_name},\n\nI would like to arrange a {tour_type} for the {residence}.\n\nPlease let me know your availability.',
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

  let content: Content;

  if (saved && Array.isArray(saved.sections)) {
    content = sanitizeLegacyText(saved) as Content;
    
    // Ensure all default sections exist for existing funnels
    defaults.forEach((defSection) => {
      if (!content.sections.find((s) => s.id === defSection.id)) {
        content.sections.push(structuredClone(defSection));
      }
    });
  } else {
    content = {
      storeName: isRealEstate ? 'Aurelia Residences' : 'Urban Living',
      logoUrl: isRealEstate
        ? 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=300&q=80'
        : '',
      whatsappNumber: '919876543210',
      sections: defaults,
    };
  }

  // Clean up product delivery field to remove redundant prefix
  const productsSection = content.sections.find((s) => s.id === 'products');
  if (productsSection?.data?.products && Array.isArray(productsSection.data.products)) {
    productsSection.data.products.forEach((prod: any) => {
      if (prod && typeof prod.delivery === 'string') {
        prod.delivery = prod.delivery.replace(/^delivery:\s*/i, '');
      }
    });
  }

  return content;
};

export const getSectionData = <T,>(content: Content, id: SectionId, fallback: T): T => {
  return (content.sections.find((section) => section.id === id)?.data as T | undefined) ?? fallback;
};

export const formatProductPrice = (price?: number | null) => {
  if (!price || Number.isNaN(price)) return 'Rs 0';
  return `Rs ${price.toLocaleString('en-IN')}`;
};
