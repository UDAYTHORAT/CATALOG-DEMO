'use client';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, ArrowRight, MessageCircle, MessageSquare,
  Star, MapPin, Quote, ExternalLink, Coffee,
  CheckCircle2, Clock, Map, X, CalendarDays, User
} from 'lucide-react';
import { motion, AnimatePresence, type Variants, useScroll, useTransform, useSpring } from 'framer-motion';
import { createLead } from '@/app/actions/leads';

// ============================================
// 📂 HIGH-CONVERTING DATA STRUCTURES
// ============================================
type Category = { id: string; label: string; image: string; tagline: string; };
export type FunnelProduct = {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
  image_url_2?: string | null;
  category?: string | null;
  category_id?: string;
  priceLabel?: string;
  image?: string;
  benefits?: string[];
  rating?: number;
  urgency?: string; // Used for "Chef's Special" or "Limited"
  delivery?: string; // Used for Preparation time or Calories
  tier?: 'best_value' | 'most_popular' | 'premium';
  ingredients?: string;
  dietary?: string; // "Vegan", "Gluten-Free"
};

type Product = {
  id: string; category_id: string; name: string;
  priceLabel: string; image: string; image2?: string;
  description?: string; benefits?: string[];
  rating?: number; urgency?: string; delivery?: string;
  tier?: 'best_value' | 'most_popular' | 'premium';
  ingredients?: string;
  dietary?: string;
};

type Testimonial = {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  image?: string;
  detail1?: string;
  detail2?: string;
};

type FunnelContent = {
  storeName: string;
  logoUrl: string;
  tagline: string;
  subTagline: string;
  whatsappNumber: string;
  announcementText: string;
  heroCtaText: string;
  heroCtaSubtext: string;
  experienceCenterName: string;
  experienceCenterAddress: string;
  mapImage: string;
  mapLink: string;
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
  categoriesStepTitle?: string;
  categoriesStepSubTitle?: string;
  bottomCtaTitle?: string;
  bottomCtaSubTitle?: string;
  sections?: Array<{ id?: string; data?: Partial<FunnelContent> }>;
};

type TemplateProps = {
  funnel: {
    id?: string;
    welcome_title?: string | null;
    welcome_description?: string | null;
    story_mode_data?: Array<{ content?: Partial<FunnelContent> }>;
  };
  store?: {
    id?: string;
    name?: string | null;
    logo_url?: string | null;
    whatsapp_number?: string | null;
  };
  products?: FunnelProduct[];
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: 'content' | 'categories' | 'products' | 'testimonials' | 'location' | 'menu') => void;
  activeSectionId?: string;
};

const springConfig = { type: "spring", damping: 30, stiffness: 160, mass: 0.9 } as const;

const pageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 25 : -25 }),
  in: { 
    opacity: 1, 
    x: 0, 
    transition: { ...springConfig, staggerChildren: 0.08, delayChildren: 0.05 } 
  },
  out: (dir: number) => ({ 
    opacity: 0, 
    x: dir < 0 ? 25 : -25, 
    transition: { duration: 0.35, ease: "easeOut" } 
  }),
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 25, scale: 0.97 },
  in: { opacity: 1, y: 0, scale: 1, transition: springConfig },
};

type Step = "landing" | "recommendations" | "details" | "reservation";

const buildMapEmbedUrl = (mapLink?: string, address?: string) => {
  const link = (mapLink || '').trim().replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const addr = (address || '').trim();
  
  if (link.includes('pb=') || link.includes('/embed')) return link;
  if (link.includes('output=embed')) return link.replace('www.google.com/maps?', 'maps.google.com/maps?');

  let query = '';
  if (link) {
    if (link.includes('/place/')) {
      const exactMatch = link.match(/!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (exactMatch) return `https://www.google.com/maps?q=${exactMatch[1]},${exactMatch[2]}&z=20&output=embed`;
      const placeMatch = link.match(/\/place\/([^\/]+)/);
      if (placeMatch && placeMatch[1]) query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    } else if (link.includes('q=')) {
      const match = link.match(/[?&]q=([^&]+)/);
      if (match && match[1]) query = decodeURIComponent(match[1]);
    }
  }

  if (!query) query = addr;
  if (!query) return '';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
};

const buildDirectionsUrl = (address?: string, mapLink?: string) => {
  // Decode HTML entities that may have leaked into stored URLs
  const link = (mapLink || '').trim()
    .replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const addr = (address || '').trim();

  if (link) {
    // 1. If it's a direct place URL or has a CID, use it entirely unchanged to preserve the Place ID and entity data
    if (link.includes('/place/') || link.includes('cid=')) {
      return link;
    }

    // If it's a standard embed/pb/output=embed URL, try to extract q= or coordinates
    if (link.includes('q=')) {
      const match = link.match(/[?&]q=([^&]+)/);
      if (match && match[1]) {
        return `https://www.google.com/maps/search/?api=1&query=${match[1]}`;
      }
    }
    
    if (link.includes('pb=')) {
      const nameMatch = link.match(/!2s([^!&]+)/);
      const exactMatch = link.match(/!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
      const featureIdMatch = link.match(/!1s([^!&]+)!2s/);

      // Best: If we have the exact Google Maps feature ID, we can open the place directly
      if (featureIdMatch && featureIdMatch[1]) {
        return `https://www.google.com/maps/place/data=!4m2!3m1!1s${featureIdMatch[1]}`;
      }

      // Better Fallback: Name + Exact Coordinates
      if (nameMatch && nameMatch[1] && exactMatch) {
        return `https://www.google.com/maps/search/${nameMatch[1]}/@${exactMatch[1]},${exactMatch[2]},17z`;
      }
      
      // Fallback: Name only
      if (nameMatch && nameMatch[1]) {
        return `https://www.google.com/maps/search/?api=1&query=${nameMatch[1]}`;
      }

      // Fallback: Exact marker coordinates only
      if (exactMatch) {
        return `https://www.google.com/maps/search/?api=1&query=${exactMatch[1]},${exactMatch[2]}`;
      }
    }

    const atMatch = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return `https://www.google.com/maps/search/?api=1&query=${atMatch[1]},${atMatch[2]}`;
    }

    // If it doesn't look like an embed, use it directly (e.g. short maps.app.goo.gl URLs)
    const isEmbedOnly = link.includes('/embed') || link.includes('output=embed');
    if (!isEmbedOnly) {
      return link;
    }
  }

  // Fallback to address text
  if (addr) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  }
  
  return 'https://www.google.com/maps';
};

function TiltProductCard({ product, i, isMobileMode }: { product: Product; i: number; isMobileMode: boolean }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobileMode) return; // Disable tilt effect on mobile view for better performance and touch handling
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-12px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * (i + 1), duration: 0.8 }}
      ref={ref as any}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="bg-white rounded-[28px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group h-full flex flex-col transition-all duration-300"
      style={{ perspective: 1200 }}
    >
      <div className="h-72 w-full overflow-hidden relative shrink-0">
        {product.tier === 'most_popular' && (
          <span className="absolute top-4 left-4 bg-[#D94A4A] text-[#F4F0EB] text-[9px] font-bold px-3 py-1.5 rounded-full z-10 tracking-[0.2em] uppercase shadow-lg">
            Best Seller
          </span>
        )}
        <span className="absolute top-4 right-4 z-10 text-[#F4F0EB] text-[10px] uppercase tracking-[0.25em] font-bold drop-shadow">
          0{i + 1}
        </span>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            style={{ filter: "saturate(1.05)" }}
          />
        ) : (
          <div className="w-full h-full bg-[#E8E1D5]/50 flex items-center justify-center">
            <Coffee size={48} className="text-[#3A2211]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A2211]/40 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="p-7 flex flex-col flex-1 justify-between">
        <div>
          <div className={`flex justify-between gap-2 mb-3 ${isMobileMode ? 'flex-col items-start' : 'flex-col md:flex-row md:items-start md:gap-4'}`}>
            <h3 className="font-serif italic font-semibold text-xl sm:text-2xl text-[#3A2211] leading-tight">{product.name}</h3>
            <span className="font-serif font-bold text-lg sm:text-xl text-[#D94A4A] whitespace-nowrap">{product.priceLabel}</span>
          </div>
          <div className="w-full h-px bg-[#3A2211]/10 mb-4" />
          <p className="text-[12px] leading-relaxed tracking-wide text-[#3A2211]/60 font-medium line-clamp-3">
            {product.description || product.ingredients || 'Crafted fresh daily with the finest ingredients.'}
          </p>
        </div>
      </div>
    </motion.article>
  );
}


