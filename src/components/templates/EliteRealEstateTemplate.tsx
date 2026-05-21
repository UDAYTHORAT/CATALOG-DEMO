'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createLead } from "@/app/actions/leads";
import type {
  CategoriesData,
  Content,
  HeroData,
  LocationData,
  ProductItem,
  ProductsData,
  SectionId,
  TestimonialsData,
  WhatsAppData,
} from '@/components/dashboard/editor/types';
import { createDefaultSections, getSectionData, REAL_ESTATE_TEMPLATE_ID } from '@/components/dashboard/editor/utils';

// ───────────────────────────────────────────────────────────────────────────────
// COORDINATES LOOKUP UTILITIES FOR INTERACTIVE BLUEPRINT
// ───────────────────────────────────────────────────────────────────────────────
function getRoomBlueprintCoords(roomId: string, index: number, totalRooms: number) {
  const coordinatesMap: Record<string, { x: number; y: number; w: number; h: number }> = {
    living: { x: 6, y: 8, w: 56, h: 44 },
    kitchen: { x: 6, y: 56, w: 36, h: 36 },
    master: { x: 46, y: 56, w: 48, h: 36 },
    deck: { x: 66, y: 8, w: 28, h: 44 },
    guest: { x: 54, y: 48, w: 22, h: 44 }
  };

  const idClean = String(roomId).toLowerCase();
  for (const k of Object.keys(coordinatesMap)) {
    if (idClean.includes(k)) {
      return coordinatesMap[k];
    }
  }

  // Fallback grid-based layout calculation if room ID does not match standard zones
  const columns = Math.ceil(Math.sqrt(totalRooms));
  const rows = Math.ceil(totalRooms / columns);
  const colIndex = index % columns;
  const rowIndex = Math.floor(index / columns);

  const w = Math.max(20, Math.floor(88 / columns));
  const h = Math.max(20, Math.floor(88 / rows));
  const x = 6 + colIndex * (w + 4);
  const y = 6 + rowIndex * (h + 4);

  return { x, y, w, h };
}

// ───────────────────────────────────────────────────────────────────────────────
// TEMPLATE PROPS
// ───────────────────────────────────────────────────────────────────────────────
type TemplateProps = {
  funnel: {
    id?: string;
    welcome_title?: string | null;
    welcome_description?: string | null;
    story_mode_data?: Array<{ content?: Partial<Content>; templateId?: string }>;
    slug?: string | null;
  };
  store?: {
    id?: string;
    name?: string | null;
    logo_url?: string | null;
    whatsapp_number?: string | null;
  };
  products?: any[];
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
};

