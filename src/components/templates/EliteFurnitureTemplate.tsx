'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { 
  ChevronLeft, ArrowRight, MessageCircle, MessageSquare,
  Star, MapPin, Quote, ExternalLink, Package,
  CheckCircle2, ShieldCheck, Truck, X
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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
  dimensions?: string | null;
  category_id?: string;
  collection?: string;
  priceLabel?: string;
  savingsLabel?: string;
  style?: string;
  image?: string;
  benefits?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
  urgency?: string;
  delivery?: string;
  viewers?: number;
  tier?: 'best_value' | 'most_popular' | 'premium';
};

type Product = {
  id: string; category_id: string; name: string; collection?: string;
  priceLabel: string; savingsLabel?: string; style?: string; image: string; image2?: string;
  description?: string; benefits?: string[]; colors?: string[];
  rating?: number; reviews?: number; urgency?: string; delivery?: string;
  viewers?: number;
  tier?: 'best_value' | 'most_popular' | 'premium';
  dimensions?: string;
  material?: string;
  finish?: string;
};

type Testimonial = {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
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
  onEditSection?: (sectionId: 'content' | 'categories' | 'products' | 'testimonials' | 'location') => void;
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

type Step = "landing" | "categories" | "recommendations" | "details";

const buildMapEmbedUrl = (mapLink?: string, address?: string) => {
  const link = (mapLink || '').trim();
  const addr = (address || '').trim();
  if (link.includes('embed')) return link;
  if (addr) return `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;
  if (link) return `https://www.google.com/maps?q=${encodeURIComponent(link)}&output=embed`;
  return '';
};

export default React.memo(function EliteFurnitureTemplate({ 
  funnel, store, products: propProducts, isPreview = false, previewMode, onEditSection
}: TemplateProps) {
  const [step, setStep] = useState<Step>("landing");
  const [direction, setDirection] = useState(1);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [customRequestText, setCustomRequestText] = useState("");
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [availabilityProduct, setAvailabilityProduct] = useState<Product | null>(null);
  const cityRef = React.useRef<HTMLInputElement>(null);
  const pincodeRef = React.useRef<HTMLInputElement>(null);

  // Extract content from funnel story_mode_data or use defaults
  const isMobileMode = previewMode === 'mobile';
  
  const content = useMemo(() => {
    const savedContent = funnel.story_mode_data?.[0]?.content;
    
    const base = { ...(savedContent || {}) } as any;
    if (savedContent?.sections) {
      savedContent.sections.forEach((sec: any) => {
        if (sec.id === 'content') {
          Object.assign(base, sec.data);
        } else if (sec.id === 'categories') {
          base.categories = sec.data.categories;
          base.categoriesStepTitle = sec.data.title;
          base.categoriesStepSubTitle = sec.data.subTitle;
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
          Object.assign(base, sec.data);
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

    const defaultLogo = "/images/furniture-logo.png";
    const defaultMap = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80";
    const defaultProductImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";

    const baseCategories = (base.categories && base.categories.length > 0) ? base.categories : [
      { id: "sofas", label: "Luxury Sofas", tagline: "Lounges & Recliners", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80" },
      { id: "beds", label: "Solid Wood Beds", tagline: "Master Bedroom Collections", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80" },
      { id: "dining", label: "Dining & Decor", tagline: "Factory-Direct Sets", image: "https://images.unsplash.com/photo-1617806118233-18e1db208fa0?auto=format&fit=crop&w=1200&q=80" },
    ];

    const baseProducts = (propProducts && propProducts.length > 0) ? propProducts : (base.products && base.products.length > 0) ? base.products : [
      { id: 'p1', category_id: 'sofas', name: 'Modo Sheesham L-Shape', priceLabel: 'Rs 45,000', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', image2: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80', rating: 4.8, urgency: 'Only 2 frames ready', delivery: 'Delivery: 7-10 Days' },
      { id: 'p2', category_id: 'sofas', name: 'Velvet Royal Chesterfield', priceLabel: 'Rs 58,500', image: 'https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=800&q=80', rating: 4.9, urgency: 'Selling fast', delivery: 'Delivery: 5-7 Days' },
      { id: 'p3', category_id: 'sofas', name: 'Scandinavian 3-Seater', priceLabel: 'Rs 24,000', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', rating: 4.7, urgency: 'Limited Stock', delivery: 'Delivery: 5-7 Days' },
      { id: 'p4', category_id: 'beds', name: 'Grand King Upholstered', priceLabel: 'Rs 38,000', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', rating: 4.8, urgency: 'Direct from Factory', delivery: 'Delivery: 10-12 Days' },
      { id: 'p5', category_id: 'beds', name: 'Storage Queen Bed', priceLabel: 'Rs 32,500', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', rating: 4.9, urgency: 'Most Popular', delivery: 'Delivery: 7-10 Days' },
      { id: 'p6', category_id: 'beds', name: 'Rustic Sheesham Original', priceLabel: 'Rs 28,000', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', rating: 4.7, urgency: 'Jodhpur Special', delivery: 'Delivery: 12-15 Days' },
      { id: 'p7', category_id: 'dining', name: 'Marble Top 6-Seater', priceLabel: 'Rs 65,000', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80', rating: 4.9, urgency: 'Premium Finish', delivery: 'Delivery: 10-12 Days' },
      { id: 'p8', category_id: 'dining', name: 'Compact Walnut 4-Seater', priceLabel: 'Rs 22,500', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80', rating: 4.8, urgency: 'Space Saver', delivery: 'Delivery: 5-7 Days' },
      { id: 'p9', category_id: 'dining', name: 'Grand 8-Seater Banquet', priceLabel: 'Rs 85,000', image: 'https://images.unsplash.com/photo-1600566752355-324864f7b49e?auto=format&fit=crop&w=800&q=80', rating: 5.0, urgency: 'Exclusive Design', delivery: 'Delivery: 15-20 Days' },
    ];

    return {
      storeName: base.storeName || store?.name || "Urban Living",
      logoUrl: normalizeImage(base.logoUrl, store?.logo_url || defaultLogo),
      tagline: base.tagline || funnel?.welcome_title || "Urban Living Furniture.",
      subTagline: base.subTagline || funnel?.welcome_description || "Find the best furniture in 10 seconds. No browsing. Just pick & chat.",
      whatsappNumber: base.whatsappNumber || store?.whatsapp_number || "919876543210",
      announcementText: base.announcementText || "Factory Direct Sale: Extra 10% Off via WhatsApp",
      heroCtaText: base.heroCtaText || "Find Your Perfect Furniture",
      heroCtaSubtext: base.heroCtaSubtext || "No browsing. Just pick & chat",
      experienceCenterName: base.experienceCenterName || "Urban Living Studio",
      experienceCenterAddress: base.experienceCenterAddress || "Plot 42, Sector 43, Golf Course Road, Gurgaon",
      mapImage: normalizeImage(base.mapImage, defaultMap),
      mapLink: base.mapLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.119140935912!2d77.08581027549615!3d28.5060447757342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1945c5896ec1%3A0xc6a82708dd2b75a4!2sCyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1709212000000!5m2!1sen!2sin",
      categories: baseCategories.slice(0, 3).map((category: Category) => ({
        ...category,
        image: normalizeImage(category.image, defaultProductImage),
      })),
      products: baseProducts.map((product: any) => {
        const storyData = product.story_mode_data || {};
        return {
          ...product,
          image: normalizeImage(product.image || product.image_url, defaultProductImage),
          image2: normalizeImage(product.image2 || product.image_url_2) || undefined,
          priceLabel: product.priceLabel || (product.price ? `Rs ${product.price.toLocaleString()}` : ''),
          urgency: product.urgency || storyData.urgency || 'Limited Stock',
          delivery: product.delivery || storyData.delivery || '7-11 Days',
          dimensions: product.dimensions,
          material: product.material || storyData.material,
          finish: product.finish || storyData.finish,
        };
      }),
      testimonials: base.testimonials || [
        { id: "t1", name: "Rahul S.", city: "Mumbai", text: "Saved Rs 35k compared to local retail stores. The Sheesham wood feels extremely premium.", rating: 5 },
        { id: "t2", name: "Priya K.", city: "Bangalore", text: "Loved the fact that they sent me photos straight from their Jodhpur factory before shipping. 10/10.", rating: 5 },
        { id: "t3", name: "Ananya M.", city: "Delhi", text: "Incredible design and flawless finish. The buying experience over WhatsApp was so simple.", rating: 5 },
      ],
      categoriesStepTitle: base.categoriesStepTitle || "What are you looking for?",
      categoriesStepSubTitle: base.categoriesStepSubTitle || "Select a category to view our factory-direct collections.",
      bottomCtaTitle: base.bottomCtaTitle || "Need help?",
      bottomCtaSubTitle: base.bottomCtaSubTitle || "Chat directly with factory",
      preTitle: base.preTitle || "Select Your Style",
      title: base.title || "",
      subTitle: base.subTitle || "Top 3 handpicked options for you. Tap any product to get factory-direct pricing on WhatsApp."
    };
  }, [funnel, store, propProducts]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return (content.products || []).find((p: Product) => p.id === selectedProductId) || null;
  }, [content.products, selectedProductId]);

  const TESTIMONIALS = content.testimonials || [];
  const mapEmbedUrl = useMemo(
    () => buildMapEmbedUrl(content.mapLink, content.experienceCenterAddress),
    [content.mapLink, content.experienceCenterAddress]
  );

  const navigate = (newStep: Step, dir = 1) => {
    setDirection(dir);
    setStep(newStep);
    if (!isPreview) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const container = document.getElementById('mobile-scroll-container');
      if (container) container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleWhatsAppCTA = async (intent_type: string, product: Product | null = null, selectedCategoryOverride?: Category | null) => {
    const num = content.whatsappNumber?.replace(/\D/g, '') || '';
    if (!num) { alert('WhatsApp number not configured.'); return; }
    
    const categoryToUse = selectedCategoryOverride ?? activeCategory;

    // Log to Supabase leads
    await createLead(funnel?.id || 'preview', store?.id || 'preview', 'Visitor', '', JSON.stringify({ type: 'cta_click', source: intent_type, category: categoryToUse?.label, productId: product?.id, productName: product?.name }), product?.id);

    const whatsappSettings = (content as any).whatsapp;
    
    if (product && whatsappSettings?.productInquiryText) {
      let message = whatsappSettings.productInquiryText
        .replace('{product_name}', product.name)
        .replace('{category}', categoryToUse?.label || 'Furniture');
      
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
      return;
    }

    if (intent_type === "custom_request_cta") {
      const customMessage = `Hi ${content.storeName},\n\nI couldn't find exactly what I was looking for.\n\nHere is what I need:\n"${customRequestText}"\n\nPlease let me know if you have something similar or can arrange this for me.`;
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(customMessage)}`, "_blank");
      setIsCustomRequestOpen(false);
      setCustomRequestText("");
      return;
    }

    let message = `Hi ${content.storeName},\n\n`;
    if (intent_type === "landing_hero_cta" || intent_type === "persistent_bottom_help_cta" || intent_type === "bottom_cta_help") {
      if (whatsappSettings?.welcomeMessage) {
        message = whatsappSettings.welcomeMessage
          .replace('{category}', categoryToUse?.label || 'Furniture')
          .replace('{store_name}', content.storeName);
      } else {
        message += `I'm planning to buy furniture.\n\nHere's what I'm looking for:\n• Requirement: ${categoryToUse?.label || 'Furniture'}\n\nPlease share:\n1. Final factory price\n2. Available customization options\n3. Delivery time to my pincode`;
      }
    } else if (intent_type === "product_inquiry_cta" || product) {
      if (whatsappSettings?.productInquiryText) {
        message = whatsappSettings.productInquiryText
          .replace('{product_name}', product?.name || 'Product')
          .replace('{store_name}', content.storeName);
      } else {
        message += `I'm interested in getting an exact quote & photos for:\n`;
        if (product) message += `*Product:* ${product.name} (Starting from ${product.priceLabel})\n`;
        message += `\n*Please let me know:* \n1. Exact price for my required size\n2. Fabric/Wood customization options\n3. Delivery time to my pincode`;
      }
    } else if (intent_type === "explore_more_cta") {
      message += `I'd like to explore more collections. Can you share real factory photos and pricing options?\n\n`;
      if (categoryToUse) message += `*Looking for:* ${categoryToUse.label}\n`;
    } else {
      message += `I'd like to inquire about your services.\n`;
    }
    
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Handler for general inquiry — opens category popup first
  const handleGeneralInquiry = useCallback(() => {
    setShowCategoryPopup(true);
  }, []);

  // Handler when user selects a category from the popup
  const handlePopupCategorySelect = useCallback((cat: Category) => {
    setShowCategoryPopup(false);
    handleWhatsAppCTA("persistent_bottom_help_cta", null, cat);
  }, [content]);

  const recommendedProducts = useMemo(() => {
    const activeProducts = content.products || [];
    if (!activeCategory) return activeProducts;
    
    const targetId = String(activeCategory.id).toLowerCase();
    const targetLabel = String(activeCategory.label).toLowerCase();
    
    const filtered = activeProducts.filter((p: Product) => {
      const pCatId = String(p.category_id || '').toLowerCase();
      // Match by ID or by Label (fallback for loosely mapped products)
      return pCatId === targetId || pCatId === targetLabel;
    });
    
    return filtered.slice(0, 3); // Force limit to top 3
  }, [activeCategory, content.products]);

  const handleBack = () => {
    if (step === "details") navigate("recommendations", -1);
    else if (step === "recommendations") navigate("categories", -1);
    else if (step === "categories") navigate("landing", -1);
  };

  const handleProductClick = (product: Product, event?: React.MouseEvent) => {
    if (isPreview && onEditSection) {
      onEditSection('products');
    }
    setSelectedProductId(product.id);
    setActiveImageIndex(0); // Reset index for new product
    navigate("details", 1);
  };

  const handleEdit = (
    sectionId: 'content' | 'categories' | 'products' | 'testimonials' | 'location',
    event?: React.MouseEvent
  ) => {
    if (!isPreview || !onEditSection) return false;
    event?.preventDefault();
    event?.stopPropagation();
    onEditSection(sectionId);
    return true;
  };

  // ============================================
  // 📱 CATEGORY SELECTOR POPUP (General Inquiry)
  // ============================================
  const CategorySelectorModal = () => (
    <AnimatePresence>
      {showCategoryPopup && (
        <motion.div
          key="category-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-[9999] flex items-end sm:items-center justify-center`}
          onClick={() => setShowCategoryPopup(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden border border-white/60"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <button
                onClick={() => setShowCategoryPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-[#1C1B1A]" />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-[1.25rem] tracking-tight text-[#1C1B1A] leading-tight">What are you looking for?</h3>
                  <p className="text-[11px] text-[#8C8881] font-medium mt-0.5">Select a category to chat on WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Category Grid */}
            <div className="px-4 pb-5 grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto">
              {(content.categories || []).map((cat: Category, i: number) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', damping: 20, stiffness: 200 }}
                  onClick={() => handlePopupCategorySelect(cat)}
                  className="group relative w-full h-[72px] rounded-2xl overflow-hidden flex items-center text-left active:scale-[0.98] transition-all border border-black/5 shadow-sm hover:shadow-md"
                >
                  {/* Background image */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C1B1A]/80 via-[#1C1B1A]/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-between w-full px-5">
                    <div>
                      <p className="text-white text-[14px] font-semibold tracking-tight leading-tight">{cat.label}</p>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em] mt-0.5">{cat.tagline}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-6 pb-5 pt-1 border-t border-black/5">
              <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#8C8881]">
                💬 Your enquiry will be sent directly via WhatsApp
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const AvailabilityModal = () => (
    <AnimatePresence>
      {isAvailabilityOpen && (
        <motion.div
          key="availability-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-[9999] flex items-end sm:items-center justify-center`}
          onClick={() => setIsAvailabilityOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden border border-white/60 p-6"
          >
            <button
              onClick={() => setIsAvailabilityOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-[#1C1B1A]" />
            </button>
            <h3 className="font-serif text-[1.25rem] tracking-tight text-[#1C1B1A] leading-tight mb-2">Check Availability</h3>
            <p className="text-[11px] text-[#8C8881] font-medium mb-4">Enter your location to get delivery time and exact quote.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C8881]">City</label>
                <input
                  ref={cityRef}
                  type="text"
                  placeholder="e.g. Mumbai"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F7F5F0]/50 border border-black/5 text-sm text-[#1C1B1A]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C8881]">Pincode</label>
                <input
                  ref={pincodeRef}
                  type="text"
                  placeholder="e.g. 400001"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F7F5F0]/50 border border-black/5 text-sm text-[#1C1B1A]"
                />
              </div>
              <button
                onClick={() => {
                  const city = cityRef.current?.value || '';
                  const pincode = pincodeRef.current?.value || '';
                  setIsAvailabilityOpen(false);
                  const num = content.whatsappNumber?.replace(/\D/g, '') || '';
                  const message = `Hi ${content.storeName},\n\nI'm interested in getting an exact quote & photos for:\nProduct: ${availabilityProduct?.name} (Starting from ${availabilityProduct?.priceLabel})\n\nLocation: ${city} - ${pincode}\n\nPlease let me know:\n1. Exact price for my required size\n2. Fabric/Wood customization options\n3. Delivery time to my pincode`;
                  window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="w-full py-4 rounded-xl bg-[#25D366] text-white font-black uppercase tracking-[0.15em] text-[12px] flex items-center justify-center gap-3 transition-all hover:bg-[#20BD5A] active:scale-[0.98]"
              >
                Get Best Deal on WhatsApp
              </button>
              <button
                onClick={() => {
                  setIsAvailabilityOpen(false);
                  const num = content.whatsappNumber?.replace(/\D/g, '') || '';
                  const message = `Hi ${content.storeName},\n\nI'm interested in getting an exact quote & photos for:\nProduct: ${availabilityProduct?.name} (Starting from ${availabilityProduct?.priceLabel})\n\nPlease let me know:\n1. Exact price for my required size\n2. Fabric/Wood customization options\n3. Delivery time to my pincode`;
                  window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="w-full py-2 text-[11px] font-bold uppercase tracking-wider text-[#8C8881] hover:text-[#1C1B1A] transition-colors"
              >
                Skip & Chat Directly
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const BottomCTA = () => (
    <div className="w-full pt-12 pb-6 px-2 flex justify-center">
      <div className="w-full max-w-md">
        <motion.div
          key="global-cta" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springConfig}
          onClick={() => handleGeneralInquiry()}
          className="bg-white/80 backdrop-blur-xl p-2.5 pl-6 rounded-full border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
        >
          <div onClick={(e) => { if (isPreview && onEditSection) { e.stopPropagation(); handleEdit('categories'); }}}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#94A690] mb-0.5">{content.bottomCtaTitle}</p>
            <p className="text-[12px] font-medium tracking-wide text-[#1C1B1A]">{content.bottomCtaSubTitle}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_8px_20px_rgba(37,211,102,0.3)] shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className={`${isPreview ? 'min-h-full' : 'min-h-screen'} bg-[#F7F5F0] text-[#1C1B1A] font-sans relative flex flex-col w-full overflow-x-hidden`}>
      {/* Category Selector Popup for General Inquiry */}
      <CategorySelectorModal />
      <AvailabilityModal />
      
      {/* HEADER */}
      <AnimatePresence>
        {step !== "landing" && (
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={springConfig}
            className={`${isPreview ? (isMobileMode ? 'absolute top-8' : 'absolute top-2') : 'fixed top-4 md:top-8'} w-full z-40 flex justify-between items-center px-5 pt-2 pb-2 pointer-events-none`}
          >
            <button
              onClick={handleBack}
              className="w-10 h-10 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center pointer-events-auto hover:bg-white transition-all shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-95 border border-white/40 shrink-0"
            >
              <ChevronLeft strokeWidth={2} className="w-5 h-5 text-[#1C1B1A]" />
            </button>
            
            <div className="flex items-center gap-2 pointer-events-auto bg-white/80 backdrop-blur-xl pl-1 pr-5 py-1 rounded-full border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="h-8 w-8 rounded-full bg-white border border-black/5 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                <img src={content.logoUrl} alt={content.storeName} className="w-full h-full object-cover" />
              </div>
              <h1 className="font-serif text-[1.1rem] tracking-tight text-[#1C1B1A] select-none font-medium leading-none">{content.storeName}.</h1>
            </div>

            <div className="w-10 shrink-0" />
          </motion.header>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-2 w-full min-h-full">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ========== 1. LANDING PAGE ========== */}
          {step === "landing" && (
            <motion.section key="landing" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="flex min-h-full flex-col items-center px-5 pt-8 pb-32 w-full max-w-7xl mx-auto">
              
              <motion.div variants={fadeUp} className="relative mb-6 flex justify-center">
                <div className="absolute inset-0 bg-[#D47A5A]/5 rounded-full blur-2xl scale-150 pointer-events-none" />
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-[1px] border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative z-10">
                  <img src={content.logoUrl} alt={content.storeName} className="w-full h-full object-cover scale-105" />
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                onClick={(event) => handleEdit('content', event)}
                className={`font-serif ${isMobileMode ? 'text-[2.75rem]' : 'text-[2.75rem] md:text-[4rem]'} tracking-tighter text-[#1C1B1A] mb-3 font-normal leading-none text-center cursor-pointer`}
              >
                {content.storeName}.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                onClick={(event) => handleEdit('content', event)}
                className={`text-center text-[#6B665F] ${isMobileMode ? 'text-[14px]' : 'text-[14px] md:text-[18px]'} leading-relaxed mb-12 font-light px-2 max-w-2xl cursor-pointer`}
              >
                <strong className="font-medium text-[#1C1B1A]">{content.tagline}.</strong><br/>
                {content.subTagline}
              </motion.p>

              {/* TESTIMONIALS */}
              <motion.div
                variants={fadeUp}
                onClick={(event) => handleEdit('testimonials', event)}
                className="w-full mb-12 relative max-w-4xl cursor-pointer"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-[1px] w-8 bg-black/5" />
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8C8881]">Loved by 1000+ Homes</h3>
                  <div className="h-[1px] w-8 bg-black/5" />
                </div>
                
                <div
                  className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory px-1 -mx-1 no-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onClick={(event) => handleEdit('testimonials', event)}
                >
                  {TESTIMONIALS.map((t: Testimonial, i: number) => (
                    <div
                      key={i}
                      className="snap-center shrink-0 w-[280px] bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 relative overflow-hidden"
                      onClick={(event) => handleEdit('testimonials', event)}
                    >
                      <Quote strokeWidth={1} className="absolute -top-3 -right-3 w-16 h-16 text-[#F7F5F0] opacity-80" />
                      <div className="flex items-center gap-1 mb-4 relative z-10">
                        {[...Array(5)].map((_, idx) => <Star key={idx} strokeWidth={1.5} className="w-3.5 h-3.5 fill-[#D47A5A] text-[#D47A5A]" />)}
                      </div>
                      <p className="text-[14px] text-[#1C1B1A] leading-relaxed mb-5 relative z-10 font-light">&quot;{t.text}&quot;</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8C8881] relative z-10">— {t.name}, <span className="text-[#D47A5A]">{t.city}</span></p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* PRIMARY CTA */}
              <motion.div variants={fadeUp} className="w-full mb-16 max-w-md">
                <button
                  onClick={() => {
                    if (isPreview && onEditSection) {
                      onEditSection('categories');
                    }
                    setActiveCategory(null);
                    navigate("categories", 1);
                  }}
                  className="w-full py-4 rounded-[2rem] bg-[#1C1B1A] text-[#F7F5F0] text-[15px] font-medium tracking-wide flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(28,27,26,0.15)] active:scale-[0.98] transition-all hover:bg-black group"
                >
                  {content.heroCtaText}
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all border border-white/5">
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
                  </div>
                </button>
                <p className="text-center text-[10px] font-medium text-[#8C8881] mt-4 tracking-wide">
                  {content.heroCtaSubtext}
                </p>
              </motion.div>

              {/* MAP SECTION */}
              <motion.div variants={fadeUp} className="w-full max-w-2xl px-5">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-[1px] w-10 bg-black/5" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C8881]">Visit Our Studio</h3>
                  <div className="h-[1px] w-10 bg-black/5" />
                </div>
                
                <div
                  className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white/60 cursor-pointer flex flex-col"
                  onClick={(event) => handleEdit('location', event)}
                >
                  {/* MAP ON TOP */}
                  <div className="w-full h-[260px] relative bg-[#EBE6DC] overflow-hidden m-2 rounded-[2rem]" style={{ width: 'calc(100% - 16px)' }}>
                    {mapEmbedUrl ? (
                      <iframe
                        title="Map location"
                        src={mapEmbedUrl}
                        className="absolute inset-0 h-full w-full border-0 grayscale-[0.15] opacity-90"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    ) : (
                      <img src={content.mapImage} alt="Map Location" className="w-full h-full object-cover grayscale-[0.15]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.12)] relative border border-white/50">
                          <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                          <MapPin strokeWidth={1.5} className="w-5 h-5 text-[#D47A5A]" />
                      </div>
                    </div>
                  </div>
                  {/* LOCATION INFO BELOW */}
                  <div className="px-8 pt-6 pb-8 text-center">
                    <h4 className="font-serif text-[1.4rem] tracking-tight text-[#1C1B1A] mb-2 leading-tight">{content.experienceCenterName}</h4>
                    <p className="text-[13px] text-[#6B665F] leading-relaxed font-light italic mb-6">{content.experienceCenterAddress}</p>
                    <a
                      onClick={(event) => handleEdit('location', event)}
                      href={content.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-[1.5rem] bg-[#1C1B1A] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-black/5 shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:bg-black active:scale-[0.98]"
                    >
                      Get Directions <ExternalLink strokeWidth={1.5} className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <BottomCTA />
            </motion.section>
          )}

          {/* ========== 2. CATEGORIES SELECTION ========== */}
          {step === "categories" && (
            <motion.section key="categories" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-full px-5 pt-20 pb-32 w-full max-w-7xl mx-auto">
              <motion.div variants={fadeUp} className="mb-8 cursor-pointer" onClick={() => handleEdit('categories')}>
                <h2 className="font-serif text-[2.75rem] md:text-[4rem] leading-[0.9] tracking-tighter text-[#1C1B1A] mb-3">
                  {content.categoriesStepTitle?.includes('?') ? (
                    <>
                      {content.categoriesStepTitle.split('?')[0]}?<br/>
                      <em className="italic text-[#D47A5A] font-light">
                        {content.categoriesStepTitle.split('?')[1] || ""}
                      </em>
                    </>
                  ) : (
                    content.categoriesStepTitle
                  )}
                </h2>
                <p className="text-[14px] md:text-[18px] font-light text-[#6B665F] tracking-wide">{content.categoriesStepSubTitle}</p>
              </motion.div>

              <div className={`flex flex-col ${previewMode === 'mobile' ? '' : 'md:grid md:grid-cols-3'} gap-6 md:gap-8`}>
                {(content.categories || []).map((cat: Category) => (
                  <motion.button
                    key={cat.id} variants={fadeUp}
                    onClick={(event) => {
                      // Switch editor sidebar to products
                      if (isPreview && onEditSection) {
                        onEditSection('products');
                      }
                      
                      setActiveCategory(cat);
                      navigate("recommendations", 1);
                    }}
                    className={`group relative w-full h-[220px] ${previewMode === 'mobile' ? '' : 'md:h-[450px]'} rounded-[2.5rem] ${previewMode === 'mobile' ? '' : 'md:rounded-[3.5rem]'} overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] active:scale-[0.97] transition-all text-left border border-white/60`}
                  >
                    <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.25,1,0.35,1] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1C1B1A]/80 via-[#1C1B1A]/40 to-transparent" />
                    <div className={`absolute inset-0 p-6 ${previewMode === 'mobile' ? '' : 'md:p-10'} flex items-center justify-between ${previewMode === 'mobile' ? '' : 'md:items-end'}`}>
                      <div>
                        <h4 className={`font-serif text-[1.75rem] ${previewMode === 'mobile' ? '' : 'md:text-[2.25rem]'} text-white tracking-tight leading-none mb-2 ${previewMode === 'mobile' ? '' : 'md:mb-4'}`}>
                          {cat.label}
                        </h4>
                        <p className="text-[#D47A5A] text-[10px] font-bold tracking-[0.25em] uppercase opacity-90">
                          {cat.tagline}
                        </p>
                      </div>
                      <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 ${previewMode === 'mobile' ? '' : 'md:w-14 md:h-14 md:top-10 md:right-10 md:translate-y-0'} rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center transition-all text-white border border-white/20 shadow-lg shrink-0`}>
                        <ArrowRight strokeWidth={1.5} className={`w-4 h-4 ${previewMode === 'mobile' ? '' : 'md:w-6 md:h-6'}`} />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <BottomCTA />
            </motion.section>
          )}

          {/* ========== 3. RECOMMENDATIONS ========== */}
          {step === "recommendations" && (
            <motion.section key="recommendations" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-full px-4 pt-20 pb-32 w-full max-w-7xl mx-auto">
              <motion.div variants={fadeUp} className="mb-8 px-2 cursor-pointer" onClick={() => handleEdit('products')}>
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#D47A5A] uppercase mb-2 block">{content.preTitle}</span>
                <h2 className={`font-serif ${isMobileMode ? 'text-[2.5rem]' : 'text-[2.5rem] md:text-[3.5rem]'} leading-[0.9] tracking-tighter text-[#1C1B1A] mb-3`}>
                  Top 3 picks for {activeCategory?.label || content.title || "Our Collection"}
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-bold text-[#1C1B1A] bg-white px-2 py-1 rounded border border-black/5">✔ Best Value</span>
                  <span className="text-[10px] font-bold text-[#1C1B1A] bg-white px-2 py-1 rounded border border-black/5">✔ Most Popular</span>
                  <span className="text-[10px] font-bold text-[#1C1B1A] bg-white px-2 py-1 rounded border border-black/5">✔ Premium Choice</span>
                </div>
              </motion.div>

              {recommendedProducts.length > 0 ? (
                <>
                  <div className="space-y-6 md:space-y-6 lg:space-y-12">
                {recommendedProducts.map((product: Product, i: number) => {
                  const getTierData = () => {
                    const t = product.tier;
                    if (t === 'best_value') return { label: "🔥 Best Value", color: "bg-[#D47A5A]" };
                    if (t === 'most_popular') return { label: "⭐ Most Popular", color: "bg-[#94A690]" };
                    if (t === 'premium') return { label: "💎 Premium", color: "bg-[#1C1B1A]" };
                    
                    // Fallback to index-based if no tier is set
                    if (i === 0) return { label: "🔥 Best Value", color: "bg-[#D47A5A]" };
                    if (i === 1) return { label: "⭐ Most Popular", color: "bg-[#94A690]" };
                    return { label: "💎 Premium", color: "bg-[#1C1B1A]" };
                  };

                  const { label: tierLabel, color: tierColor } = getTierData();
                  
                  return (
                    <motion.article
                      key={product.id} variants={fadeUp}
                      className={`bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden relative flex flex-col ${isMobileMode ? '' : 'lg:flex-row lg:items-center'} ${
                        (product.tier === 'best_value' || (!product.tier && i === 0)) ? 'border-[1px] border-[#D47A5A]/30 shadow-[0_30px_60px_rgba(212,122,90,0.12)]' : 'border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'
                      }`}
                    >
                      <div className={`absolute top-5 left-5 ${tierColor} text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full z-10 shadow-lg backdrop-blur-md border border-white/20`}>
                        {tierLabel}
                      </div>
                      <div
                        className={`w-full aspect-[4/3] ${isMobileMode ? '' : 'lg:w-[400px] lg:aspect-square lg:m-4'} overflow-hidden cursor-pointer group relative m-1.5 rounded-[2rem] shrink-0`}
                        onClick={(event) => handleProductClick(product, event)}
                      >
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className={`px-5 pt-4 pb-6 ${isMobileMode ? '' : 'lg:p-10 lg:justify-center'} flex flex-col flex-1`}>
                        <div
                          onClick={(event) => handleProductClick(product, event)}
                          className="cursor-pointer mb-6 lg:mb-8"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className={`font-serif ${isMobileMode ? 'text-[1.5rem]' : 'text-[1.5rem] lg:text-[2.5rem]'} tracking-tight leading-[1.1] text-[#1C1B1A] pr-3 mb-2`}>{product.name}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D47A5A] flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#D47A5A] animate-pulse" />
                                {product.urgency}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-[#F7F5F0] px-3 py-1.5 rounded-[0.75rem] shrink-0 border border-black/5 shadow-sm">
                              <Star strokeWidth={1.5} className="w-3.5 h-3.5 text-[#D47A5A] fill-[#D47A5A]/20" />
                              <span className="text-xs font-black text-[#1C1B1A]">{product.rating || "4.8"}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 sm:gap-6 mb-3">
                            <div className="flex flex-col shrink-0">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#8C8881] mb-1 whitespace-nowrap">Starting from</span>
                              <span className={`text-[1rem] ${isMobileMode ? '' : 'sm:text-[1.25rem] lg:text-[1.75rem]'} font-medium text-[#1C1B1A] tracking-tighter leading-none whitespace-nowrap`}>{product.priceLabel}</span>
                            </div>
                            <div className="h-8 w-px bg-black/10 shrink-0" />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#8C8881] mb-1">Shipping</span>
                              <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold text-[#D47A5A] uppercase tracking-wider leading-none">{product.delivery}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => {
                              setAvailabilityProduct(product);
                              setIsAvailabilityOpen(true);
                            }}
                            className="flex-1 py-4 lg:py-5 rounded-[1.5rem] bg-[#25D366] text-white text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,211,102,0.2)] hover:bg-[#20BD5A] transition-all"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Get Best Deal
                          </button>
                          <button
                            onClick={(e) => handleProductClick(product, e)}
                            className="px-6 py-4 lg:py-5 rounded-[1.5rem] bg-black text-white text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
                </div>
                <div className="mt-12 flex justify-center w-full px-4">
                  <AnimatePresence mode="wait">
                    {!isCustomRequestOpen ? (
                      <motion.button
                        key="cta_btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setIsCustomRequestOpen(true)}
                        className="flex items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-black/10 transition-all w-full max-w-md group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#F7F5F0] flex items-center justify-center group-hover:bg-[#D47A5A]/10 transition-colors">
                            <MessageSquare className="w-5 h-5 text-[#1C1B1A] group-hover:text-[#D47A5A] transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D47A5A] mb-0.5">Tailor-Made Design</p>
                            <p className="text-sm font-bold text-[#1C1B1A]">Get exactly what you want</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1C1B1A]/40 group-hover:text-[#D47A5A] transition-colors">
                          Tell Us & Chat <ArrowRight size={14} />
                        </div>
                      </motion.button>
                    ) : (
                      <motion.div
                        key="custom_req"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-black/5"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="font-serif text-xl text-[#1C1B1A]">Personal Design Concierge</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#D47A5A] mt-1">Designers are online</p>
                          </div>
                          <button onClick={() => setIsCustomRequestOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F5F0] text-[#1C1B1A] hover:bg-black hover:text-white transition-all">
                            <X size={14} />
                          </button>
                        </div>

                        <textarea
                          autoFocus
                          value={customRequestText}
                          onChange={(e) => setCustomRequestText(e.target.value)}
                          placeholder="What can we build for you today?"
                          className="w-full h-32 p-4 rounded-xl bg-[#F7F5F0]/50 border border-black/5 text-sm text-[#1C1B1A] placeholder-[#1C1B1A]/20 focus:outline-none focus:bg-white focus:border-[#D47A5A]/30 resize-none transition-all mb-6"
                        />

                        <button
                          disabled={!customRequestText.trim()}
                          onClick={() => handleWhatsAppCTA("custom_request_cta")}
                          className="w-full py-4 rounded-xl bg-[#1C1B1A] text-white font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-black/90 active:scale-[0.98] disabled:opacity-20"
                        >
                          <MessageCircle size={16} fill="currentColor" />
                          Send to Designers
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-inner">
                  <div className="w-16 h-16 rounded-2xl bg-[#F7F5F0] flex items-center justify-center mb-6 border border-black/5">
                    <Package strokeWidth={1} className="w-8 h-8 text-[#8C8881]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1C1B1A] mb-2">No products here yet</h3>
                  <p className="text-[13px] text-[#6B665F] font-light max-w-[240px]">We haven't added pieces to this collection yet. Check back soon!</p>
                  <button 
                    onClick={() => navigate("categories", -1)}
                    className="mt-8 px-8 py-3 rounded-full bg-[#1C1B1A] text-white text-[11px] font-bold uppercase tracking-[0.15em] active:scale-95 transition-all"
                  >
                    Go Back
                  </button>
                </div>
              )}

              </motion.section>
          )}

          {/* ========== 4. PRODUCT DETAILS ========== */}
          {step === "details" && selectedProduct && (
            <motion.section key="details" custom={direction} variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-full pb-32 w-full max-w-7xl mx-auto">
              {/* Premium Image Gallery */}
              <div className="w-full bg-[#F7F5F0] relative group">
                <div 
                  className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const index = Math.round(container.scrollLeft / container.clientWidth);
                    setActiveImageIndex(index);
                  }}
                >
                  <div className="w-full shrink-0 snap-center aspect-[4/5] sm:aspect-square relative">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  {selectedProduct.image2 && (
                    <div className="w-full shrink-0 snap-center aspect-[4/5] sm:aspect-square relative">
                      <img src={selectedProduct.image2} alt={`${selectedProduct.name} alternate view`} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {/* Subtle bottom gradient for image to content transition */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                
                {/* Premium Indicator Pills */}
                {selectedProduct.image2 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    <div className={`transition-all duration-300 ${activeImageIndex === 0 ? 'w-5 bg-[#1C1B1A]' : 'w-1.5 bg-black/20'} h-1.5 rounded-full`} />
                    <div className={`transition-all duration-300 ${activeImageIndex === 1 ? 'w-5 bg-[#1C1B1A]' : 'w-1.5 bg-black/20'} h-1.5 rounded-full`} />
                  </div>
                )}
              </div>

              {/* Premium Details Downside */}
              <div className="px-5 pt-4 pb-12 bg-white relative z-10">
                <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
                  <div className="flex flex-col mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-[#FFF8E7] px-2.5 py-1 rounded-md border border-[#F2D794]">
                        <Star strokeWidth={2} className="w-3.5 h-3.5 text-[#F2A900] fill-[#F2A900]" />
                        <span className="text-[11px] font-bold text-[#1C1B1A]">{selectedProduct.rating || "4.8"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F2F7F2] px-2.5 py-1 rounded-md border border-[#C5DEC8]">
                        <ShieldCheck strokeWidth={2} className="w-3.5 h-3.5 text-[#4CAF50]" />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#2E6B30]">100% Solid Wood</span>
                      </div>
                    </div>
                    <h2 className="font-serif text-[2.25rem] sm:text-[3rem] tracking-tight text-[#1C1B1A] leading-[1.05]">{selectedProduct.name}</h2>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#D47A5A] animate-pulse" />
                      <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#D47A5A]">{selectedProduct.urgency}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-10 w-full">
                    <div className="bg-gradient-to-b from-[#FDFCFB] to-[#F7F5F0] p-4 sm:p-5 rounded-[1.25rem] border border-[#EAE8E3] flex-1 shrink-0 flex flex-col justify-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8881] mb-1.5 whitespace-nowrap">Factory Price</p>
                      <p className="text-[1.35rem] sm:text-[1.75rem] font-bold tracking-tighter text-[#1C1B1A] leading-none whitespace-nowrap">{selectedProduct.priceLabel}</p>
                    </div>
                    <div className="bg-gradient-to-b from-[#FDFCFB] to-[#F7F5F0] p-4 sm:p-5 rounded-[1.25rem] border border-[#EAE8E3] flex-1 min-w-0 flex flex-col justify-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8881] mb-1.5">Est. Delivery</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Truck strokeWidth={2} className="w-3.5 h-3.5 text-[#D47A5A] shrink-0" />
                        <p className="text-[1rem] sm:text-[1.25rem] font-bold tracking-tight text-[#D47A5A] uppercase w-full leading-none">{selectedProduct.delivery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10 cursor-pointer" onClick={() => handleEdit('products')}>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1C1B1A] mb-4 border-b border-black/5 pb-2">Product Narrative</h4>
                    <p className="text-[13px] sm:text-[15px] text-[#6B665F] leading-[1.8] font-light">
                      {selectedProduct.description ?? `Handcrafted by master artisans in Jodhpur, this ${selectedProduct.name} combines timeless Sheesham wood durability with modern ergonomics. By cutting out retail middlemen, we deliver this certified factory unit directly to your home at unbeatable value.`}
                    </p>
                  </div>

                  {/* Premium Specifications */}
                  {(selectedProduct.dimensions || selectedProduct.material || selectedProduct.finish) && (
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1C1B1A] mb-5 border-b border-black/5 pb-2">Premium Specifications</h4>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {selectedProduct.dimensions && (
                          <div className="p-4 rounded-[1.25rem] bg-[#FDFCFB] border border-black/[0.03] shadow-sm">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C8881] mb-1">Dimensions</p>
                            <p className="text-[12px] font-black text-[#1C1B1A] leading-tight">{selectedProduct.dimensions}</p>
                          </div>
                        )}
                        {selectedProduct.material && (
                          <div className="p-4 rounded-[1.25rem] bg-[#FDFCFB] border border-black/[0.03] shadow-sm">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C8881] mb-1">Primary Material</p>
                            <p className="text-[12px] font-black text-[#1C1B1A] leading-tight">{selectedProduct.material}</p>
                          </div>
                        )}
                        {selectedProduct.finish && (
                          <div className="p-4 rounded-[1.25rem] bg-[#FDFCFB] border border-black/[0.03] shadow-sm">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C8881] mb-1">Finish Type</p>
                            <p className="text-[12px] font-black text-[#1C1B1A] leading-tight">{selectedProduct.finish}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}


                  <div className="mb-10">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1C1B1A] mb-5 border-b border-black/5 pb-2">Elite Craftsmanship</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {(selectedProduct.benefits && selectedProduct.benefits.length > 0 ? selectedProduct.benefits : [
                        { title: "Certified Solid Wood", desc: "No MDF or particle board. Only premium seasoned Sheesham/Teak." },
                        { title: "Factory-Direct Pricing", desc: "Save up to 40% by avoiding showroom markups and agent commissions." },
                        { title: "Customizable Finish", desc: "WhatsApp us to choose your preferred wood stain or fabric color." }
                      ]).map((benefit: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#F7F5F0]/50 border border-black/[0.03]">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#D47A5A] shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-[#1C1B1A] mb-0.5">{benefit.title}</p>
                            <p className="text-[11px] text-[#6B665F] leading-relaxed">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sticky bottom-4 z-50">
                    <button
                      onClick={() => {
                        setAvailabilityProduct(selectedProduct);
                        setIsAvailabilityOpen(true);
                      }}
                      className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-[16px] font-black tracking-wide flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_20px_40px_rgba(37,211,102,0.4)] transition-all active:scale-[0.98] border border-white/20"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Get Best Deal
                    </button>
                    <div className="flex justify-center mt-3">
                      <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[#8C8881] bg-[#F7F5F0] py-1.5 px-4 rounded-full border border-black/5 shadow-sm">
                        🔒 Secured Chat & Guarantee
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <BottomCTA />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2');
          font-weight: 300 900;
        }
        .font-sans { font-family: 'Satoshi', sans-serif; }
      ` }} />
    </div>
  );
});