export default React.memo(function EliteCafeTemplate({ 
  funnel, store, products: propProducts, isPreview = false, previewMode, onEditSection
}: TemplateProps) {
  const [step, setStep] = useState<Step>("landing");
  const [direction, setDirection] = useState(1);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [preOrderItems, setPreOrderItems] = useState<Record<string, number>>({});
  const [tablesLeft] = useState(() => Math.floor(Math.random() * 4) + 3);
  const [bookedToday] = useState(() => Math.floor(Math.random() * 80) + 230);

  const [windowWidth, setWindowWidth] = useState(1200);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileMode = previewMode === 'mobile' || (!isPreview && windowWidth < 640);

  const reviewsSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], [-80, 80]), { stiffness: 100, damping: 30 });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const reviewX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);


  
  const content = useMemo(() => {
    const savedContent = funnel.story_mode_data?.[0]?.content;
    const base = { ...(savedContent || {}) } as any;
    
    if (savedContent?.sections) {
      savedContent.sections.forEach((sec: any) => {
        if (sec.id === 'content') Object.assign(base, sec.data);
        else if (sec.id === 'categories') {
          base.categories = sec.data.categories;
          base.categoriesStepTitle = sec.data.title;
          base.categoriesStepSubTitle = sec.data.subTitle;
          base.helpTitle = sec.data.helpTitle;
          base.bottomCtaTitle = sec.data.helpTitle;
          base.bottomCtaSubTitle = sec.data.helpSubTitle;
        } else if (sec.id === 'products') {
          base.products = sec.data.products;
          base.preTitle = sec.data.preTitle;
          base.title = sec.data.title;
          base.subTitle = sec.data.subTitle;
        } else if (sec.id === 'testimonials') {
          base.testimonials = sec.data.testimonials;
        } else if (sec.id === 'location') {
          base.experienceCenterName = sec.data.experienceCenterName;
          base.experienceCenterAddress = sec.data.experienceCenterAddress;
          base.locationMapImage = sec.data.mapImage;
          base.locationMapLink = sec.data.mapLink;
          base.locationKicker = sec.data.kicker;
          base.locationTitle = sec.data.title;
          base.locationSubTitle = sec.data.subTitle;
          base.hoursMonFri = sec.data.hoursMonFri;
          base.hoursSatSun = sec.data.hoursSatSun;
        } else if (sec.id === 'whatsapp') {
          base.whatsapp = sec.data;
        }
      });
    }

    const normalizeImage = (value?: string | null, fallback?: string) => {
      if (typeof value === 'string' && value.trim().length > 0) return value;
      if (typeof fallback === 'string' && fallback.trim().length > 0) return fallback;
      return '';
    };

    const defaultLogo = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80";
    const defaultMap = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80";
    const defaultProductImage = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80";
    
    const defaultWhatsAppData = {
      title: 'Book a Table',
      subTitle: 'Reserve your spot today',
      ctaText: 'Reserve via WhatsApp',
      welcomeMessage: 'Hi {cafe_name},\n\nI would like to request a table reservation.\n\n1. Name: {name}\n2. Party Size: {party_size}\n3. Date: {date}\n4. Time: {time}',
      productInquiryText: 'Hi {cafe_name},\n\nI am interested in:\n• {product_name}\n\nCould you please confirm its availability today?',
    };

    const baseCategories = (base.categories && base.categories.length > 0) ? base.categories : [
      { id: "coffee", label: "Artisanal Coffee", tagline: "Freshly roasted beans", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80" },
      { id: "pastries", label: "Fresh Pastries", tagline: "Baked daily in-house", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80" },
      { id: "meals", label: "Hearty Meals", tagline: "Traditional recipes", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80" },
    ];

    const baseProducts = (propProducts && propProducts.length > 0) ? propProducts : (base.products && base.products.length > 0) ? base.products : [
      { id: 'p1', category_id: 'coffee', name: 'Artisanal Caramel Latte', priceLabel: '$4.20', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80', rating: 4.9, urgency: 'House Special', delivery: '5 mins', tier: 'premium', ingredients: 'Smooth espresso, steamed milk, sea salt caramel' },
      { id: 'p2', category_id: 'pastries', name: 'Fresh Butter Croissant', priceLabel: '$2.50', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', rating: 4.8, urgency: 'Bestseller', delivery: 'Ready', tier: 'most_popular' },
      { id: 'p3', category_id: 'meals', name: 'Avocado Sourdough Toast', priceLabel: '$6.50', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', rating: 4.9, urgency: 'Chef\'s Pick', delivery: '10-15 mins', tier: 'premium', dietary: 'Vegan available' },
    ];

    return {
      storeName: base.storeName || store?.name || "Kaffestuggu",
      logoUrl: normalizeImage(base.logoUrl, store?.logo_url || defaultLogo),
      tagline: base.tagline || funnel?.welcome_title || "The Oldest Eatery in Town.",
      subTagline: base.subTagline || funnel?.welcome_description || "Delicious traditional dishes served with generosity and rooted in long-standing culinary traditions.",
      whatsappNumber: base.whatsappNumber || store?.whatsapp_number || "919876543210",
      heroCtaText: base.heroCtaText || "Menu",
      heroCtaSubtext: base.heroCtaSubtext || "Dine-in, Takeaway & Delivery",
      heroSecondaryCtaText: base.heroSecondaryCtaText || "Reserve Table",
      trustBarTop1: base.trustBarTop1 || 'Est. 1914',
      trustBarBottom1: base.trustBarBottom1 || 'Tradition',
      trustBarTop2: base.trustBarTop2 || '100%',
      trustBarBottom2: base.trustBarBottom2 || 'Fresh Ingredients',
      trustBarTop3: base.trustBarTop3 || '4.9★',
      trustBarBottom3: base.trustBarBottom3 || 'Guest Rating',
      heroBadge: base.heroBadge || "always fresh",
      experienceCenterName: base.experienceCenterName || "Kaffestuggu Cafe",
      experienceCenterAddress: base.experienceCenterAddress || "Kjerkgata 18, 7374 Røros",
      mapImage: normalizeImage(base.locationMapImage, defaultMap),
      mapLink: base.locationMapLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1822.427773229605!2d11.383186216124707!3d62.57564798363717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466ce98a287c9dc9%3A0x6b198c66e92cbbd4!2sKaffestuggu!5e0!3m2!1sen!2sno!4v1709212000000!5m2!1sen!2sno",
      locationKicker: base.locationKicker || "Visit Us",
      locationTitle: base.locationTitle || "Come Say Hi",
      locationSubTitle: base.locationSubTitle || "We would love to serve you. Located right in the heart of Røros.",
      hoursMonFri: base.hoursMonFri || "07:00 - 18:00",
      hoursSatSun: base.hoursSatSun || "08:00 - 19:00",
      categories: baseCategories.map((category: Category) => ({
        ...category, image: normalizeImage(category.image, ''),
      })),
      products: baseProducts.map((product: any) => ({
        ...product,
        image: normalizeImage(product.image || product.image_url, ''),
        priceLabel: product.priceLabel || (product.price ? `Rs ${product.price.toLocaleString()}` : ''),
        urgency: product.urgency || 'Chef\'s Special',
        delivery: product.delivery || '15 mins',
      })),
      testimonials: (base.testimonials || [
        { id: "t1", name: "Sarah L.", city: "Tourist", text: "The most authentic and cozy cafe I've ever visited. The cinnamon rolls are out of this world!", rating: 5 },
        { id: "t2", name: "Magnus J.", city: "Local", text: "A weekend staple for our family. Hearty meals that taste exactly like my grandmother used to make.", rating: 5 },
        { id: "t3", name: "Elena V.", city: "Food Blogger", text: "Impeccable service, stunning rustic decor, and artisanal coffee that hits all the right notes.", rating: 5 },
      ]).slice(0, 3),
      categoriesStepTitle: base.categoriesStepTitle || "Feel the Vibe",
      categoriesStepSubTitle: base.categoriesStepSubTitle || "More than just coffee",
      bottomCtaTitle: base.bottomCtaTitle || "Need a table?",
      bottomCtaSubTitle: base.bottomCtaSubTitle || "Reserve instantly on WhatsApp",
      helpTitle: base.helpTitle || "Experience",
      preTitle: base.preTitle || "Our Signature",
      title: base.title || "",
      subTitle: base.subTitle || "Handpicked recommendations just for you.",
      whatsapp: base.whatsapp || defaultWhatsAppData,
      sections: savedContent?.sections || []
    };
  }, [funnel, store, propProducts]);

  const menuSection = useMemo(() => {
    return content.sections?.find((s: any) => s.id === 'menu');
  }, [content.sections]);

  const menuData = useMemo(() => {
    return menuSection?.data || {};
  }, [menuSection]);

  const menuTitle = menuData.title || 'Our Signature';
  const menuSubTitle = menuData.subTitle || 'Handpicked recommendations just for you.';

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return (content.products || []).find((p: Product) => p.id === selectedProductId) || null;
  }, [content.products, selectedProductId]);

  const preOrderTotal = useMemo(() => {
    return Object.entries(preOrderItems).reduce((sum, [id, qty]) => {
      const p = (content.products || []).find((pr: Product) => pr.id === id);
      if (!p || !qty) return sum;
      const price = parseInt(p.priceLabel.replace(/[^0-9]/g, '')) || 0;
      return sum + price * qty;
    }, 0);
  }, [preOrderItems, content.products]);

  const togglePreOrder = (productId: string) => {
    setPreOrderItems(prev => {
      const copy = { ...prev };
      if (copy[productId]) delete copy[productId];
      else copy[productId] = 1;
      return copy;
    });
  };

  const navigate = (newStep: Step, dir = 1) => {
    setDirection(dir);
    setStep(newStep);
    if (!isPreview) window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById('mobile-scroll-container')?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppCTA = async (intent_type: string, product: Product | null = null, reservationDetails?: string) => {
    const num = content.whatsappNumber?.replace(/\D/g, '') || '';
    if (!num) { alert('WhatsApp number not configured.'); return; }
    
    await createLead(funnel?.id || 'preview', store?.id || 'preview', 'Visitor', '', JSON.stringify({ type: 'cta_click', source: intent_type, productId: product?.id }), product?.id);

    const formatReservationText = (text: string) => {
      if (!text) return text;
      return text
        .replace(/(👤|[\?\uFFFD])\s*Name:/g, '1. Name:')
        .replace(/(👥|[\?\uFFFD])\s*Party\s*Size:/g, '2. Party Size:')
        .replace(/(📅|[\?\uFFFD])\s*Date:/g, '3. Date:')
        .replace(/(🕒|[\?\uFFFD])\s*Time:/g, '4. Time:');
    };

    let message = content.whatsapp?.welcomeMessage 
      ? formatReservationText(content.whatsapp.welcomeMessage).replaceAll('{store_name}', content.storeName || 'Cafe').replaceAll('{cafe_name}', content.storeName || 'Cafe')
      : `Hi ${content.storeName},\n\nI would like to request a table reservation.\n\n1. Name: {name}\n2. Party Size: {party_size}\n3. Date: {date}\n4. Time: {time}`;
    
    if (intent_type === "reservation_cta") {
      message = message
        .replaceAll('{name}', resName || 'Guest')
        .replaceAll('{party_size}', guests ? guests.toString() : '2')
        .replaceAll('{date}', resDate || 'Today')
        .replaceAll('{time}', resTime || '07:30 PM');
    }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const recommendedProducts = useMemo(() => {
    const activeProducts = content.products || [];
    if (!activeCategory) return activeProducts;
    const targetId = String(activeCategory.id).toLowerCase();
    const targetLabel = String(activeCategory.label).toLowerCase();
    const filtered = activeProducts.filter((p: Product) => {
      const pCatId = String(p.category_id || '').toLowerCase();
      return pCatId === targetId || pCatId === targetLabel;
    });
    return filtered.slice(0, 4);
  }, [activeCategory, content.products]);

  const nextProduct = useMemo(() => {
    if (!selectedProductId) return null;
    const list = recommendedProducts.length > 0 ? recommendedProducts : (content.products || []);
    if (list.length <= 1) return null;
    const currentIndex = list.findIndex((p: Product) => p.id === selectedProductId);
    if (currentIndex === -1) return null;
    const nextIndex = (currentIndex + 1) % list.length;
    return list[nextIndex];
  }, [selectedProductId, recommendedProducts, content.products]);

  const handleNextProductClick = useCallback((nextProd: Product) => {
    setSelectedProductId(nextProd.id);
    setActiveImageIndex(0);
    if (!isPreview) window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById('mobile-scroll-container')?.scrollTo({ top: 0, behavior: "smooth" });
  }, [isPreview]);

  const handleBack = () => {
    if (step === "details") navigate("recommendations", -1);
    else if (step === "recommendations") navigate("landing", -1);
    else if (step === "reservation") navigate("landing", -1);
  };

  const handleProductClick = (product: Product, event?: React.MouseEvent) => {
    if (isPreview && onEditSection) {
      onEditSection(step === 'recommendations' ? 'menu' : 'products');
    }
  };

  const handleEdit = (sectionId: 'content' | 'categories' | 'products' | 'testimonials' | 'location' | 'menu', event?: React.MouseEvent) => {
    if (!isPreview || !onEditSection) return false;
    event?.preventDefault();
    event?.stopPropagation();
    onEditSection(sectionId);
    return true;
  };

  const [guests, setGuests] = useState(2);
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("");
  const [resName, setResName] = useState("");
  const [formError, setFormError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  
  const timeScrollRef = React.useRef<HTMLDivElement>(null);
  const landingRef = React.useRef<HTMLDivElement>(null);
  
  const timeSlots = useMemo(() => [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", 
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", 
    "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM"
  ], []);

  const getLocalISODate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev.getMonth() >= today.getMonth() || prev.getFullYear() > today.getFullYear()) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isCurrentMonthThisMonth = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

  useEffect(() => {
    setResDate(getLocalISODate(today));
    setResTime("12:00 PM"); // Default time
  }, [today]);

  const displayTimeStr = resTime || "12:00 PM";
  const parseTimeForClock = (str: string) => {
      let hr = 12, min = 0;
      const match = str.match(/(\d{1,2})[:.]?(\d{2})?/);
      if (match) {
          hr = parseInt(match[1], 10) || 12;
          min = parseInt(match[2], 10) || 0;
      }
      if (hr >= 12) hr = hr % 12; 
      return { hr, min };
  };
  const { hr: clockHr, min: clockMin } = parseTimeForClock(displayTimeStr);
  const hrAngle = (clockHr * 30) + (clockMin * 0.5);
  const minAngle = clockMin * 6;

  const handleTimeScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const index = Math.max(0, Math.min(timeSlots.length - 1, Math.round(container.scrollTop / 50)));
      if (timeSlots[index] !== resTime) {
          setResTime(timeSlots[index]);
      }
  };

  const handleTimeType = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setResTime(val);
      const slotIndex = timeSlots.findIndex(t => t.toLowerCase().startsWith(val.toLowerCase().trim()));
      if(slotIndex !== -1 && timeScrollRef.current) {
          timeScrollRef.current.scrollTop = slotIndex * 50;
      }
  };

  return (
    <div className={`${isPreview ? 'min-h-full' : 'min-h-screen'} text-[#3A2211] font-sans relative flex flex-col w-full`} style={{ backgroundColor: '#F4F0EB' }}>
      
      <style dangerouslySetInnerHTML={{
        __html: `
         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Cinzel:wght@400..900&display=swap');
         .font-serif { font-family: 'Playfair Display', serif; }
         .font-sans { font-family: 'DM Sans', sans-serif; }
         .font-editorial { font-family: 'Cinzel', serif; }
         .font-cursive { font-family: 'Great Vibes', cursive; }
         .no-scrollbar::-webkit-scrollbar { display:none; }
         .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }

         .wave-text-fill {
           font-family: 'Playfair Display', serif;
           color: transparent;
           -webkit-text-stroke: 2px #FFFFFF;
           background-image: url("data:image/svg+xml,%3Csvg width='1000' height='1000' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,500 C250,420 250,580 500,500 C750,420 750,580 1000,500 L1000,1000 L0,1000 Z' fill='%233A2211'/%3E%3C/svg%3E");
           background-repeat: repeat-x;
           background-size: 200% 200%;
           background-position: 0% 0%;
           -webkit-background-clip: text;
           background-clip: text;
           animation: waveFill 4s cubic-bezier(0.3, 0, 0.2, 1) forwards;
         }
         @keyframes waveFill {
           0% { background-position: 0% 0%; -webkit-text-stroke-color: #FFFFFF; color: transparent; }
           70% { background-position: 100% 100%; -webkit-text-stroke-color: #FFFFFF; color: transparent; }
           100% { background-position: 150% 100%; -webkit-text-stroke-color: #3A2211; color: #3A2211; }
         }

         .float-slow { animation: floatAnim 6s ease-in-out infinite; }
         .float-slower { animation: floatAnim 8s ease-in-out infinite reverse; }
         @keyframes floatAnim {
           0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
           50% { transform: translateY(-15px) rotate(calc(var(--rot, 0deg) + 5deg)); }
         }

         .scroll-cards { display: flex; width: max-content; animation: scrollCards 40s linear infinite; }
         .scroll-cards:hover { animation-play-state: paused; }
         @keyframes scrollCards { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }

         .grain-overlay::after {
           content: ''; position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0.12;
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
         }

         @keyframes shimmerCta {
           0% { background-position: -200% 0; }
           100% { background-position: 200% 0; }
         }
         @keyframes shine {
            100% {
              left: 125%;
            }
          }
          .shining-sweep {
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%);
            transform: skewX(-25deg);
          }
          .group:hover .shining-sweep {
            animation: shine 0.75s ease-in-out;
          }

          .shimmer-cta {
           background: linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 37%, transparent 50%);
           background-size: 200% 100%;
           animation: shimmerCta 3s ease-in-out infinite;
         }

         @keyframes heroReveal {
           0% { clip-path: inset(100% 0 0 0); opacity: 0; }
           100% { clip-path: inset(0 0 0 0); opacity: 1; }
         }
         .hero-img-reveal { animation: heroReveal 1.6s cubic-bezier(0.77, 0, 0.175, 1) 0.3s both; }

         .scroll-fade-up { opacity: 0; transform: translateY(50px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
         .scroll-fade-up.show { opacity: 1; transform: translateY(0); }
       `}} />

      {/* HEADER */}
      <AnimatePresence>
        {step !== "landing" && (
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={springConfig}
            className={`${isPreview ? (isMobileMode ? 'absolute top-6' : 'absolute top-4') : 'fixed top-4 md:top-8'} w-full max-w-5xl mx-auto left-0 right-0 z-40 flex justify-between items-center px-5 pt-2 pb-2 pointer-events-none`}
          >
            <button
              onClick={handleBack}
              className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center pointer-events-auto hover:bg-white transition-all shadow-md active:scale-95 border border-[#E8E1D5] shrink-0 text-[#3A2211]"
            >
              <ChevronLeft strokeWidth={2} className="w-5 h-5" />
            </button>
            

            <div className="w-10 shrink-0" />
          </motion.header>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-0 w-full min-h-full min-w-0 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ========== 1. HERO LANDING (3 sec decision) ========== */}
          {step === "landing" && (
            <motion.section key="landing" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="w-full relative overflow-hidden" style={{ backgroundColor: '#C6A68A' }}>

              {/* ===== HERO SECTION ===== */}
              <div ref={landingRef} className="relative w-full min-h-[100dvh] flex flex-col grain-overlay">

                {/* Header removed as requested */}

                {/* Center Hero & CTA content grouped together to resolve spacing gap */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-30 px-4 w-full min-w-0 overflow-hidden pb-16 pt-4">

                  <div className="relative flex flex-col items-center select-none w-full mb-5">
                    <h1 className={`font-serif tracking-tight text-center relative z-20 leading-none w-full max-w-full break-words text-[#3A2211] font-bold ${isMobileMode ? 'text-[3.75rem]' : 'text-[3.75rem] sm:text-5xl md:text-7xl lg:text-8xl'}`}>{content.storeName}</h1>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                      className={`font-cursive text-[#D94A4A] -rotate-12 z-30 absolute ${isMobileMode ? 'top-[70%] right-2 text-4xl' : 'top-[72%] left-1/2 ml-24 md:ml-32 lg:ml-44 text-5xl md:text-6xl'}`} style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.2)' }}>
                      {content.heroBadge || 'always fresh'}
                    </motion.div>
                  </div>

                  {/* Subtagline - positioned immediately below the cafe name/badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="relative z-40 px-6 max-w-xl text-center mb-8 pointer-events-auto mt-4 sm:mt-5"
                  >
                    <p className="text-[15px] sm:text-[17px] text-center font-serif text-[#3A2211]/90 leading-relaxed px-4">
                      {content.tagline && (
                        <>
                          <strong className="font-bold text-[#3A2211]">{content.tagline}</strong>
                          <br className="hidden sm:block" />
                          <span className="sm:hidden"> </span>
                        </>
                      )}
                      {content.subTagline || 'Delicious traditional dishes served with generosity and rooted in long-standing culinary traditions.'}
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative z-40 w-full max-w-lg flex flex-col items-center pointer-events-auto"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center">
                      <motion.button 
                        onClick={() => { setActiveCategory(null); navigate("recommendations", 1); }} 
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="group relative overflow-hidden px-8 py-4 rounded-[50px] border border-[#D94A4A] text-[#D94A4A] hover:text-[#F4F0EB] uppercase tracking-[0.15em] text-xs font-bold transition-colors duration-300 w-full sm:w-64 backdrop-blur-sm cursor-pointer flex items-center justify-center gap-2.5 z-10"
                      >
                        {/* Background Slide Effect */}
                        <span className="absolute inset-0 w-full h-full bg-[#D94A4A] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 -z-10" />
                        <Coffee size={15} className="transition-transform duration-500 group-hover:rotate-12" />
                        <span>{content.heroCtaText || 'Menu'}</span>
                      </motion.button>

                      <motion.button 
                        onClick={() => navigate("reservation", 1)} 
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="group relative overflow-hidden px-8 py-4 rounded-[50px] bg-white text-[#3A2211] border border-white hover:border-[#3A2211] hover:text-[#F4F0EB] uppercase tracking-[0.15em] text-xs font-bold transition-all duration-300 w-full sm:w-64 cursor-pointer flex items-center justify-center gap-2.5 z-10 shadow-lg hover:shadow-xl"
                      >
                        {/* Background Slide Effect */}
                        <span className="absolute inset-0 w-full h-full bg-[#3A2211] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 -z-10" />
                        <CalendarDays size={15} className="transition-transform duration-500 group-hover:scale-110" />
                        <span>{content.heroSecondaryCtaText || 'Reserve Table'}</span>
                      </motion.button>
                    </div>
                    {content.heroCtaSubtext && (
                      <p className="text-center text-[10px] font-bold text-[#3A2211]/50 mt-5 tracking-[0.2em] uppercase">
                        {content.heroCtaSubtext}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Floating Draggable SVG Icons */}
                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                  {/* French Fries */}
                  <motion.div 
                    drag 
                    dragConstraints={landingRef}
                    dragElastic={0.4} 
                    dragMomentum={true}
                    whileHover={{ scale: 1.15 }}
                    whileDrag={{ scale: 1.28, zIndex: 50 }}
                    className="absolute top-[6%] left-[2%] sm:left-[5%] md:left-[8%] lg:left-[12%] w-16 h-16 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                  >
                    <svg className="w-full h-full stroke-[#EAB308] float-slow" style={{ '--rot': '-15deg' } as React.CSSProperties} fill="none" viewBox="0 0 100 100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 25,45 L 30,85 L 70,85 L 75,45 Z" />
                      <path d="M 20,45 L 80,45" />
                      <path d="M 32,15 L 32,45" />
                      <path d="M 42,10 L 42,45" />
                      <path d="M 52,18 L 52,45" />
                      <path d="M 62,22 L 62,45" />
                      <path d="M 36,25 L 44,45" />
                      <path d="M 50,25 L 58,45" />
                    </svg>
                  </motion.div>

                  {/* Gourmet Burger */}
                  <motion.div 
                    drag 
                    dragConstraints={landingRef}
                    dragElastic={0.4} 
                    dragMomentum={true}
                    whileHover={{ scale: 1.15 }}
                    whileDrag={{ scale: 1.28, zIndex: 50 }}
                    className="absolute top-[6%] right-[2%] sm:right-[5%] md:right-[8%] lg:right-[12%] w-18 h-18 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                  >
                    <svg className="w-full h-full stroke-[#D94A4A] float-slower" style={{ '--rot': '12deg' } as React.CSSProperties} fill="none" viewBox="0 0 100 100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 20,42 C 20,20 80,20 80,42 Z" />
                      <path d="M 15,50 Q 50,57 85,50" />
                      <path d="M 17,58 Q 50,64 83,58" strokeWidth="4.5" />
                      <path d="M 14,64 Q 25,69 35,64 Q 45,69 55,64 Q 65,69 75,64 Q 86,69 90,64" strokeWidth="1.5" />
                      <path d="M 22,72 C 22,84 78,84 78,72 Z" />
                    </svg>
                  </motion.div>

                  {/* Maki Sushi Roll */}
                  <motion.div 
                    drag 
                    dragConstraints={landingRef}
                    dragElastic={0.4} 
                    dragMomentum={true}
                    whileHover={{ scale: 1.15 }}
                    whileDrag={{ scale: 1.28, zIndex: 50 }}
                    className="absolute top-[32%] left-[2%] sm:left-[4%] md:left-[6%] lg:left-[9%] w-14 h-14 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                  >
                    <svg className="w-full h-full stroke-[#D94A4A] float-slow" style={{ '--rot': '18deg' } as React.CSSProperties} fill="none" viewBox="0 0 100 100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="50" cy="50" r="30" strokeWidth="4" />
                      <circle cx="50" cy="50" r="18" strokeWidth="1.5" strokeDasharray="3 2" />
                      <path d="M 44,44 Q 50,38 56,44 Q 56,56 44,56 Z" strokeWidth="2" />
                      <rect x="48" y="48" width="8" height="8" rx="2" strokeWidth="2" />
                      <circle cx="34" cy="40" r="1" fill="currentColor" />
                      <circle cx="66" cy="40" r="1" fill="currentColor" />
                      <circle cx="50" cy="68" r="1" fill="currentColor" />
                    </svg>
                  </motion.div>

                  {/* Covered Platter Dish (Cloche) */}
                  <motion.div 
                    drag 
                    dragConstraints={landingRef}
                    dragElastic={0.4} 
                    dragMomentum={true}
                    whileHover={{ scale: 1.15 }}
                    whileDrag={{ scale: 1.28, zIndex: 50 }}
                    className="absolute top-[42%] right-[2%] sm:right-[3%] md:right-[5%] lg:right-[8%] w-20 h-20 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                  >
                    <svg className="w-full h-full stroke-[#D94A4A] float-slow" style={{ '--rot': '15deg' } as React.CSSProperties} fill="none" viewBox="0 0 100 100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 15,75 L 85,75" strokeWidth="4.5" />
                      <path d="M 10,75 C 10,71 18,71 18,75" />
                      <path d="M 82,75 C 82,71 90,71 90,75" />
                      <path d="M 20,75 C 20,35 80,35 80,75 Z" />
                      <path d="M 46,35 C 46,27 54,27 54,35" />
                    </svg>
                  </motion.div>

                  {/* Spaghetti Plate */}
                  <motion.div 
                    drag 
                    dragConstraints={landingRef}
                    dragElastic={0.4} 
                    dragMomentum={true}
                    whileHover={{ scale: 1.15 }}
                    whileDrag={{ scale: 1.28, zIndex: 50 }}
                    className="absolute bottom-[22%] left-[2%] sm:left-[4%] md:left-[7%] lg:left-[10%] w-18 h-18 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                  >
                    <svg className="w-full h-full stroke-[#D94A4A] float-slower" style={{ '--rot': '-18deg' } as React.CSSProperties} fill="none" viewBox="0 0 100 100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 15,75 C 25,85 75,85 85,75" strokeWidth="3" />
                      <path d="M 10,72 L 90,72" strokeWidth="2.5" />
                      <path d="M 25,72 C 20,55 35,50 45,65 C 50,50 65,55 60,72" />
                      <path d="M 30,72 C 35,40 65,40 70,72" />
                      <path d="M 35,65 C 45,58 55,58 65,65" />
                      <circle cx="38" cy="58" r="7" fill="#D94A4A" className="stroke-none" />
                      <circle cx="38" cy="58" r="7" />
                      <circle cx="62" cy="56" r="8" fill="#D94A4A" className="stroke-none" />
                      <circle cx="62" cy="56" r="8" />
                      <path d="M 50,50 C 47,42 53,38 50,50 Z" />
                    </svg>
                  </motion.div>
                </div>

                {/* Scroll indicator pinned to the bottom of the viewport */}
                <div className="relative z-40 pb-6 w-full flex justify-center pointer-events-none">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 0.6 }} 
                    transition={{ delay: 5, duration: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-bold mb-2">Scroll</span>
                    <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center p-1">
                      <motion.div 
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-1.5 rounded-full bg-white/60"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ===== ATMOSPHERE SECTION ===== */}
              <div className="relative w-full py-20 sm:py-32 overflow-hidden flex flex-col items-center grain-overlay" style={{ backgroundColor: '#3A2211' }}>
                <div className="text-center mb-12 sm:mb-16 px-6 relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.8 }}
                    onClick={(event) => handleEdit('categories', event)}
                    className={`${isPreview ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                  >
                    <span className="font-cursive text-[#D94A4A] text-2xl sm:text-3xl block mb-2">{content.helpTitle || 'Experience'}</span>
                    <h2 className={`font-serif text-[#C6A68A] mb-4 ${isMobileMode ? 'text-4xl' : 'text-5xl sm:text-7xl'}`}>{content.categoriesStepTitle || 'Feel the Vibe'}</h2>
                    <p className="text-[#C6A68A] opacity-80 tracking-wide text-sm font-medium">{content.categoriesStepSubTitle || 'More than just coffee'}</p>
                  </motion.div>
                </div>
                {/* Edge fade masks */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#3A2211] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#3A2211] to-transparent z-10 pointer-events-none" />
                <div className="w-full relative flex overflow-x-hidden">
                    {(() => {
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
                      ];
                      
                      let expImages = (content.categories && content.categories.length > 0)
                        ? content.categories.map((c: any) => c.image).filter(Boolean)
                        : [];
                        
                      if (expImages.length === 0) {
                        expImages = fallbackImages;
                      }

                      return (
                        <>
                          {/* Track 1 */}
                          <div className="scroll-cards gap-4 sm:gap-6 px-2 sm:px-3">
                            {expImages.map((src: string, idx: number) => (
                              <div key={`atm-1-${idx}`} className="w-[260px] sm:w-[320px] h-[360px] sm:h-[450px] rounded-[20px] overflow-hidden relative shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2.5 transition-transform duration-400 group">
                                <img src={src} alt="Cafe atmosphere" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
                            ))}
                          </div>
                          {/* Track 2 for infinite seamless loop */}
                          <div className="scroll-cards gap-4 sm:gap-6 px-2 sm:px-3" aria-hidden="true">
                            {expImages.map((src: string, idx: number) => (
                              <div key={`atm-2-${idx}`} className="w-[260px] sm:w-[320px] h-[360px] sm:h-[450px] rounded-[20px] overflow-hidden relative shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2.5 transition-transform duration-400 group">
                                <img src={src} alt="Cafe atmosphere" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                </div>
              </div>

              {/* ===== MUST TRY SECTION ===== */}
              <div 
                className={`relative w-full py-28 sm:py-40 overflow-hidden ${isPreview ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`} 
                style={{ backgroundColor: '#F4F0EB' }}
                onClick={(e) => handleEdit('products', e)}
              >
                {/* Marquee text band */}
                <div className="absolute top-10 left-0 w-full overflow-hidden opacity-[0.06] pointer-events-none select-none flex">
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }} 
                    transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                    className="font-serif italic text-[14rem] leading-none text-[#3A2211] whitespace-nowrap flex"
                  >
                    <span className="pr-12">Fresh · Crisp · Bold ·</span>
                    <span className="pr-12">Fresh · Crisp · Bold ·</span>
                  </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 sm:mb-24"
                  >
                    <p className="text-[#D94A4A] uppercase tracking-[0.3em] text-[10px] font-bold mb-4">
                      — {content.preTitle || 'Signature Favorites'} —
                    </p>
                    <h2 className="font-serif italic font-semibold text-[clamp(3rem,8vw,6rem)] text-[#3A2211] leading-[0.95] tracking-tight">
                      {(() => {
                        const titleStr = content.title || 'Must try';
                        const words = titleStr.trim().split(/\s+/);
                        if (words.length <= 1) return titleStr;
                        const lastWord = words.pop();
                        return (
                          <>
                            {words.join(' ')} <span className="text-[#D94A4A]">{lastWord}</span>
                          </>
                        );
                      })()}
                    </h2>
                  </motion.div>

                  <div className={`grid gap-8 sm:gap-10 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {(() => {
                      let displayProducts = (content.products || []).slice(0, 3);
                      if (displayProducts.length === 0 || displayProducts.some((p: Product) => p?.category_id === 'sofas' || p?.name?.toLowerCase().includes('sofa') || p?.name?.toLowerCase().includes('moon'))) {
                        displayProducts = [
                          {
                            id: 'dish1',
                            name: "Artisanal Caramel Latte",
                            description: "Smooth espresso, steamed milk, sea salt caramel.",
                            priceLabel: "Rs 320",
                            image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
                            category_id: 'coffee',
                            tier: 'premium'
                          },
                          {
                            id: 'dish2',
                            name: "Fresh Butter Croissant",
                            description: "Flaky, golden layers of pastry baked fresh every morning with French butter.",
                            priceLabel: "Rs 180",
                            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                            category_id: 'pastries',
                            tier: 'most_popular'
                          },
                          {
                            id: 'dish3',
                            name: "Avocado Sourdough Toast",
                            description: "Smashed avocado on toasted artisan sourdough, topped with chili flakes and microgreens.",
                            priceLabel: "Rs 450",
                            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
                            category_id: 'meals',
                            tier: 'premium'
                          }
                        ];
                      }
                      
                      return displayProducts.map((product: any, i: number) => (
                        <TiltProductCard key={product.id || i} product={product} i={i} isMobileMode={isMobileMode} />
                      ));
                    })()}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-20 flex justify-center"
                  >
                    <button
                      onClick={() => { setActiveCategory(null); navigate("recommendations", 1); }}
                      className="group px-12 py-5 rounded-full bg-[#3A2211] text-[#F4F0EB] hover:bg-[#D94A4A] uppercase tracking-[0.25em] text-[11px] font-bold transition-colors duration-500 shadow-md hover:shadow-xl cursor-pointer flex items-center gap-3"
                    >
                      Explore Full Menu
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </motion.div>
                </div>
              </div>



              {/* ===== REVIEWS SECTION ===== */}
              <div 
                ref={reviewsSectionRef}
                className="relative w-full py-24 sm:py-36 flex flex-col items-center overflow-hidden" 
                style={{ backgroundColor: '#F4F0EB' }}
                onClick={(e) => handleEdit('testimonials', e)}
              >


                <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center gap-8 sm:gap-12">
                  <motion.div
                    className="text-center mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="font-cursive text-[#D94A4A] text-2xl sm:text-3xl block mb-2">Testimonials</span>
                    <h2 className={`font-serif text-[#3A2211] mb-4 ${isMobileMode ? 'text-4xl' : 'text-5xl sm:text-7xl'}`}>Reviews</h2>
                    <p className="text-[#3A2211] opacity-60 uppercase tracking-[0.2em] text-xs font-bold mb-4">What our guests say</p>
                    <p className="text-[#D94A4A] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold">
                      — 4.9 / 5 from 240+ guests —
                    </p>
                  </motion.div>

                  {(content.testimonials || []).map((t: Testimonial, i: number) => {
                    const getInitials = (name: string) => {
                      if (!name) return '??';
                      return name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
                    };

                    const avatarStyles = [
                      { bg: 'bg-[#3A2211]', fg: 'text-[#F4F0EB]' },
                      { bg: 'bg-[#D94A4A]', fg: 'text-white' },
                      { bg: 'bg-[#EAB308]', fg: 'text-[#3A2211]' },
                      { bg: 'bg-[#3A2211]', fg: 'text-white' },
                    ];
                    const avStyle = avatarStyles[i % avatarStyles.length];

                    return (
                      <motion.article
                        key={t.id || i}
                        className="w-full p-8 sm:p-12 bg-white rounded-[28px] border border-[#E8E1D5] shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 relative"
                        initial={{ opacity: 0, y: 60, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                        whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -0.8 : 0.8 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.9, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="absolute -top-5 -left-3 font-serif italic text-7xl text-[#D94A4A]/20 leading-none select-none">“</span>
                        <span className="absolute -bottom-6 -right-3 font-serif italic text-7xl text-[#D94A4A]/20 leading-none select-none">”</span>
                        <div className="flex gap-1.5 mb-6 text-[#EAB308]" aria-label={`${t.rating} out of 5 stars`}>
                          {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                            <svg key={idx} className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <p className="font-serif italic text-lg sm:text-xl leading-relaxed text-[#3A2211] mb-8">
                          {t.text}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${avStyle.bg} ${avStyle.fg} flex items-center justify-center font-bold text-sm shadow-md`}>
                            {getInitials(t.name)}
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#3A2211]">{t.name}</h4>
                            {t.city && (
                              <span className="text-[10px] tracking-wider uppercase text-[#3A2211]/50 mt-0.5">{t.city}</span>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>

              {/* ===== LOCATION SECTION ===== */}
              <div className="relative w-full py-24 sm:py-32 grain-overlay" style={{ backgroundColor: '#C6A68A' }}>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                  {/* Heading */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    className="text-center mb-16"
                  >
                    <span className="font-cursive text-[#D94A4A] text-2xl sm:text-3xl block mb-2">{content.locationKicker}</span>
                    <h2 className="font-serif text-[#3A2211] text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">{content.locationTitle}</h2>
                    <p className="text-sm sm:text-base font-medium tracking-wide leading-relaxed text-[#3A2211]/80 max-w-xl mx-auto mt-4">
                      {content.locationSubTitle}
                    </p>
                  </motion.div>

                  {/* Grid */}
                  <div className={`grid gap-8 items-stretch ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {/* Left Info Card */}
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }} 
                      whileInView={{ opacity: 1, x: 0 }} 
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-[30px] shadow-2xl border border-white/50 flex flex-col justify-between gap-8"
                    >
                      <div className="space-y-6">
                        {/* Address */}
                        <div className="flex gap-4 items-start text-left">
                          <div className="w-10 h-10 rounded-full bg-[#D94A4A]/10 text-[#D94A4A] flex items-center justify-center shrink-0">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D94A4A] mb-1">Address</h4>
                            <p className="font-serif italic font-semibold text-lg text-[#3A2211] leading-snug">{content.experienceCenterName || 'Kaffestuggu Cafe'}</p>
                            <p className="text-xs sm:text-sm text-[#3A2211]/70 leading-relaxed font-sans mt-0.5">{content.experienceCenterAddress || 'Kjerkgata 18, 7374 Røros'}</p>
                          </div>
                        </div>
                        
                        <div className="w-full h-px bg-[#3A2211]/10" />

                        {/* Hours */}
                        <div className="flex gap-4 items-start text-left">
                          <div className="w-10 h-10 rounded-full bg-[#D94A4A]/10 text-[#D94A4A] flex items-center justify-center shrink-0">
                            <Clock size={18} />
                          </div>
                          <div className="w-full">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D94A4A] mb-2">Hours</h4>
                            <div className="text-xs sm:text-sm text-[#3A2211]/80 font-medium font-sans flex flex-col gap-1.5 w-full">
                              <span className="flex justify-between gap-8 border-b border-[#3A2211]/5 pb-1">
                                <span>Mon - Fri</span>
                                <span className="font-bold text-[#3A2211]">{content.hoursMonFri}</span>
                              </span>
                              <span className="flex justify-between gap-8">
                                <span>Sat - Sun</span>
                                <span className="font-bold text-[#3A2211]">{content.hoursSatSun}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <a href={buildDirectionsUrl(content.experienceCenterAddress, content.mapLink)} target="_blank" rel="noopener noreferrer"
                        className="px-12 py-5 rounded-[50px] bg-[#3A2211] text-[#F4F0EB] hover:bg-[#D94A4A] uppercase tracking-[0.2em] text-[11px] font-bold transition-all w-full text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] inline-block duration-300">
                        Get Directions
                      </a>
                    </motion.div>
                    
                    {/* Right Map Card */}
                    <motion.div 
                      initial={{ opacity: 0, x: 30 }} 
                      whileInView={{ opacity: 1, x: 0 }} 
                      viewport={{ once: true }} 
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="relative w-full h-[380px] md:h-auto min-h-[380px] rounded-[30px] overflow-hidden shadow-2xl bg-[#E8E0D5]"
                    >
                      <iframe src={buildMapEmbedUrl(content.mapLink, content.experienceCenterAddress)} width="100%" height="100%"
                        style={{ border: 0, filter: 'grayscale(5%) contrast(1.02)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      <div className="absolute inset-0 pointer-events-none rounded-[30px] border border-black/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}


          {/* ========== 3. RECOMMENDATIONS ========== */}
          {step === "recommendations" && (
            <motion.section key="recommendations" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-full px-5 pt-20 pb-32 w-full max-w-5xl mx-auto relative overflow-hidden">
              <div className={`absolute -top-10 right-0 font-cursive ${isMobileMode ? 'text-[8rem]' : 'text-[12rem]'} text-[#C6A68A] opacity-30 pointer-events-none -rotate-12 select-none`}>Menu</div>
              
              <motion.div variants={fadeUp} className={`text-center relative z-10 cursor-pointer px-2 ${isMobileMode ? 'mb-12' : 'mb-20'}`} onClick={() => handleEdit('menu')}>
                <h2 className={`font-serif ${isMobileMode ? 'text-[2.75rem] mb-3' : 'text-[3.5rem] md:text-[5rem] lg:text-[6rem] mb-2'} text-[#3A2211] leading-[1.1]`}>
                  {menuTitle}
                </h2>
                <p className={`font-sans text-[#D94A4A] uppercase font-bold leading-relaxed mx-auto ${isMobileMode ? 'tracking-[0.15em] text-[10px] max-w-[280px]' : 'tracking-[0.2em] text-sm max-w-none'}`}>
                  {menuSubTitle}
                </p>
              </motion.div>

              <div className={`grid grid-cols-1 ${isMobileMode ? '' : 'md:grid-cols-2'} gap-16 sm:gap-24 relative z-10`}>
                {(() => {
                  const menuSection = content.sections?.find((s: any) => s.id === 'menu');
                  const menuData = menuSection?.data || {};
                  
                  let groups = [];
                  if (!menuSection) {
                    groups = [
                      {
                        cat: { label: 'Coffee', id: 'coffee' },
                        items: [
                          { id: '1', name: 'Espresso', priceLabel: '$3.50', description: 'Rich, full-bodied espresso with a creamy crema.', category_id: 'coffee' },
                          { id: '2', name: 'Cappuccino', priceLabel: '$4.50', description: 'Espresso topped with deeply frothed milk.', category_id: 'coffee' },
                          { id: '3', name: 'Flat White', priceLabel: '$4.75', description: 'Velvety steamed milk over a double shot.', category_id: 'coffee' },
                          { id: '4', name: 'Iced Caramel Latte', priceLabel: '$5.50', description: 'Chilled espresso, milk, and house caramel.', tier: 'best_value', category_id: 'coffee' }
                        ]
                      },
                      {
                        cat: { label: 'Gourmet Sandwiches', id: 'sandwiches' },
                        items: [
                          { id: '9', name: 'Caprese Panini', priceLabel: '$8.50', description: 'Fresh mozzarella, ripe tomatoes, basil pesto, and wild rocket on toasted sourdough.', category_id: 'sandwiches' },
                          { id: '10', name: 'Pesto Chicken Sourdough', priceLabel: '$9.50', description: 'Tender grilled chicken, homemade basil pesto, melted provolone, and baby spinach.', tier: 'best_value', category_id: 'sandwiches' },
                          { id: '11', name: 'Truffle Mushroom Toastie', priceLabel: '$9.00', description: 'Sautéed wild mushrooms, white truffle oil, and aged gruyère on rustic sourdough.', category_id: 'sandwiches' }
                        ]
                      },
                      {
                        cat: { label: 'Pastries & Bites', id: 'pastries' },
                        items: [
                          { id: '5', name: 'Butter Croissant', priceLabel: '$4.00', description: 'Flaky, golden baked fresh every morning.', category_id: 'pastries' },
                          { id: '6', name: 'Almond Tart', priceLabel: '$5.50', description: 'Sweet almond frangipane in a crisp pastry shell.', tier: 'best_value', category_id: 'pastries' },
                          { id: '7', name: 'Avocado Toast', priceLabel: '$9.00', description: 'Sourdough, smashed avocado, chili flakes.', category_id: 'pastries' },
                          { id: '8', name: 'Truffle Fries', priceLabel: '$7.50', description: 'Crispy fries tossed in parmesan and truffle oil.', category_id: 'pastries' }
                        ]
                      }
                    ];
                  } else {
                    const menuCategories = menuData.categories || [];
                    groups = menuCategories.map((cat: any) => ({
                      cat: { label: cat.name, id: cat.id },
                      items: (cat.items || []).map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        priceLabel: item.priceLabel,
                        description: item.description,
                        tier: item.popular ? 'best_value' : undefined,
                      })),
                    })).filter((g: any) => g.items.length > 0);
                  }

                  if (groups.length === 0) {
                    return (
                      <div className="col-span-full text-center py-12 opacity-60 font-sans italic text-[#3A2211]">
                        Our menu is currently being updated. Please check back soon!
                      </div>
                    );
                  }

                  return groups.map((group: any, i: number) => (
                    <motion.div key={i} variants={fadeUp} className="w-full">
                      <h3 className="font-serif text-3xl sm:text-4xl text-[#3A2211] mb-10 border-b border-[#C6A68A]/50 pb-4">
                        {group.cat.label}
                      </h3>
                      <div className="flex flex-col gap-8">
                        {group.items.map((product: Product) => (
                          <div key={product.id} className={`group w-full ${isPreview ? 'cursor-pointer' : ''}`} onClick={(e) => handleProductClick(product, e)}>
                            <div className="flex justify-between items-end mb-2 w-full gap-2">
                              <h4 className="font-sans font-bold text-[14px] sm:text-[16px] text-[#3A2211] uppercase tracking-wide flex items-center gap-2 transition-colors group-hover:text-[#D94A4A] flex-wrap flex-1">
                                <span>{product.name}</span>
                                {product.tier === 'best_value' && <span className="text-[9px] bg-[#EAB308] text-[#3A2211] px-2 py-0.5 rounded-full font-bold shadow-sm shrink-0 whitespace-nowrap leading-none mt-0.5">POPULAR</span>}
                              </h4>
                              <div className="flex-grow border-b-2 border-dotted border-[#C6A68A]/50 opacity-50 group-hover:opacity-100 transition-opacity mb-1.5 min-w-[15px] hidden sm:block"></div>
                              <span className="font-serif font-bold text-lg sm:text-xl text-[#D94A4A] shrink-0 leading-none">{product.priceLabel}</span>
                            </div>
                            <p className="text-[12px] sm:text-[14px] opacity-70 text-[#3A2211] font-medium leading-relaxed pr-0 sm:pr-8 line-clamp-2">
                              {product.ingredients || product.description || "A delicious classic prepared with the finest ingredients."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ));
                })()}
              </div>
            </motion.section>
          )}

          {/* ========== 4. DETAILS ========== */}
          {step === "details" && selectedProduct && (
            <motion.section key="details" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-full w-full max-w-6xl mx-auto pb-32 md:pt-24 md:flex md:gap-16 px-0 md:px-8">
              
              <div className="w-full md:w-1/2 md:sticky md:top-24 md:h-[80vh]">
                <div className="w-full h-full relative bg-[#F2EBE1] md:rounded-3xl overflow-hidden shadow-2xl group">
                  {selectedProduct.image ? (
                    <motion.img 
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E8E1D5]/50">
                      <Coffee size={64} className="text-[#3A2211]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              <div className="w-full md:w-1/2 px-6 py-10 md:p-0 flex flex-col justify-center">
                <motion.div variants={fadeUp} className="space-y-6">
                  <div className="flex items-center gap-3">
                    {selectedProduct.dietary && (
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B9A7B] bg-[#8B9A7B]/10 px-3 py-1.5 rounded-sm">
                        {selectedProduct.dietary}
                      </span>
                    )}
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4713B] bg-[#C4713B]/10 px-3 py-1.5 rounded-sm">
                      {selectedProduct.urgency}
                    </span>
                  </div>
                  
                  <h2 className={`font-editorial text-[#2C1810] leading-[1.1] tracking-tight ${isMobileMode ? 'text-[2.25rem]' : 'text-[3rem] md:text-[4.5rem]'}`}>{selectedProduct.name}</h2>
                   <p className="font-serif text-[2.5rem] text-[#D94A4A] italic">{selectedProduct.priceLabel}</p>
                  
                  <div className="h-px w-full bg-[#E8E1D5]" />
                  
                  <div className="space-y-8">
                    <p className="text-[16px] md:text-[18px] text-[#2C1810] leading-[1.8] font-light">
                      {selectedProduct.description || "Crafted with passion using traditional methods. A perfect balance of flavors that brings the authentic taste of Røros to your table."}
                    </p>
                    
                    {selectedProduct.ingredients && (
                      <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B7355] mb-3 flex items-center gap-2">
                          <Coffee size={14} /> Key Ingredients
                        </p>
                        <p className="text-[15px] text-[#2C1810] font-serif italic leading-relaxed">{selectedProduct.ingredients}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-6 bg-[#F2EBE1] rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Clock size={20} className="text-[#C4713B]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B7355]">Preparation</p>
                        <p className="text-[15px] text-[#2C1810] font-medium mt-1">{selectedProduct.delivery}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { togglePreOrder(selectedProduct.id); navigate("reservation", 1); }}
                    className="w-full py-5 rounded-2xl bg-[#25D366] text-white text-[13px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(37,211,102,0.35)] active:scale-[0.98] transition-all hover:bg-[#20BD5A]"
                  >
                    Reserve & Pre-order <ArrowRight size={16} />
                  </button>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ========== 5. RESERVATION ========== */}
          {step === "reservation" && (
            <motion.section key="reservation" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-full w-full max-w-3xl mx-auto pb-32 pt-20 md:pt-32 px-5 relative">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-[#3A2211]/20 hidden md:block" />

              <motion.div variants={fadeUp} className="text-center mb-12 sm:mb-20 relative z-10">
                <div className={`absolute -top-12 right-0 font-cursive ${isMobileMode ? 'text-[8rem]' : 'text-[12rem]'} text-[#C6A68A] opacity-25 pointer-events-none -rotate-12 select-none z-0`}>
                  Table
                </div>

                <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D94A4A] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D94A4A]">Only {tablesLeft} tables left</span>
                </div>
                
                <h2 className={`font-serif ${isMobileMode ? 'text-[2.75rem] mb-3' : 'text-[3.5rem] md:text-[5rem] lg:text-[6rem] mb-2'} text-[#3A2211] leading-[1.1] relative z-10`}>
                  {content.whatsapp?.title || "Reserve Table"}
                </h2>
                
                <p className={`font-sans text-[#D94A4A] uppercase font-bold leading-relaxed mx-auto tracking-[0.15em] text-[10px] sm:tracking-[0.2em] sm:text-xs relative z-10`}>
                  {content.whatsapp?.subTitle || "Confirmation in 30 seconds"}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="max-w-xl mx-auto space-y-12">
                {formError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-sans text-xs font-semibold">
                    {formError}
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Party Size Counter */}
                  <div className="relative group bg-[#FBF9F6] rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <label className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B7355] flex items-center gap-2">
                        <User size={14} className="text-[#C4713B]" /> Party Size
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between w-full">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-12 h-12 rounded-full border border-[#E8E1D5] bg-white flex items-center justify-center text-xl text-[#3A2211] hover:border-[#C4713B] hover:text-[#C4713B] transition-colors cursor-pointer active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                        disabled={guests <= 1}
                      >
                        -
                      </button>

                      <div className="flex flex-col items-center w-24">
                        <span className="font-serif text-3xl sm:text-4xl text-[#3A2211] leading-none mb-1 font-bold">
                          {guests}
                        </span>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-[#8B7355]/80">
                          {guests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                        className="w-12 h-12 rounded-full border border-[#E8E1D5] bg-white flex items-center justify-center text-xl text-[#3A2211] hover:border-[#C4713B] hover:text-[#C4713B] transition-colors cursor-pointer active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                        disabled={guests >= 20}
                      >
                        +
                      </button>
                    </div>

                    {/* Dynamic People Visualization */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6 min-h-[24px] items-center">
                      <AnimatePresence mode="popLayout">
                        {Array.from({ length: guests }).map((_, i) => (
                          <motion.div
                            key={`guest-${i}`}
                            initial={{ opacity: 0, scale: 0, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0, x: 10 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="text-[#C4713B]"
                          >
                            <User size={18} fill={i === 0 ? "currentColor" : "none"} strokeWidth={i === 0 ? 0 : 2} className="opacity-80" />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className={`relative ${isCalendarOpen ? 'z-30' : 'z-20'}`}>
                    <button 
                      type="button" 
                      onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsTimeOpen(false); }}
                      className={`w-full bg-[#FBF9F6] border rounded-3xl p-5 flex items-center justify-between transition-all duration-300 shadow-sm cursor-pointer ${
                        isCalendarOpen ? 'border-[#C4713B] ring-4 ring-[#C4713B]/10' : 'border-[#E8E1D5] hover:border-[#C6A68A]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C4713B] border border-[#E8E1D5]">
                          <CalendarDays size={18}/>
                        </div>
                        <div className="text-left">
                          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8B7355] mb-1">Date</p>
                          <p className="font-serif text-lg sm:text-xl text-[#3A2211] leading-none font-bold">
                            {resDate ? new Date(resDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                          </p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isCalendarOpen ? 180 : 0 }}>
                        <ChevronDown size={18} className="text-[#8B7355]"/>
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isCalendarOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsCalendarOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 top-full mt-3 z-20 bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-[0_20px_50px_rgba(58,34,17,0.12)] origin-top"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="font-serif text-xl font-bold text-[#3A2211]">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </h3>
                              <div className="flex gap-2">
                                <button type="button" onClick={handlePrevMonth} disabled={isCurrentMonthThisMonth} className="w-9 h-9 rounded-full border border-[#E8E1D5] flex items-center justify-center text-[#3A2211] hover:border-[#C4713B] disabled:opacity-30 disabled:hover:border-[#E8E1D5] transition-all cursor-pointer">
                                  <ChevronLeft size={16} />
                                </button>
                                <button type="button" onClick={handleNextMonth} className="w-9 h-9 rounded-full border border-[#E8E1D5] flex items-center justify-center text-[#3A2211] hover:border-[#C4713B] transition-all cursor-pointer">
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-7 gap-2 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center font-sans text-[10px] font-bold uppercase tracking-widest text-[#8B7355]/60">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-2">
                              {calendarDays.map((d, i) => {
                                if (!d) return <div key={`empty-${i}`} className="aspect-square" />;
                                const isPast = d < today;
                                const dateString = getLocalISODate(d);
                                const isSelected = resDate === dateString;
                                
                                return (
                                  <button
                                    key={dateString} type="button" disabled={isPast}
                                    onClick={() => { setResDate(dateString); setIsCalendarOpen(false); }}
                                    className={`aspect-square rounded-xl font-serif text-base font-bold flex items-center justify-center transition-all duration-300 ${
                                      isPast ? 'opacity-30 cursor-not-allowed text-[#8B7355]' : isSelected 
                                        ? 'bg-[#3A2211] text-[#F9F6F0] shadow-lg transform scale-105 border border-[#3A2211]' 
                                        : 'bg-transparent text-[#3A2211] border border-transparent hover:border-[#C4713B] cursor-pointer'
                                    }`}
                                  >
                                    {d.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Time Input */}
                  <div className={`relative ${isTimeOpen ? 'z-30' : 'z-20'}`}>
                    <button 
                      type="button" 
                      onClick={() => { setIsTimeOpen(!isTimeOpen); setIsCalendarOpen(false); }}
                      className={`w-full bg-[#FBF9F6] border rounded-3xl p-5 flex items-center justify-between transition-all duration-300 shadow-sm cursor-pointer ${
                        isTimeOpen ? 'border-[#C4713B] ring-4 ring-[#C4713B]/10' : 'border-[#E8E1D5] hover:border-[#C6A68A]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C4713B] border border-[#E8E1D5]">
                          <Clock size={18}/>
                        </div>
                        <div className="text-left">
                          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8B7355] mb-1">Time</p>
                          <p className="font-serif text-lg sm:text-xl text-[#3A2211] leading-none font-bold">
                            {resTime || 'Select Time'}
                          </p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isTimeOpen ? 180 : 0 }}>
                        <ChevronDown size={18} className="text-[#8B7355]"/>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isTimeOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsTimeOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 top-full mt-3 z-20 bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-[0_20px_50px_rgba(58,34,17,0.12)] origin-top flex flex-col md:flex-row gap-8"
                          >
                            {/* Animated Analog Clock Display */}
                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center md:border-r border-[#E8E1D5] md:pr-6 pb-6 md:pb-0 border-b md:border-b-0 animate-fade-in">
                              <div className="relative w-28 h-28 rounded-full border-[3px] border-[#E8E1D5] flex items-center justify-center bg-[#F9F6F0] shadow-inner mb-4">
                                {/* Clock Ticks */}
                                {[...Array(12)].map((_, i) => (
                                  <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
                                    <div className="mx-auto w-[2px] h-2 bg-[#8B7355]/40 mt-1.5" />
                                  </div>
                                ))}
                                {/* Hour Hand */}
                                <motion.div
                                  animate={{ rotate: hrAngle }}
                                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                  className="absolute w-1.5 h-7 bg-[#3A2211] rounded-full origin-bottom"
                                  style={{ bottom: "50%" }}
                                />
                                {/* Minute Hand */}
                                <motion.div
                                  animate={{ rotate: minAngle }}
                                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                  className="absolute w-1.5 h-10 bg-[#C4713B] rounded-full origin-bottom"
                                  style={{ bottom: "50%" }}
                                />
                                {/* Center Pin */}
                                <div className="absolute w-3 h-3 bg-[#3A2211] rounded-full shadow-sm" />
                              </div>
                              <p className="font-serif text-2xl font-bold text-[#3A2211] tracking-wide">{displayTimeStr}</p>
                              <p className="font-sans text-[9px] uppercase tracking-widest text-[#8B7355] mt-1 text-center font-semibold">Selected Time</p>
                            </div>

                            {/* Interactive Time Selection: Type & Scroll Wheel */}
                            <div className="w-full md:w-2/3 flex flex-col">
                               <div className="w-full mb-4">
                                   <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8B7355] flex items-center gap-2 mb-2">
                                     Type or scroll to set
                                   </label>
                                   <input 
                                      type="text"
                                      value={resTime}
                                      onChange={handleTimeType}
                                      placeholder="e.g. 07:30 PM"
                                      className="w-full bg-[#F9F6F0] border border-[#E8E1D5] focus:border-[#C4713B] rounded-xl outline-none font-serif text-2xl font-bold text-[#3A2211] py-3 text-center placeholder:text-[#3A2211]/20 transition-colors shadow-inner"
                                   />
                               </div>

                               {/* Magnetic Scroll Wheel */}
                               <div 
                                  className="relative w-full h-[150px] overflow-y-auto snap-y snap-mandatory border-t border-b border-[#E8E1D5]" 
                                  onScroll={handleTimeScroll} 
                                  ref={timeScrollRef}
                                  style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                               >
                                   {/* Custom CSS to hide scrollbar for webkit (Chrome/Safari) */}
                                   <style>{`
                                     div::-webkit-scrollbar { display: none; }
                                   `}</style>
                                   
                                   {/* Center Highlight Overlay */}
                                   <div className="absolute top-[50px] left-0 right-0 h-[50px] bg-[#C4713B]/10 border-y border-[#C4713B]/20 pointer-events-none" />
                                   
                                   <div className="h-[50px] shrink-0" /> {/* Empty Top Padding to allow center snapping */}
                                   
                                   {timeSlots.map((t, i) => (
                                       <div 
                                         key={t} 
                                         className="h-[50px] snap-center flex items-center justify-center cursor-pointer shrink-0" 
                                         onClick={() => { setResTime(t); if(timeScrollRef.current) timeScrollRef.current.scrollTop = i * 50; }}
                                       >
                                           <span className={`transition-all duration-300 ${resTime === t ? 'font-serif text-2xl text-[#3A2211] font-bold scale-110' : 'font-sans text-sm text-[#8B7355] opacity-50 hover:opacity-80'}`}>
                                               {t}
                                           </span>
                                       </div>
                                   ))}
                                   
                                   <div className="h-[50px] shrink-0" /> {/* Empty Bottom Padding */}
                               </div>

                               {/* Action Button */}
                               <button 
                                   type="button" 
                                   onClick={() => setIsTimeOpen(false)}
                                   className="mt-4 py-3 rounded-xl bg-[#3A2211] text-[#F9F6F0] font-sans text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-[#C4713B] transition-colors cursor-pointer"
                               >
                                   Confirm Time
                               </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Guest Details */}
                  <div className="relative group bg-[#FBF9F6] rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#C6A68A]">
                     <label className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B7355] flex items-center gap-2 mb-4">
                        Reservation Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={resName}
                        onChange={(e) => setResName(e.target.value)}
                        placeholder="Your signature..."
                        className="w-full bg-transparent border-b-2 border-[#E8E1D5] focus:border-[#C4713B] outline-none font-serif text-3xl text-[#3A2211] py-2 placeholder:text-[#3A2211]/20 transition-colors"
                      />
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => {
                      if(!resDate || !resTime || !resName) {
                        setFormError("Please complete all fields to reserve your table.");
                        return;
                      }
                      setFormError("");
                      handleWhatsAppCTA("reservation_cta");
                    }}
                    className="w-full py-5 rounded-2xl bg-[#3A2211] hover:bg-[#4E321E] text-[#F9F6F0] font-sans text-[11px] font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] border border-[#3A2211]"
                  >
                    <MessageCircle size={18} />
                    <span>{content.whatsapp?.ctaText || "Confirm via WhatsApp"}</span>
                  </button>
                  <p className="text-center text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8B7355] mt-6 font-bold">
                    We will hold your table upon confirmation.
                  </p>
                </div>
              </motion.div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
});