// ───────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE
// ───────────────────────────────────────────────────────────────────────────────
export default function EliteRealEstateTemplate({
  funnel,
  store,
  products: propProducts,
  isPreview = false,
  previewMode,
  onEditSection,
}: TemplateProps) {
  const defaultSections = useMemo(() => createDefaultSections(REAL_ESTATE_TEMPLATE_ID), []);
  const savedContent = funnel.story_mode_data?.[0]?.content as Content | undefined;

  const content = useMemo(() => {
    const baseContent: Content = {
      storeName: savedContent?.storeName || store?.name || 'SAUNTER',
      logoUrl: savedContent?.logoUrl || store?.logo_url || '',
      whatsappNumber: savedContent?.whatsappNumber || store?.whatsapp_number || '919999999999',
      sections: savedContent?.sections && savedContent.sections.length > 0 ? savedContent.sections : defaultSections,
    };

    const heroData = getSectionData<HeroData>(
      baseContent,
      'content',
      defaultSections.find((section) => section.id === 'content')?.data as HeroData
    );
    const categoriesData = getSectionData<CategoriesData>(
      baseContent,
      'categories',
      defaultSections.find((section) => section.id === 'categories')?.data as CategoriesData
    );
    const productsData = getSectionData<ProductsData>(
      baseContent,
      'products',
      defaultSections.find((section) => section.id === 'products')?.data as ProductsData
    );
    const testimonialsData = getSectionData<TestimonialsData>(
      baseContent,
      'testimonials',
      defaultSections.find((section) => section.id === 'testimonials')?.data as TestimonialsData
    );
    const locationData = getSectionData<LocationData>(
      baseContent,
      'location',
      defaultSections.find((section) => section.id === 'location')?.data as LocationData
    );
    const whatsappData = getSectionData<WhatsAppData>(
      baseContent,
      'whatsapp',
      defaultSections.find((section) => section.id === 'whatsapp')?.data as WhatsAppData
    );

    return {
      baseContent,
      heroData,
      categoriesData,
      productsData,
      testimonialsData,
      locationData,
      whatsappData,
    };
  }, [defaultSections, savedContent, store?.logo_url, store?.name, store?.whatsapp_number]);

  const rawProducts = (propProducts && propProducts.length > 0) ? propProducts : content.productsData.products;

  const normalizedProducts = useMemo(() => {
    return rawProducts.map((product: any, productIdx: number) => {
      const isPenthouseIndex = productIdx % 2 !== 0;

      const defaultRooms3BHK = [
        { 
          id: 'living', 
          name: 'Living Room', 
          area: '450 sqft', 
          atmosphere: 'Sea-facing lounge', 
          note: 'Italian travertine floors, acoustic glass, skyline-facing deck.', 
          details: ["Italian travertine floors", "Acoustic glass", "Skyline-facing deck"], 
          images: [
            product.image_url || product.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '6%', top: '8%', width: '56%', height: '44%' },
          x: 6, y: 8, w: 56, h: 44, label: "Living",
          direction: { x: 0, y: 0, scale: 1 },
          highlight: true 
        },
        { 
          id: 'kitchen', 
          name: 'Kitchen', 
          area: '210 sqft', 
          atmosphere: 'Culinary studio', 
          note: 'Gaggenau appliances, Calacatta marble island, concealed pantry.', 
          details: ["Gaggenau appliances", "Calacatta marble island", "Concealed pantry"], 
          images: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '6%', top: '56%', width: '36%', height: '36%' },
          x: 6, y: 56, w: 36, h: 36, label: "Kitchen",
          direction: { x: -40, y: 0, scale: 1.02 }
        },
        { 
          id: 'master', 
          name: 'Master Suite', 
          area: '320 sqft', 
          atmosphere: 'Absolute privacy', 
          note: 'Floor-to-ceiling glazing, walk-in wardrobe, private terrace.', 
          details: ["Floor-to-ceiling glazing", "Walk-in wardrobe", "Private terrace"], 
          images: [
            product.image_url_2 || product.image2 || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '46%', top: '56%', width: '48%', height: '36%' },
          x: 46, y: 56, w: 48, h: 36, label: "Master",
          direction: { x: 40, y: 20, scale: 1.04 }
        },
        { 
          id: 'deck', 
          name: 'Private Deck', 
          area: '180 sqft', 
          atmosphere: 'Sunset view', 
          note: 'Cantilevered terrace, sea breeze orientation, teak decking.', 
          details: ["Cantilevered terrace", "Sea breeze orientation", "Teak decking"], 
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '66%', top: '8%', width: '28%', height: '44%' },
          x: 66, y: 8, w: 28, h: 44, label: "Deck",
          direction: { x: 0, y: -40, scale: 0.98 }
        }
      ];

      const defaultRooms4BHK = [
        { 
          id: 'living', 
          name: 'Living Room', 
          area: '450 sqft', 
          atmosphere: 'Skyline expanse', 
          note: 'Italian travertine floors, acoustic glass, skyline-facing deck.', 
          details: ["Italian travertine floors", "Acoustic glass", "Skyline-facing deck"], 
          images: [
            product.image_url || product.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '6%', top: '6%', width: '60%', height: '38%' },
          x: 6, y: 6, w: 60, h: 38, label: "Living",
          direction: { x: 0, y: 0, scale: 1 },
          highlight: true 
        },
        { 
          id: 'kitchen', 
          name: 'Kitchen', 
          area: '210 sqft', 
          atmosphere: 'Gourmet suite', 
          note: 'Gaggenau appliances, Calacatta marble island, concealed pantry.', 
          details: ["Gaggenau appliances", "Calacatta marble island", "Concealed pantry"], 
          images: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '70%', top: '6%', width: '24%', height: '38%' },
          x: 70, y: 6, w: 24, h: 38, label: "Kitchen",
          direction: { x: -40, y: 0, scale: 1.02 }
        },
        { 
          id: 'master', 
          name: 'Master Suite', 
          area: '320 sqft', 
          atmosphere: 'Horizon suite', 
          note: 'Floor-to-ceiling glazing, walk-in wardrobe, private terrace.', 
          details: ["Floor-to-ceiling glazing", "Walk-in wardrobe", "Private terrace"], 
          images: [
            product.image_url_2 || product.image2 || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '6%', top: '48%', width: '44%', height: '44%' },
          x: 6, y: 48, w: 44, h: 44, label: "Master",
          direction: { x: 40, y: 20, scale: 1.04 }
        },
        { 
          id: 'guest', 
          name: 'Guest Suite', 
          area: '240 sqft', 
          atmosphere: 'Private sanctuary', 
          note: 'Independent entry, ensuite bath, city views.', 
          details: ["Independent entry", "Ensuite bath", "City views"], 
          images: [
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '54%', top: '48%', width: '22%', height: '44%' },
          x: 54, y: 48, w: 22, h: 44, label: "Guest",
          direction: { x: 30, y: 10, scale: 1 }
        },
        { 
          id: 'deck', 
          name: 'Private Deck', 
          area: '180 sqft', 
          atmosphere: 'Infinity sky', 
          note: 'Cantilevered terrace, sea breeze orientation, teak decking.', 
          details: ["Cantilevered terrace", "Sea breeze orientation", "Teak decking"], 
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80'
          ].filter(Boolean), 
          layout: { left: '80%', top: '48%', width: '14%', height: '44%' },
          x: 80, y: 48, w: 14, h: 44, label: "Deck",
          direction: { x: 0, y: -40, scale: 0.98 }
        }
      ];

      const defaultRooms = isPenthouseIndex ? defaultRooms4BHK : defaultRooms3BHK;
      const rawRooms = product.rooms || defaultRooms;

      const mappedRooms = rawRooms.map((room: any, rIdx: number) => {
        const roomId = room.id || `room-${rIdx}`;
        const coords = getRoomBlueprintCoords(roomId, rIdx, rawRooms.length);
        
        return {
          id: roomId,
          name: room.name || room.label || 'Room',
          area: room.area || room.sqft || '200 sqft',
          atmosphere: room.atmosphere || 'Serene space',
          note: room.note || room.description || room.desc || 'A masterfully designed volume.',
          details: room.details || room.notes || ['Premium finish', 'High ceiling'],
          images: room.images || [room.img || room.image].filter(Boolean) || [product.image_url || product.image].filter(Boolean),
          x: room.x !== undefined ? room.x : coords.x,
          y: room.y !== undefined ? room.y : coords.y,
          w: room.w !== undefined ? room.w : coords.w,
          h: room.h !== undefined ? room.h : coords.h,
          label: room.label || room.name || 'Room',
          direction: room.direction || {
            x: rIdx % 2 === 0 ? -30 : 30,
            y: rIdx % 3 === 0 ? -20 : 20,
            scale: 1.02
          }
        };
      });

      return {
        id: product.id ?? `prop-${Date.now()}`,
        category_id: product.category_id || 'luxury',
        name: product.name ?? (isPenthouseIndex ? '4 BHK Penthouse' : '3 BHK Signature'),
        priceLabel: product.priceLabel || (product.price ? `₹ ${product.price.toLocaleString('en-IN')}` : (isPenthouseIndex ? '₹ 8.5 Cr' : '₹ 6.2 Cr')),
        image: product.image_url || product.image || (isPenthouseIndex ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80" : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80"),
        image2: product.image_url_2 || product.image2 || undefined,
        urgency: product.urgency || (isPenthouseIndex ? 'Last Unit Available' : '3 Units Remaining'),
        delivery: product.delivery || 'Possession: Q4 2025',
        description: product.description || (isPenthouseIndex ? 'Full-floor residence with private plunge pool and 360° skyline.' : 'Sea-facing living volume with private deck and architectural light wells.'),
        dimensions: product.dimensions || (isPenthouseIndex ? '2,140 sqft' : '1,850 sqft'),
        tier: product.tier || 'most_popular',
        rooms: mappedRooms
      };
    });
  }, [rawProducts]);

  const [screen, setScreen] = useState<'home' | 'residences' | 'tour'>('home');
  const [residenceId, setResidenceId] = useState<string | null>(null);

  const activeResidence = useMemo(() => {
    const match = normalizedProducts.find((p) => p.id === residenceId);
    return match || normalizedProducts[0];
  }, [normalizedProducts, residenceId]);

  // Smart pre-load: only hero images per product (rooms load on-demand in Tour)
  useEffect(() => {
    normalizedProducts.forEach((p) => {
      if (p.image) {
        const img = new Image();
        img.src = p.image;
      }
    });
  }, [normalizedProducts]);

  const handleWhatsAppCTA = useCallback(
    async (intent: string, product?: any, messageOverride?: string) => {
      const number = content.baseContent.whatsappNumber?.replace(/\D/g, '') || '';
      if (!number) return;

      if (!isPreview) {
        await createLead(
          funnel?.id || 'preview',
          store?.id || 'preview',
          'Visitor',
          '',
          JSON.stringify({ type: 'cta_click', source: intent, productId: product?.id }),
          product?.id
        );
      }

      let message = messageOverride || `Hi ${content.baseContent.storeName || "SAUNTER"},\n\n`;
      if (!messageOverride) {
        if (product) {
          message = (content.whatsappData.productInquiryText || message)
            .replace('{product_name}', product.name)
            .replace('{store_name}', content.baseContent.storeName);
        } else {
          message = (content.whatsappData.welcomeMessage || message)
            .replace('{store_name}', content.baseContent.storeName);
        }
      }

      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    },
    [content.baseContent.storeName, content.baseContent.whatsappNumber, content.whatsappData.productInquiryText, content.whatsappData.welcomeMessage, funnel?.id, isPreview, store?.id]
  );

  return (
    <div className="relative w-full min-h-screen bg-[#FAF9F5] text-[#1C1917] selection:bg-[#9A7B44]/20 font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
         .font-serif { font-family: 'Cormorant Garamond', serif; }
         .font-sans { font-family: 'Inter', system-ui, sans-serif; }
         .no-scrollbar::-webkit-scrollbar { display:none; }
         .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
         
         /* Premium Scrollbar */
         .premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
         .premium-scroll::-webkit-scrollbar-track { background: transparent; }
         .premium-scroll::-webkit-scrollbar-thumb { background: #1D1B18; border-radius: 3px; }
         .premium-scroll::-webkit-scrollbar-thumb:hover { background: #C5A26B; }
       `}} />

      <TopBar
        brandName={content.baseContent.storeName || "SAUNTER"}
        onHome={() => setScreen("home")}
        isPreview={isPreview}
        previewMode={previewMode}
      />

      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Home
              content={content}
              normalizedProducts={normalizedProducts}
              onExplore={() => setScreen("residences")}
              isPreview={isPreview}
              previewMode={previewMode}
              onEditSection={onEditSection}
            />
          </motion.div>
        )}
        {screen === "residences" && (
          <motion.div
            key="res"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Residences
              products={normalizedProducts}
              onBack={() => setScreen("home")}
              onPick={(id) => {
                setResidenceId(id);
                setScreen("tour");
              }}
              isPreview={isPreview}
              previewMode={previewMode}
              onEditSection={onEditSection}
            />
          </motion.div>
        )}
        {screen === "tour" && (
          <motion.div
            key="tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tour
              residence={activeResidence}
              onBack={() => setScreen("residences")}
              onWhatsApp={handleWhatsAppCTA}
              storeName={content.baseContent.storeName || "SAUNTER"}
              isPreview={isPreview}
              previewMode={previewMode}
              onEditSection={onEditSection}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {screen === "home" && (
        <ActionBar
          onFloorplan={() => setScreen("residences")}
          onWhatsApp={() => handleWhatsAppCTA("action_bar_whatsapp", activeResidence)}
          onVisit={() => handleWhatsAppCTA("action_bar_visit", activeResidence, `Hi ${content.baseContent.storeName || "SAUNTER"}, I'd like to schedule a private visit to ${activeResidence?.name || 'the property'}.`)}
          isPreview={isPreview}
          previewMode={previewMode}
        />
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// REUSABLE SUB-COMPONENTS
// ───────────────────────────────────────────────────────────────────────────────

function TopBar({
  brandName,
  onHome,
  isPreview,
  previewMode
}: {
  brandName: string;
  onHome: () => void;
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';

  return (
    <header
      className={`${
        isPreview
          ? `absolute inset-x-0 ${isMobilePreview ? 'top-6' : 'top-0'}`
          : 'fixed top-0 inset-x-0'
      } z-40 bg-[#FAF9F5]/70 backdrop-blur-lg border-b border-[#E7E5E4]/30`}
    >
      <div
        className={`max-w-[1400px] mx-auto ${isMobilePreview ? 'px-5' : 'px-5 md:px-10'} flex items-center justify-between ${
          isMobilePreview ? 'h-16 pt-2' : 'h-14'
        }`}
      >
        <button
          onClick={onHome}
          className={`font-serif ${isMobilePreview ? 'text-sm tracking-wider' : 'text-sm md:text-lg tracking-wider'} text-[#1C1917] cursor-pointer uppercase whitespace-nowrap truncate max-w-[65%]`}
        >
          {brandName}
        </button>
        <span className={`${isMobilePreview ? 'text-[8px]' : 'text-[8px] md:text-[10px]'} tracking-wider text-[#78716C] uppercase whitespace-nowrap font-medium`}>
          RERA Verified
        </span>
      </div>
    </header>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-[#E7E5E4]">
      <span className="text-[10px] tracking-[0.28em] uppercase text-[#A8A29E]">{label}</span>
      <span className="font-serif text-lg text-[#1C1917]">{value}</span>
    </div>
  );
}

function Home({
  content,
  normalizedProducts,
  onExplore,
  isPreview,
  previewMode,
  onEditSection
}: {
  content: any;
  normalizedProducts: any[];
  onExplore: () => void;
  isPreview: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const { heroData, locationData, categoriesData, testimonialsData } = content;
  const startingPrice = heroData?.startingPrice || normalizedProducts[0]?.priceLabel || "₹ 6.2 Cr";
  const status = heroData?.status || normalizedProducts[0]?.delivery || "Ready for Possession";
  const experienceCenterAddress = locationData?.experienceCenterAddress || "Worli Sea Face · Mumbai";
  const heroImage = heroData?.heroImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80";

  const isCompact = isMobilePreview || false;

  return (
    <main className={`${isMobilePreview ? 'pt-24' : 'pt-14'}`}>
      {/* ── FULLSCREEN HERO ── */}
      <section
        className={`relative w-full ${isCompact ? 'h-[88vh]' : 'h-[92vh]'} overflow-hidden cursor-pointer`}
        onClick={() => isPreview && onEditSection?.('content')}
      >
        <img
          src={heroImage}
          alt={heroData?.tagline || "Residences"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Adjusted gradients for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

        {/* Top row — badges (Grouped cleanly at top left) */}
        <div className={`absolute ${isCompact ? 'top-5 left-5 right-5' : 'top-6 left-8 right-8'} flex flex-wrap gap-2`}>
          <span className="px-2.5 py-1.5 bg-black/30 backdrop-blur-md text-white/90 text-[9px] font-semibold tracking-wider uppercase border border-white/10 rounded-sm shadow-sm">
            {heroData?.heroBadge || 'RERA Verified'}
          </span>
          <span className="px-2.5 py-1.5 bg-black/30 backdrop-blur-md text-white/90 text-[9px] font-semibold tracking-wider uppercase border border-white/10 rounded-sm shadow-sm">
            {status}
          </span>
        </div>

        {/* Center — title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className={`text-[10px] tracking-widest uppercase text-white/70 mb-4 font-semibold drop-shadow-md`}>
            {experienceCenterAddress}
          </p>
          <h1 className={`font-serif ${isCompact ? 'text-5xl' : 'text-6xl md:text-[7rem]'} leading-[0.95] text-white tracking-tight drop-shadow-lg`}>
            {heroData?.tagline || "Own The Skyline"}
          </h1>
          <p className={`mt-6 ${isCompact ? 'text-sm' : 'text-base'} text-white/80 max-w-lg leading-relaxed drop-shadow-md`}>
            {heroData?.subTagline || "Private sea-facing residences with panoramic skyline views."}
          </p>
        </div>

        {/* Bottom row — CTA + price (App-like side-by-side layout) */}
        <div className={`absolute bottom-0 left-0 right-0 ${isCompact ? 'px-5 pb-6' : 'px-8 md:px-14 pb-10'}`}>
          <div className="border-t border-white/15 pt-5 flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white/60 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Starting</span>
              <span className="text-white font-serif text-2xl md:text-3xl drop-shadow-md">{startingPrice}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onExplore(); }}
              className={`group inline-flex items-center justify-center gap-2.5 bg-white text-[#1C1917] ${
                isCompact ? 'px-6 py-3.5 text-[10px]' : 'px-8 py-4 text-[11px]'
              } tracking-wider uppercase font-bold hover:bg-[#9A7B44] hover:text-white transition-all duration-400 cursor-pointer rounded-sm shadow-lg`}
            >
              Explore <span className="transition-transform duration-400 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── AVAILABLE RESIDENCES ── */}
      <section
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} py-16 cursor-pointer`}
        onClick={() => isPreview && onEditSection?.('products')}
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-[#9A7B44] font-medium">
              Available
            </span>
            <h2 className="font-serif text-3xl text-[#1C1917] mt-1">
              Residences
            </h2>
          </div>
          <span className="text-[10px] text-[#78716C] tracking-wider uppercase">
            {normalizedProducts.length} configurations
          </span>
        </div>

        <div className={`grid ${isCompact ? 'grid-cols-1 gap-10' : 'grid-cols-1 md:grid-cols-3 gap-8'}`}>
          {normalizedProducts.map((p: any, idx: number) => {
            const rooms = p.rooms || [];
            return (
              <div
                key={p.id}
                onClick={(e) => { e.stopPropagation(); onExplore(); }}
                className="group relative cursor-pointer"
              >
                {/* Image panel */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F0EDE5]">
                  <img
                    src={p.image || heroImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Scarcity badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[9px] font-semibold tracking-wider bg-white/95 text-[#1C1917] uppercase rounded-sm shadow-sm">
                      {p.urgency || 'Available'}
                    </span>
                  </div>

                  {/* Overlay text */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">{p.dimensions || '—'}</p>
                    <h3 className="text-white font-serif text-2xl mt-0.5 leading-tight">{p.name}</h3>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between px-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-xl text-[#1C1917]">{p.priceLabel}</span>
                    <span className="text-[10px] text-[#A8A29E]">· {rooms.length} rooms</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#9A7B44] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                    View →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} py-16 cursor-pointer`}
        onClick={() => isPreview && onEditSection?.('location')}
      >
        {/* Header - Left Aligned Editorial Style */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-[#9A7B44]" />
            <span className="text-[10px] tracking-widest uppercase text-[#9A7B44] font-bold">
              Location
            </span>
          </div>
          <h2 className={`font-serif ${isCompact ? 'text-4xl' : 'text-5xl'} text-[#1C1917] leading-tight`}>
            {locationData?.experienceCenterName || "Project Site"}
          </h2>
          <p className="text-sm text-[#78716C] mt-3 max-w-md">
            {locationData?.experienceCenterAddress || "Tower 3, Baner Hills, Pune"}
          </p>
        </div>

        {/* Map Container - Clean and Unobstructed */}
        <div className={`relative w-full ${isCompact ? 'h-[320px]' : 'h-[460px]'} bg-[#E7E5E4] rounded-sm overflow-hidden border border-[#E7E5E4]/60`}>
          {locationData?.mapLink?.includes('http') && locationData.mapLink.includes('embed') ? (
            <iframe
              src={locationData.mapLink}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <img
              src={locationData?.mapImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"}
              alt="Location"
              className="w-full h-full object-cover opacity-95"
            />
          )}
        </div>

        {/* Connectivity Grid - Pulled OUT of the map for an elite architectural layout */}
        <div className="mt-6 border border-[#E7E5E4] rounded-sm bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E7E5E4]">
            {(locationData?.connectivity || [
              { label: "Highway", time: "3 min" },
              { label: "Hospital", time: "5 min" },
              { label: "Airport", time: "25 min" },
              { label: "Metro", time: "8 min" },
            ]).map((c: any, index: number) => (
              <div key={c.label} className={`p-5 flex flex-col gap-1.5 ${isCompact && index < 2 ? 'border-b border-[#E7E5E4]' : ''}`}>
                <span className="text-[9px] text-[#A8A29E] uppercase tracking-widest font-bold">{c.label}</span>
                <span className="text-xl font-serif text-[#1C1917]">{c.time}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E7E5E4] p-4 flex justify-between items-center bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] transition-colors">
            <span className="text-[10px] text-[#78716C] uppercase tracking-wider hidden md:block">
              Strategic Connectivity
            </span>
            <a
              href={locationData?.mapLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-[10px] text-[#1C1917] hover:text-[#9A7B44] uppercase tracking-widest font-bold transition-colors ${isCompact ? 'w-full justify-center' : ''}`}
            >
              Get Directions <span className="text-[14px] leading-none mb-0.5">↗</span>
            </a>
          </div>
        </div>
      </section>

      <div className="h-20" />
    </main>
  );
}

function Residences({
  products,
  onBack,
  onPick,
  isPreview,
  previewMode,
  onEditSection
}: {
  products: any[];
  onBack: () => void;
  onPick: (id: string) => void;
  isPreview: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const isCompact = isMobilePreview || false;
  return (
    <main className={`${isMobilePreview ? 'pt-24' : 'pt-14'} min-h-screen`}>
      <div className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} py-8 flex items-center justify-between`}>
        <button onClick={onBack} className="text-[11px] tracking-wider uppercase text-[#78716C] hover:text-[#9A7B44] cursor-pointer transition-colors">← Back</button>
        <span className="text-[10px] tracking-wider uppercase text-[#9A7B44] font-medium">{products.length} Residences</span>
      </div>
      <div
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} pb-32 grid ${isCompact ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'} ${isPreview ? 'cursor-pointer' : ''}`}
        onClick={() => isPreview && onEditSection?.('products')}
      >
        {products.map((r, i) => (
          <ResidenceCard key={r.id} r={r} index={i} onPick={() => onPick(r.id)} />
        ))}
      </div>
    </main>
  );
}

function ResidenceCard({ r, index, onPick }: { r: any; index: number; onPick: () => void }) {
  return (
    <motion.div
      onClick={onPick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group text-left bg-white hover:shadow-lg transition-shadow duration-500 cursor-pointer w-full p-5 sm:p-7"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-serif text-2xl text-[#1C1917]">{r.name}</h3>
          <p className="text-[10px] text-[#A8A29E] uppercase tracking-wider mt-1">{r.dimensions}</p>
        </div>
        <span className="px-2.5 py-1 text-[9px] font-semibold tracking-wider bg-[#9A7B44]/10 text-[#9A7B44] uppercase rounded-sm">
          {r.urgency}
        </span>
      </div>
      <MiniBlueprint plan={r.rooms || []} />
      <p className="mt-5 text-sm text-[#57534E] leading-relaxed max-w-md">{r.description}</p>
      <div className="mt-6 flex items-end justify-between">
        <span className="font-serif text-3xl text-[#1C1917]">{r.priceLabel}</span>
        <span className="text-[10px] tracking-wider uppercase text-[#9A7B44] font-medium group-hover:translate-x-1 transition-transform duration-400">
          Explore Space →
        </span>
      </div>
    </motion.div>
  );
}

function getMiniRoomType(room: any): string {
  if (room.type) return room.type;
  const id = String(room.id).toLowerCase();
  if (id.includes('living')) return 'living';
  if (id.includes('kitchen')) return 'kitchen';
  if (id.includes('master') || id.includes('bed') || id.includes('guest')) return 'bedroom';
  if (id.includes('bath') || id.includes('toilet') || id.includes('wc')) return 'bathroom';
  if (id.includes('balcony') || id.includes('deck') || id.includes('terrace')) return 'balcony';
  if (id.includes('entrance') || id.includes('foyer') || id.includes('lobby')) return 'entrance';
  if (id.includes('corridor') || id.includes('passage') || id.includes('hall')) return 'corridor';
  if (id.includes('utility') || id.includes('wash')) return 'utility';
  if (id.includes('dining')) return 'dining';
  if (id.includes('pooja') || id.includes('prayer')) return 'pooja';
  if (id.includes('study') || id.includes('office')) return 'study';
  return 'living';
}

const MINI_TYPE_STYLES: Record<string, { border: string; activeBorder: string; bg: string; activeBg: string; text: string; icon: string }> = {
  living:   { border: 'rgba(154,123,68,0.15)', activeBorder: '#9A7B44', bg: 'rgba(255,255,255,0.4)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  bedroom:  { border: 'rgba(139,92,246,0.15)', activeBorder: '#9A7B44', bg: 'rgba(139,92,246,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  kitchen:  { border: 'rgba(245,158,11,0.15)', activeBorder: '#9A7B44', bg: 'rgba(245,158,11,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  bathroom: { border: 'rgba(6,182,212,0.25)', activeBorder: '#06b6d4', bg: 'rgba(6,182,212,0.05)', activeBg: 'rgba(6,182,212,0.12)', text: '#0891b2', icon: '🚿' },
  balcony:  { border: 'rgba(16,185,129,0.25)', activeBorder: '#10b981', bg: 'rgba(16,185,129,0.04)', activeBg: 'rgba(16,185,129,0.10)', text: '#059669', icon: '🌿' },
  entrance: { border: 'rgba(244,63,94,0.25)', activeBorder: '#f43f5e', bg: 'rgba(244,63,94,0.04)', activeBg: 'rgba(244,63,94,0.10)', text: '#e11d48', icon: '🚪' },
  corridor: { border: 'rgba(148,163,184,0.20)', activeBorder: '#94a3b8', bg: 'rgba(148,163,184,0.04)', activeBg: 'rgba(148,163,184,0.10)', text: '#64748b', icon: '' },
  utility:  { border: 'rgba(249,115,22,0.20)', activeBorder: '#f97316', bg: 'rgba(249,115,22,0.04)', activeBg: 'rgba(249,115,22,0.10)', text: '#ea580c', icon: '⚡' },
  dining:   { border: 'rgba(20,184,166,0.15)', activeBorder: '#9A7B44', bg: 'rgba(20,184,166,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  pooja:    { border: 'rgba(234,179,8,0.20)', activeBorder: '#eab308', bg: 'rgba(234,179,8,0.04)', activeBg: 'rgba(234,179,8,0.10)', text: '#ca8a04', icon: '🪔' },
  study:    { border: 'rgba(59,130,246,0.15)', activeBorder: '#9A7B44', bg: 'rgba(59,130,246,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  store:    { border: 'rgba(168,162,158,0.15)', activeBorder: '#9A7B44', bg: 'rgba(168,162,158,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
};

const DEFAULT_MINI_STYLE = MINI_TYPE_STYLES.living;

function MiniBlueprint({
  plan,
  activeId,
  onSelectRoom
}: {
  plan: any[];
  activeId?: string;
  onSelectRoom?: (id: string) => void;
}) {
  const totalRooms = plan.length;
  const mappedRooms = plan.map((room: any, index: number) => {
    const coords = getRoomBlueprintCoords(room.id, index, totalRooms);
    return {
      id: room.id,
      type: room.type,
      x: room.x !== undefined ? room.x : coords.x,
      y: room.y !== undefined ? room.y : coords.y,
      w: room.w !== undefined ? room.w : coords.w,
      h: room.h !== undefined ? room.h : coords.h,
      label: room.label || room.name || 'Room'
    };
  });

  return (
    <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-[#FAF9F5] to-[#F0EDE5] border border-[#E7E5E4]/60 overflow-hidden">
      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="none">
        <defs>
          <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#9A7B44" strokeWidth="0.3" />
          </pattern>
          {/* Bathroom hatching */}
          <pattern id="mini-bath-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#06b6d4" strokeWidth="0.6" opacity="0.25" />
          </pattern>
          {/* Balcony hatching */}
          <pattern id="mini-balcony-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#10b981" strokeWidth="0.5" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      {/* Compass */}
      <div className="absolute top-2 right-3 flex items-center gap-1 opacity-30">
        <span className="text-[7px] tracking-wider uppercase font-bold text-[#9A7B44]">N</span>
        <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 3,6 5,5 7,6" fill="#9A7B44"/></svg>
      </div>
      {/* Room cells */}
      {mappedRooms.map((room) => {
        const active = room.id === activeId;
        const Tag = onSelectRoom ? 'button' : 'div';
        const roomType = getMiniRoomType(room);
        const style = MINI_TYPE_STYLES[roomType] || DEFAULT_MINI_STYLE;
        const isEntrance = roomType === 'entrance';
        const isBathroom = roomType === 'bathroom';
        const isBalcony = roomType === 'balcony';

        // Smart rotation & character-fit font size calculation
        const isVertical = room.h > room.w * 1.25;
        const needsRotation = isVertical && room.w < 22;
        const availableSpace = needsRotation ? room.h : room.w;
        const labelLength = room.label.length;
        const charWidthFactor = 0.46; // Sattoshi font letter spacing factor

        let fontSize = 9;
        const requiredSpace = labelLength * fontSize * charWidthFactor;
        if (requiredSpace > availableSpace) {
          fontSize = Math.max(5.5, (availableSpace / (labelLength * charWidthFactor)));
        }

        // Cap for extremely tight bounds
        if (room.w < 9 && !needsRotation) fontSize = 5.5;
        if (room.h < 9 && needsRotation) fontSize = 5.5;

        const rotateStyle = needsRotation ? { writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)' } : {};

        return (
          <Tag
            key={room.id}
            {...(onSelectRoom ? { onClick: () => onSelectRoom(room.id) } : {})}
            className={`absolute transition-all duration-400 ${
              onSelectRoom ? 'cursor-pointer' : 'cursor-default'
            } ${active ? 'z-10' : 'z-0'}`}
            style={{
              left: `${room.x}%`,
              top: `${room.y}%`,
              width: `${room.w}%`,
              height: `${room.h}%`,
              border: `2px ${isBalcony ? 'dashed' : 'solid'} ${active ? style.activeBorder : style.border}`,
              background: active ? style.activeBg : style.bg,
              boxShadow: active
                ? `0 2px 12px rgba(154,123,68,0.15), inset 0 0 16px rgba(154,123,68,0.06)`
                : "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            {/* Bathroom hatching overlay */}
            {isBathroom && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect width="100%" height="100%" fill="url(#mini-bath-hatch)" />
              </svg>
            )}
            {/* Balcony hatching overlay */}
            {isBalcony && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect width="100%" height="100%" fill="url(#mini-balcony-hatch)" />
              </svg>
            )}
            {/* Center-aligned smart auto-scaling & rotating room label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1 pointer-events-none overflow-hidden">
              <span
                className="font-bold uppercase tracking-[0.12em] text-center leading-none max-w-full block whitespace-nowrap"
                style={{
                  fontSize: `${fontSize}px`,
                  color: active ? '#9A7B44' : style.text,
                  ...rotateStyle
                }}
              >
                {room.label}
              </span>
              {active && (
                <span className="mt-1 text-[6px] tracking-widest uppercase font-mono text-[#9A7B44]/50 leading-none">
                  {room.w}×{room.h}
                </span>
              )}
            </div>
          </Tag>
        );
      })}
    </div>
  );
}

function Tour({
  residence,
  onBack,
  onWhatsApp,
  storeName,
  isPreview,
  previewMode,
  onEditSection
}: {
  residence: any;
  onBack: () => void;
  onWhatsApp: (intent: string, product?: any, messageOverride?: string) => void;
  storeName: string;
  isPreview: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
}) {
  const GOLD = '#9A7B44';
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const rooms = residence?.rooms || [];
  const [activeId, setActiveId] = useState<string>(rooms[0]?.id || "");
  const [imgIdx, setImgIdx] = useState(0);
  const [blueprintOpen, setBlueprintOpen] = useState(false);

  const room = useMemo(() => {
    return rooms.find((r: any) => r.id === activeId) || rooms[0];
  }, [rooms, activeId]);

  useEffect(() => {
    if (rooms.length > 0 && !rooms.some((r: any) => r.id === activeId)) {
      setActiveId(rooms[0].id);
    }
  }, [rooms, activeId]);

  useEffect(() => { setImgIdx(0); }, [activeId]);

  if (!room) return null;

  const allImages: string[] = room.images?.length ? room.images : (room.img ? [room.img] : [residence.image]);
  const img = allImages[imgIdx] || allImages[0] || residence.image;

  const roomIndex = rooms.findIndex((r: any) => r.id === activeId);
  const goNext = () => { if (roomIndex < rooms.length - 1) setActiveId(rooms[roomIndex + 1].id); };
  const goPrev = () => { if (roomIndex > 0) setActiveId(rooms[roomIndex - 1].id); };
  const counter = `${String(roomIndex + 1).padStart(2, '0')} / ${String(rooms.length).padStart(2, '0')}`;

  const onInquire = () => onWhatsApp(
    'tour_room_cta',
    residence,
    `Hi ${storeName}, I am exploring the ${room.name} of ${residence.name}. I'd love to discuss this space.`
  );

  return (
    <main className={`${isMobilePreview ? 'pt-24' : 'pt-14'} min-h-screen bg-[#FAF9F5] text-[#1C1917] overflow-hidden`}>

      {/* ── DESKTOP/TABLET: Split-panel — Image left + Sidebar right ── */}
      {!isMobilePreview && (
        <section className="relative w-full h-[calc(100vh-3.5rem)] flex">

          {/* LEFT — Image area */}
          <div className="relative flex-1 h-full overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div key={`${activeId}-${imgIdx}`} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 will-change-transform">
                <img src={img} alt={room.name} className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.7) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 80%, rgba(0,0,0,0.4) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />

            {/* Top nav */}
            <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 pt-5">
              <button onClick={onBack} className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-pointer">
                <span className="w-9 h-9 rounded-full bg-white/8 backdrop-blur-xl border border-white/15 flex items-center justify-center group-hover:bg-white/15 transition-colors text-sm">←</span>
                <span className="text-xs tracking-[0.3em] uppercase font-medium">Back</span>
              </button>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 backdrop-blur-xl text-white/90 text-base font-semibold tracking-[0.25em] uppercase border border-white/15 rounded-full">
                <span className="w-1 h-1 rounded-full" style={{ background: GOLD }} />{residence.name}
              </span>
            </div>

            {/* Bottom title overlay */}
            <div className="absolute bottom-0 inset-x-0 z-20 px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <h2 className="font-serif text-[44px] leading-[0.92] text-white tracking-tight mb-2" style={{ textShadow: '0 3px 30px rgba(0,0,0,0.5)' }}>{room.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 text-sm font-serif">{room.area}</span>
                    {room.atmosphere && (<><span className="text-white/20">·</span><span className="text-white/50 text-sm italic font-serif">{room.atmosphere}</span></>)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Gallery lines */}
            {allImages.length > 1 && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                {allImages.map((_: string, i: number) => (
                  <button key={i} onClick={() => setImgIdx(i)} className="group flex items-center gap-3 cursor-pointer">
                    <span className={`block w-px transition-all duration-500 ${i === imgIdx ? 'h-8' : 'h-3 group-hover:bg-white/70'}`} style={{ background: i === imgIdx ? GOLD : 'rgba(255,255,255,0.3)' }} />
                    <span className={`font-mono text-xs tracking-widest transition-opacity ${i === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-60 text-white/60'}`} style={{ color: i === imgIdx ? GOLD : undefined }}>{String(i + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar panel */}
          <div className="w-[300px] lg:w-[380px] shrink-0 h-full bg-[#FAF9F5] border-l border-[#E7E5E4] flex flex-col z-10">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E9C89233 transparent' }}>
              {/* Price header */}
              <div className="px-5 pt-5 pb-4 border-b border-[#E7E5E4] shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: GOLD }}>Residence</span>
                  <span className="text-[#1C1917] font-serif text-xl">{residence.priceLabel}</span>
                </div>
              </div>

              {/* Floor Plan — always visible */}
              <div className="px-5 py-5 border-b border-[#E7E5E4] shrink-0">
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-4" style={{ color: GOLD }}>Select a Space</p>
                <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
                  <MiniBlueprint plan={rooms} activeId={activeId} onSelectRoom={(id) => setActiveId(id)} />
                </div>
              </div>

              {/* Features */}
              {(room.details || []).length > 0 && (
                <div className="px-5 py-5 border-b border-[#E7E5E4] shrink-0">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-3" style={{ color: GOLD }}>Space Highlights</p>
                  <div className="flex flex-col gap-2">
                    {(room.details || []).map((f: string) => (
                      <div key={f} className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#E7E5E4] rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                        <span className="text-xs text-[#57534E]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ownership */}
              <div className="px-5 py-5 border-b border-[#E7E5E4] shrink-0">
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-3" style={{ color: GOLD }}>Ownership</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: 'Tenure', value: 'Freehold' }, { label: 'Possession', value: residence.delivery || 'Ready' }, { label: 'Parking', value: '3 EV Bays' }].map((s) => (
                    <div key={s.label} className="bg-white border border-[#E7E5E4] rounded-lg p-3 text-center">
                      <span className="block text-[9px] tracking-[0.1em] uppercase text-[#A8A29E] font-bold mb-1">{s.label}</span>
                      <span className="block text-xs text-[#1C1917] font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              {room.note && (
                <div className="px-5 py-5 border-b border-[#E7E5E4] shrink-0">
                  <p className="text-sm text-[#78716C] italic font-serif leading-relaxed">"{room.note}"</p>
                </div>
              )}
            </div>

            {/* Sticky CTA */}
            <div className="px-5 py-5 bg-[#FAF9F5] shrink-0 border-t border-[#E7E5E4]">
              <button onClick={onInquire} className="w-full py-3.5 text-[11px] tracking-wider uppercase font-bold rounded-sm cursor-pointer transition-all duration-500 hover:bg-[#86693a] text-white" style={{ background: GOLD }}>
                Inquire About This Space →
              </button>
            </div>
          </div>
        </section>
      )}


      {/* ── MOBILE: Image hero + scrollable content ── */}
      {isMobilePreview && (
        <div className="flex flex-col">

          {/* IMAGE HERO — 55vh with title overlay */}
          <div className="relative w-full h-[55vh] overflow-hidden shrink-0">
            <AnimatePresence mode="sync">
              <motion.div key={`${activeId}-${imgIdx}`} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 will-change-transform">
                <img src={img} alt={room.name} className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.8) 100%)' }} />

            {/* Top bar */}
            <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 pt-3">
              <button onClick={onBack} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-sm cursor-pointer">←</button>
              <span className="px-3 py-1 bg-black/30 backdrop-blur-xl text-white/90 text-xs font-semibold tracking-[0.25em] uppercase border border-white/10 rounded-full">{residence.priceLabel}</span>
            </div>

            {/* Room title + dots on image */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <AnimatePresence mode="wait">
                <motion.h2 key={activeId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="font-serif text-[28px] leading-none text-white mb-2" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
                  {room.name}
                </motion.h2>
              </AnimatePresence>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80 font-serif">{room.area}</span>
                <div className="flex-1" />
                <div className="flex gap-1.5">
                  {rooms.map((r: any) => (
                    <button key={r.id} onClick={() => setActiveId(r.id)} className={`transition-all duration-400 cursor-pointer rounded-full ${r.id === activeId ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SCROLLABLE CONTENT PANEL */}
          <div className="bg-[#FAF9F5] relative z-10 px-5 pt-5 pb-28">

            {/* Floor Plan */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-4" style={{ color: GOLD }}>Spatial Layout</p>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
                <MiniBlueprint plan={rooms} activeId={activeId} onSelectRoom={(id) => setActiveId(id)} />
              </div>
            </div>

            {/* Features */}
            {(room.details || []).length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-3" style={{ color: GOLD }}>Space Highlights</p>
                <div className="grid grid-cols-2 gap-2">
                  {(room.details || []).map((f: string) => (
                    <div key={f} className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-[#E7E5E4] rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                      <span className="text-xs text-[#57534E]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ownership */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-3" style={{ color: GOLD }}>Ownership</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: 'Tenure', value: 'Freehold' }, { label: 'Possession', value: residence.delivery || 'Ready' }, { label: 'Parking', value: '3 EV Bays' }].map((s) => (
                  <div key={s.label} className="bg-white border border-[#E7E5E4] rounded-lg p-3 text-center">
                    <span className="block text-[9px] tracking-[0.1em] uppercase text-[#A8A29E] font-bold mb-1">{s.label}</span>
                    <span className="block text-xs text-[#1C1917] font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            {room.note && (
              <div className="mb-6 py-4 border-t border-b border-[#E7E5E4]">
                <p className="text-sm text-[#78716C] italic font-serif leading-relaxed">"{room.note}"</p>
              </div>
            )}

            {/* CTA */}
            <button onClick={onInquire} className="w-full py-3.5 text-[10px] tracking-wider uppercase font-bold rounded-sm cursor-pointer transition-all duration-500 hover:bg-[#86693a] text-white" style={{ background: GOLD }}>
              Inquire About This Space →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


function ActionBar({
  onFloorplan,
  onWhatsApp,
  onVisit,
  isPreview,
  previewMode
}: {
  onFloorplan: () => void;
  onWhatsApp: () => void;
  onVisit: () => void;
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';

  return (
    <div
      className={`${
        isPreview
          ? `absolute inset-x-0 ${isMobilePreview ? 'bottom-6' : 'bottom-0'}`
          : 'fixed bottom-0 inset-x-0'
      } z-40 border-t border-[#E7E5E4] bg-[#FAF9F5]/90 backdrop-blur-md`}
    >
      <div className={`max-w-[1400px] mx-auto ${isMobilePreview ? 'px-3' : 'px-3 md:px-10'} h-16 grid grid-cols-3 gap-2 items-center`}>
        <button
          onClick={onFloorplan}
          className={`text-center py-2 ${isMobilePreview ? 'text-[10px]' : 'text-[10px] md:text-[11px]'} tracking-wider uppercase text-[#57534E] hover:text-[#9A7B44] transition-colors cursor-pointer`}
        >
          Floorplan
        </button>
        <button
          onClick={onWhatsApp}
          className={`text-center py-3 bg-[#9A7B44] text-white ${isMobilePreview ? 'text-[10px]' : 'text-[10px] md:text-[11px]'} tracking-wider uppercase font-medium hover:bg-[#86693a] transition-colors cursor-pointer rounded-sm`}
        >
          WhatsApp
        </button>
        <button
          onClick={onVisit}
          className={`text-center py-2 ${isMobilePreview ? 'text-[10px]' : 'text-[10px] md:text-[11px]'} tracking-wider uppercase text-[#57534E] hover:text-[#9A7B44] transition-colors cursor-pointer`}
        >
          Visit
        </button>
      </div>
    </div>
  );
}
