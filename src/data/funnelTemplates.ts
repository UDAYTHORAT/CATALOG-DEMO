// ─── FUNNELLINK — INTERACTIVE CONVERSION ENGINE TEMPLATES ───
// Each template: ONE guided journey · Smart defaults · Dynamic results
// Psychology: Scarcity · Authority · Social Proof · Reciprocity · Loss Aversion

export interface ResultRule {
  condition: { questionIndex: number; optionIndex: number };
  title: string;
  description: string;
  ctaLabel: string;
  ctaType: 'whatsapp' | 'link' | 'booking';
  badge?: string;
}

export type FunnelAdLanding = {
  kicker: string;
  title: string;
  subtitle: string;
  ratingLine: string;
  categories: { key: string; label: string; icon: string; matchers: string[] }[];
  trustBullets: string[];
  ctaHelper: string;
  ctaLabel: string;
  mapEmbedUrl?: string;
  mapAddress?: string;
};

export type FunnelAdProducts = {
  headerKicker: string;
  slots: { badge: string; ctaLabel: string; highlight: boolean; benefitsFallback: string[] }[];
  extraTitle: string;
  extraSubtitle: string;
};

export type FunnelAdWhatsApp = {
  messageWithProduct: string;
  messageNoProduct: string;
};

export type FunnelAdTheme = {
  background: string;
  text: string;
  card: string;
  accent: string;
  accentText: string;
  whatsapp: string;
};

export interface FunnelTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  theme: 'ethereal' | 'bubbly' | 'onyx' | 'kinetic' | 'minimal' | 'dark';
  icon: string;
  accentColor: string;
  bgGradient: string;
  description?: string;

  // Step 1: Create Experience
  hero: {
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaColor: string;
  };
  goal: 'leads' | 'sell' | 'booking';

  // Trust Bar
  trust: {
    title: string;
    items: string[];
    stats: string; // e.g. "1000+ users"
  };
  testimonial: { text: string; author: string; role: string };

  // Step 2: Ask Questions
  questions: {
    id: string;
    question: string;
    type: 'choice' | 'budget';
    options: string[];
    icon: string;
  }[];

  // Step 3: Show Result (Dynamic Logic)
  resultDefault: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaType: 'whatsapp' | 'link' | 'booking';
  };
  resultRules: ResultRule[];

  // Urgency Block
  urgency: {
    headline: string;
    subtext: string;
    type: 'slots' | 'timer' | 'offer';
  };

  // Enquiry Fields
  enquiryFields: { id: string; label: string; placeholder: string; type: string; required: boolean }[];
  enquiryHeadline: string;
  enquirySub: string;

  // Meta
  description: string;
  features: string[];
  stats: { convRate: string; avgLeads: string };
  badge?: string;

  // FunnelAd (Link-in-bio style) config
  funnelad?: {
    landing: FunnelAdLanding;
    products: FunnelAdProducts;
    whatsapp: FunnelAdWhatsApp;
    theme: FunnelAdTheme;
  };

  // FAQ
  faq: { q: string; a: string }[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDUSTRY AUTO-FILL PRESETS
// When user selects industry, these auto-fill everything
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface IndustryPreset {
  id: string;
  name: string;
  icon: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  goal: 'leads' | 'sell' | 'booking';
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  { id: 'doctor', name: 'Doctor / Clinic', icon: '🩺', headline: 'Find the right treatment in 60 seconds', subheadline: 'Answer 3 quick questions. We\'ll match you with the right doctor today.', ctaLabel: 'Start Assessment', goal: 'booking' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛍️', headline: 'Find your perfect product — in 20 seconds', subheadline: 'Tell us what you like. We\'ll show the one thing you actually need.', ctaLabel: 'Start Shopping', goal: 'sell' },
  { id: 'fitness', name: 'Fitness / Gym', icon: '💪', headline: 'Get your personalized fitness plan', subheadline: 'Tell us your goals. We\'ll create a plan that actually works.', ctaLabel: 'Start Plan', goal: 'leads' },
  { id: 'coach', name: 'Coach / Consultant', icon: '🧠', headline: 'Find out if coaching is right for you', subheadline: 'Take a 30-second quiz and unlock your personalized growth path.', ctaLabel: 'Start Quiz', goal: 'booking' },
  { id: 'realestate', name: 'Real Estate', icon: '🏠', headline: 'Find your dream home in minutes', subheadline: 'Answer a few questions and get matched with properties you\'ll love.', ctaLabel: 'Start Search', goal: 'leads' },
  { id: 'restaurant', name: 'Restaurant / Cafe', icon: '🍽️', headline: 'Discover your perfect dining experience', subheadline: 'Tell us your vibe and we\'ll recommend the perfect meal.', ctaLabel: 'Explore Menu', goal: 'sell' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MASTER TEMPLATES — Doctor & E-Commerce
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MASTER_TEMPLATES: FunnelTemplate[] = [
  // ━━━ 0. FUNNELAD ELITE (FURNITURE) ━━━
  {
    id: 'funnelad-elite-furniture',
    name: 'Elite Furniture Sales Funnel',
    category: 'Furniture',
    industry: 'ecommerce',
    theme: 'minimal',
    icon: '🛋',
    accentColor: '#111111',
    bgGradient: 'from-amber-50 via-orange-50 to-stone-100',
    badge: '🚀 ELITE',
    description: "How it helps: Converts window shoppers into WhatsApp buyers instantly. Why use it: Eliminates friction, showcases products with high intent. Where to use: Instagram ads, bio links, WhatsApp broadcasts.",

    hero: {
      headline: 'Tap → See → Chat → Buy',
      subheadline: 'The fastest product link that converts clicks into WhatsApp buyers.',
      ctaLabel: 'Launch FunnelAd',
      ctaColor: '#111111',
    },
    goal: 'sell',

    trust: {
      title: 'Built for instant decisions',
      items: ['3 products only', 'Direct WhatsApp', 'No forms or filters', 'Fast delivery ready'],
      stats: '500+ orders closed on chat',
    },
    testimonial: {
      text: 'We stopped losing leads on our website. This link now closes deals daily.',
      author: 'Aditya K.',
      role: 'Furniture Retailer',
    },

    questions: [],

    resultDefault: {
      title: 'Ready to chat',
      description: 'Your customer is one tap away from WhatsApp.',
      ctaLabel: 'Open WhatsApp',
      ctaType: 'whatsapp',
    },
    resultRules: [],

    urgency: {
      headline: 'Close the deal in minutes',
      subtext: 'Most buyers respond within 10 minutes on WhatsApp.',
      type: 'offer',
    },

    enquiryFields: [],
    enquiryHeadline: 'WhatsApp first, always',
    enquirySub: 'No forms. No friction.',

    description: 'Elite FunnelAd link that turns taps into WhatsApp conversations. Built for furniture stores and high-ticket catalogs.',
    features: ['Landing + Category Tap', '3-Product Stack', 'Prefilled WhatsApp', 'Theme Builder Ready'],
    stats: { convRate: '38%', avgLeads: '240/mo' },

    faq: [
      { q: 'Can I change the categories?', a: 'Yes, edit labels and keywords in the builder.' },
      { q: 'How many products should I show?', a: 'Exactly 3. That keeps decision speed high.' },
      { q: 'Does it work for other industries?', a: 'Yes, swap the copy and categories.' },
    ],

    funnelad: {
      landing: {
        kicker: 'Urban Living.',
        title: 'Urban Living Furniture.',
        subtitle: 'Find the right furniture in seconds\nGet best price directly on WhatsApp',
        ratingLine: '4.8 rating • 1000+ happy homes',
        categories: [
          { key: 'sofas', label: 'Luxury Sofas', icon: '🛋', matchers: ['sofa', 'sofas', 'seating', 'lounge'] },
          { key: 'beds', label: 'Solid Wood Beds', icon: '🛏', matchers: ['bed', 'beds', 'bedroom'] },
          { key: 'dining', label: 'Dining & Decor', icon: '🍽', matchers: ['dining', 'table', 'dining set', 'chair'] },
        ],
        trustBullets: ['Factory Direct Prices', 'Handcrafted in Jodhpur', 'Premium Sheesham Wood'],
        ctaHelper: '⚡ No browsing. Just pick & chat',
        ctaLabel: 'Visit Our Studio',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.119140935912!2d77.08581027549615!3d28.5060447757342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1945c5896ec1%3A0xc6a82708dd2b75a4!2sCyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1709212000000!5m2!1sen!2sin',
        mapAddress: 'Plot 42, Sector 43, Golf Course Road, Gurgaon'
      },
      products: {
        headerKicker: 'Tap → See → Chat → Buy',
        slots: [
          {
            badge: '🔥 Best Value for Your Home',
            ctaLabel: 'Get Factory Price',
            highlight: true,
            benefitsFallback: ['Perfect for modern homes', 'High-end Sheesham finish'],
          },
          {
            badge: '⭐ Most Popular Choice',
            ctaLabel: 'Get Best Price',
            highlight: false,
            benefitsFallback: ['Ideal for family living', 'Premium comfort foam'],
          },
          {
            badge: '💎 Premium Edition',
            ctaLabel: 'Get Price',
            highlight: false,
            benefitsFallback: ['Exclusive luxury design', 'Heritage Jodhpur craft'],
          },
        ],
        extraTitle: 'Not sure which one is right?',
        extraSubtitle: 'Chat with our experts for best deal & options',
      },
      whatsapp: {
        messageWithProduct:
          "Hi Urban Living,\n\nI’m interested in this:\n\n• Product: {product_name}\n\nPlease share:\n1. Best final factory price\n2. Customization (size, fabric, wood)\n3. Delivery time to my city",
        messageNoProduct:
          "Hi Urban Living,\n\nI’m interested in a {category}.\n\nPlease share:\n1. Final factory price\n2. Available customization options\n3. Delivery time to my city",
      },
      theme: {
        background: '#f7f3ec',
        text: '#161616',
        card: '#ffffff',
        accent: '#111111',
        accentText: '#ffffff',
        whatsapp: '#25d366',
      },
    },
  },
];

export const TEMPLATE_CATEGORIES = ['All', ...Array.from(new Set(MASTER_TEMPLATES.map(t => t.category)))];

// ━━━ GOAL OPTIONS ━━━
export const GOAL_OPTIONS = [
  { id: 'leads', label: 'Get Leads', icon: '📋', description: 'Capture contact info' },
  { id: 'sell', label: 'Sell Product', icon: '🛒', description: 'Drive purchases' },
  { id: 'booking', label: 'Book Appointment', icon: '📅', description: 'Schedule meetings' },
] as const;
