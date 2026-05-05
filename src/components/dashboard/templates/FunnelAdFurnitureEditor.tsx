'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { produce } from 'immer';
import {
  CheckCircle2,
  ChevronLeft,
  Copy,
  Loader2,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Redo2,
  Rocket,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  ExternalLink,
  X,
} from 'lucide-react';
import { useEditorHistory } from '@/components/dashboard/editor/hooks/useEditorHistory';
import type { Funnel } from '@/app/actions/funnels';
import { updateFunnel } from '@/app/actions/funnels';
import type { Product } from '@/app/actions/products';
import EditorSidebar from '@/components/dashboard/editor/EditorSidebar';
import PreviewPane from '@/components/dashboard/editor/PreviewPane';
import CategoriesPanel from '@/components/dashboard/editor/sections/CategoriesPanel';
import HeroPanel from '@/components/dashboard/editor/sections/HeroPanel';
import LocationPanel from '@/components/dashboard/editor/sections/LocationPanel';
import ProductsPanel from '@/components/dashboard/editor/sections/ProductsPanel';
import StorePanel from '@/components/dashboard/editor/sections/StorePanel';
import TestimonialsPanel from '@/components/dashboard/editor/sections/TestimonialsPanel';
import WhatsAppPanel from '@/components/dashboard/editor/sections/WhatsAppPanel';
import type {
  CategoriesData,
  CategoryItem,
  Content,
  HeroData,
  LocationData,
  PreviewMode,
  ProductItem,
  ProductsData,
  Section,
  SectionId,
  TabId,
  TestimonialItem,
  TestimonialsData,
  WhatsAppData,
} from '@/components/dashboard/editor/types';
import {
  createDefaultSections,
  createInitialContent,
  FALLBACK_PRODUCT_IMAGE,
  formatProductPrice,
  getSectionData,
} from '@/components/dashboard/editor/utils';

const previewModes: Array<{ id: PreviewMode; label: string; icon: React.ReactNode }> = [
  { id: 'mobile', label: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'tablet', label: 'Tablet', icon: <Tablet className="h-4 w-4" /> },
  { id: 'desktop', label: 'Desktop', icon: <Monitor className="h-4 w-4" /> },
];

export default function FunnelAdFurnitureEditor({
  funnel,
  allProducts: products = [],
}: {
  funnel: Funnel;
  allProducts?: Product[];
}) {
  const defaultSectionsRef = useRef<Section[]>(createDefaultSections());
  const initialContent = useMemo(() => createInitialContent(funnel), [funnel]);

  // ✅ FIX #1: Properly destructure the history hook for cleaner state access
  const {
    current: draftContent,
    push: pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorHistory(initialContent);

  const [activeTab, setActiveTab] = useState<TabId>('store');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('mobile');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [changeTick, setChangeTick] = useState(0);

  const saveSuccessTimer = useRef<NodeJS.Timeout | null>(null);
  const copyTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<Content>(structuredClone(initialContent));
  const isPendingSaveRef = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ FIX #3: Simplified updateContent - centralized state mutation through history
  const updateContent = useCallback(
    (recipe: (draft: Content) => void) => {
      const next = produce(draftContent, recipe);
      pushHistory(next);
      setSaveSuccess(false);
      setSaveError(null);
      setChangeTick((prev) => prev + 1);
    },
    [draftContent, pushHistory]
  );

  const handleSectionUpdate = useCallback(
    <T extends SectionId>(sectionId: T, updater: (data: Section['data']) => void) => {
      updateContent((draft) => {
        let section = draft.sections.find((item) => item.id === sectionId);
        if (!section) {
          const fallback = defaultSectionsRef.current.find((item) => item.id === sectionId);
          if (!fallback) return;
          const nextSection = structuredClone(fallback);
          draft.sections.push(nextSection);
          section = nextSection;
        }
        updater(section.data);
      });
    },
    [updateContent]
  );

  const handleStoreUpdate = useCallback(
    (key: 'storeName' | 'whatsappNumber' | 'logoUrl', value: string) => {
      updateContent((draft) => {
        draft[key] = value;
      });
    },
    [updateContent]
  );

  const heroData = getSectionData<HeroData>(
    draftContent,
    'content',
    defaultSectionsRef.current.find((section) => section.id === 'content')?.data as HeroData
  );
  const categoriesData = getSectionData<CategoriesData>(
    draftContent,
    'categories',
    defaultSectionsRef.current.find((section) => section.id === 'categories')?.data as CategoriesData
  );
  const productsData = getSectionData<ProductsData>(
    draftContent,
    'products',
    defaultSectionsRef.current.find((section) => section.id === 'products')?.data as ProductsData
  );
  const testimonialsData = getSectionData<TestimonialsData>(
    draftContent,
    'testimonials',
    defaultSectionsRef.current.find((section) => section.id === 'testimonials')?.data as TestimonialsData
  );
  const locationData = getSectionData<LocationData>(
    draftContent,
    'location',
    defaultSectionsRef.current.find((section) => section.id === 'location')?.data as LocationData
  );
  const whatsappData = getSectionData<WhatsAppData>(
    draftContent,
    'whatsapp',
    defaultSectionsRef.current.find((section) => section.id === 'whatsapp')?.data as WhatsAppData
  );

  const handleReorderSections = useCallback((nextSections: Section[]) => {
    updateContent((draft) => {
      draft.sections = nextSections;
    });
  }, [updateContent]);

  const handleAddCategory = useCallback(() => {
    handleSectionUpdate('categories', (data) => {
      const nextId = `cat-${Date.now()}`;
      (data as CategoriesData).categories.push({
        id: nextId,
        label: 'New Collection',
        tagline: 'Short collection tagline.',
        image: '/images/sofa/sofa-1.jpg',
      });
    });
  }, [handleSectionUpdate]);

  const handleUpdateCategory = useCallback(
    (index: number, updates: Partial<CategoryItem | CategoriesData>) => {
      handleSectionUpdate('categories', (data) => {
        if (index === -1) {
          Object.assign(data, updates);
        } else {
          const categories = (data as CategoriesData).categories;
          if (!categories[index]) return;
          categories[index] = { ...categories[index], ...(updates as Partial<CategoryItem>) };
        }
      });
    },
    [handleSectionUpdate]
  );

  const handleRemoveCategory = useCallback(
    (categoryId: string) => {
      handleSectionUpdate('categories', (data) => {
        const categories = (data as CategoriesData).categories;
        const index = categories.findIndex((item) => item.id === categoryId);
        if (index === -1) return;
        categories.splice(index, 1);
      });
    },
    [handleSectionUpdate]
  );

  const handleAddProductFromCatalog = useCallback(
    (product: Product) => {
      handleSectionUpdate('products', (data) => {
        const productsList = (data as ProductsData).products;
        const nextProduct: ProductItem = {
          id: product.id ?? `prod-${Date.now()}`,
          category_id: categoriesData.categories[0]?.id ?? 'seating',
          name: product.name ?? 'Product',
          priceLabel: formatProductPrice(product.price ?? 0),
          image: product.image_url || FALLBACK_PRODUCT_IMAGE,
          urgency: 'Limited stock',
          delivery: '7-10 Days',
        };
        productsList.unshift(nextProduct);
      });
    },
    [categoriesData.categories, handleSectionUpdate]
  );

  const handleAddCustomProduct = useCallback(() => {
    handleSectionUpdate('products', (data) => {
      const productsList = (data as ProductsData).products;
      productsList.unshift({
        id: `custom-${Date.now()}`,
        category_id: categoriesData.categories[0]?.id ?? 'seating',
        name: 'Custom Product',
        priceLabel: 'Rs 1,200',
        image: FALLBACK_PRODUCT_IMAGE,
        urgency: 'New arrival',
        delivery: '7-10 Days',
      });
    });
  }, [categoriesData.categories, handleSectionUpdate]);

  const handleUpdateProduct = useCallback(
    (index: number, updates: Partial<ProductItem | ProductsData>) => {
      handleSectionUpdate('products', (data) => {
        if (index === -1) {
          Object.assign(data, updates);
        } else {
          const productsList = (data as ProductsData).products;
          if (!productsList[index]) return;
          productsList[index] = { ...productsList[index], ...(updates as Partial<ProductItem>) };
        }
      });
    },
    [handleSectionUpdate]
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      handleSectionUpdate('products', (data) => {
        const productsList = (data as ProductsData).products;
        const index = productsList.findIndex((item) => item.id === productId);
        if (index === -1) return;
        productsList.splice(index, 1);
      });
    },
    [handleSectionUpdate]
  );

  const handleUpdateTestimonial = useCallback(
    (index: number, updates: Partial<TestimonialItem>) => {
      handleSectionUpdate('testimonials', (data) => {
        const testimonials = (data as TestimonialsData).testimonials;
        if (!testimonials[index]) return;
        testimonials[index] = { ...testimonials[index], ...updates };
      });
    },
    [handleSectionUpdate]
  );

  const handleAddTestimonial = useCallback(() => {
    handleSectionUpdate('testimonials', (data) => {
      (data as TestimonialsData).testimonials.push({
        id: `testimonial-${Date.now()}`,
        name: 'New Client',
        city: 'City',
        text: 'Add a short testimonial about the experience.',
        rating: 5,
      });
    });
  }, [handleSectionUpdate]);

  const handleRemoveTestimonial = useCallback(
    (testimonialId: string) => {
      handleSectionUpdate('testimonials', (data) => {
        const testimonials = (data as TestimonialsData).testimonials;
        const index = testimonials.findIndex((item) => item.id === testimonialId);
        if (index === -1) return;
        testimonials.splice(index, 1);
      });
    },
    [handleSectionUpdate]
  );

  const handleEditSection = useCallback(
    (sectionId: SectionId) => {
      setActiveTab(sectionId);
      setIsSidebarVisible(true);
    },
    []
  );

  // ✅ FIX #4: Proper undo/redo handlers that integrate with change tracking
  const handleUndo = useCallback(() => {
    undo();
    setChangeTick((prev) => prev + 1);
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
    setChangeTick((prev) => prev + 1);
  }, [redo]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // ✅ FIX #5: Optimized handleSave with deep comparison to prevent redundant network calls
  const handleSave = useCallback(
    async (silent = false) => {
      if (!funnel?.id || isPendingSaveRef.current) return;

      const contentChanged = JSON.stringify(draftContent) !== JSON.stringify(lastSavedContentRef.current);
      if (!contentChanged && !silent) {
        // Even if content hasn't changed, if user manually clicked save, show success briefly
        setSaveSuccess(true);
        if (saveSuccessTimer.current) clearTimeout(saveSuccessTimer.current);
        saveSuccessTimer.current = setTimeout(() => setSaveSuccess(false), 2000);
        return;
      }
      
      if (!contentChanged) return;

      isPendingSaveRef.current = true;
      if (silent) {
        setIsAutoSaving(true);
      } else {
        setIsSaving(true);
      }

      try {
        await updateFunnel(funnel.id, {
          story_mode_data: [{ content: draftContent }],
        });
        lastSavedContentRef.current = structuredClone(draftContent);
        setSaveSuccess(true);
        setSaveError(null);
        if (saveSuccessTimer.current) clearTimeout(saveSuccessTimer.current);
        saveSuccessTimer.current = setTimeout(() => setSaveSuccess(false), 2000);
      } catch (err) {
        console.error('Failed to save funnel:', err);
        setSaveError('Failed to save changes. Please try again.');
      } finally {
        isPendingSaveRef.current = false;
        setIsAutoSaving(false);
        setIsSaving(false);
      }
    },
    [draftContent, funnel?.id]
  );

  const handlePublish = useCallback(async () => {
    if (!funnel?.id) return;
    setIsPublishing(true);
    try {
      // 1. Force a save first
      const contentChanged = JSON.stringify(draftContent) !== JSON.stringify(lastSavedContentRef.current);
      if (contentChanged) {
        await updateFunnel(funnel.id, {
          story_mode_data: [{ content: draftContent }],
          is_active: true
        });
        lastSavedContentRef.current = structuredClone(draftContent);
      } else {
        await updateFunnel(funnel.id, { is_active: true });
      }
      
      setShowPublishModal(true);
    } catch (err) {
      console.error('Failed to publish:', err);
      setSaveError('Failed to publish funnel. Please check your connection.');
    } finally {
      setIsPublishing(false);
    }
  }, [draftContent, funnel?.id]);

  // ✅ FIX #6: Robust auto-save debouncing logic
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      void handleSave(true);
    }, 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [changeTick, handleSave]);

  // ✅ FIX #7: Full keyboard shortcut support (S, Z, Shift+Z, Y)
  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const metaKey = isMac ? event.metaKey : event.ctrlKey;

      if (metaKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void handleSave();
      }
      if (metaKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if (metaKey && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [handleSave, handleRedo, handleUndo]);

  // ✅ FIX #8: Comprehensive cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveSuccessTimer.current) clearTimeout(saveSuccessTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, []);

  const handleCopyLink = useCallback(() => {
    if (!funnel?.slug) return;
    void navigator.clipboard.writeText(`${window.location.origin}/s/${funnel.slug}`);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1200);
  }, [funnel?.slug]);

  const readiness = useMemo(() => {
    const items = [
      { id: 'store', label: 'Store Name', met: draftContent.storeName.trim().length > 0 },
      { id: 'store', label: 'WhatsApp Number', met: draftContent.whatsappNumber.trim().length > 0 },
      { id: 'categories', label: 'Product Collections', met: categoriesData.categories.length > 0 },
      { id: 'products', label: 'Featured Products', met: productsData.products.length > 0 },
      { id: 'testimonials', label: 'Customer Reviews', met: testimonialsData.testimonials.length > 0 },
    ];

    const metItems = items.filter(i => i.met);
    const missingItems = items.filter(i => !i.met);
    const score = Math.round((metItems.length / items.length) * 100);

    return { score, missingItems };
  }, [
    categoriesData.categories.length,
    draftContent.storeName,
    draftContent.whatsappNumber,
    productsData.products.length,
    testimonialsData.testimonials.length,
  ]);

  // ✅ FIX #9: Clean panel rendering without redundant memoization
  const getPanelContent = () => {
    if (activeTab === 'store') {
      return (
        <StorePanel
          storeName={draftContent.storeName}
          whatsappNumber={draftContent.whatsappNumber}
          logoUrl={draftContent.logoUrl}
          readiness={readiness}
          counts={{
            collections: categoriesData.categories.length,
            products: productsData.products.length,
            reviews: testimonialsData.testimonials.length,
          }}
          onChangeStoreName={(value) => handleStoreUpdate('storeName', value)}
          onChangeWhatsApp={(value) => handleStoreUpdate('whatsappNumber', value)}
          onChangeLogo={(value) => handleStoreUpdate('logoUrl', value)}
          onJumpTo={(tab) => setActiveTab(tab)}
        />
      );
    }

    if (activeTab === 'content') {
      return (
        <HeroPanel
          data={heroData}
          onChange={(updates) => {
            handleSectionUpdate('content', (data) => {
              Object.assign(data as HeroData, updates);
            });
          }}
        />
      );
    }

    if (activeTab === 'categories') {
      return (
        <CategoriesPanel
          data={categoriesData}
          onAdd={handleAddCategory}
          onRemove={handleRemoveCategory}
          onUpdate={handleUpdateCategory}
        />
      );
    }

    if (activeTab === 'products') {
      return (
        <ProductsPanel
          data={productsData}
          categories={categoriesData.categories}
          allProducts={products}
          onAddFromCatalog={handleAddProductFromCatalog}
          onAddCustomProduct={handleAddCustomProduct}
          onRemove={handleRemoveProduct}
          onUpdate={handleUpdateProduct}
        />
      );
    }

    if (activeTab === 'testimonials') {
      return (
        <TestimonialsPanel
          data={testimonialsData}
          onAdd={handleAddTestimonial}
          onRemove={handleRemoveTestimonial}
          onUpdate={handleUpdateTestimonial}
        />
      );
    }

    if (activeTab === 'location') {
      return (
        <LocationPanel
          data={locationData}
          onChange={(updates) => {
            handleSectionUpdate('location', (data) => {
              Object.assign(data as LocationData, updates);
            });
          }}
        />
      );
    }

    if (activeTab === 'whatsapp') {
      return (
        <WhatsAppPanel
          data={whatsappData}
          storeName={draftContent.storeName}
          whatsappNumber={draftContent.whatsappNumber}
          onChange={(updates) => {
            handleSectionUpdate('whatsapp', (data) => {
              Object.assign(data as WhatsAppData, updates);
            });
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/funnels"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to funnels
          </Link>
          <div className="h-5 w-px bg-slate-200" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Editor</p>
            <p className="text-base font-semibold text-slate-900">{funnel?.welcome_title ?? 'Furniture Funnel'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
            {previewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  previewMode === mode.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy link'}
          </button>

          <button
            onClick={() => setIsSidebarVisible((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {isSidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            {isSidebarVisible ? 'Hide panels' : 'Show panels'}
          </button>

          <button
            onClick={() => void handleSave()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : <Save className="h-4 w-4 text-slate-500" />}
            {isSaving ? 'Saving' : 'Save'}
          </button>

          <button
            onClick={() => void handlePublish()}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4 text-orange-400" />}
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <motion.aside
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-[600px] shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl"
            >
              {/* ✅ FIX #10: Professional Two-Column Sidebar Layout */}
              <div className="flex flex-1 overflow-hidden">
                {/* Navigation Column */}
                <div className="flex w-[200px] shrink-0 flex-col border-r border-slate-100 bg-slate-50/50">
                  <EditorSidebar
                    sections={draftContent.sections}
                    activeTab={activeTab}
                    onChangeTab={setActiveTab}
                    onReorderSections={handleReorderSections}
                    onStoreClick={() => setActiveTab('store')}
                  />
                </div>
                
                {/* Editing Column */}
                <div className="flex-1 overflow-y-auto bg-white p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getPanelContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ✅ FIX #11: Footer with unified autosave status and undo/redo */}
              <div className="border-t border-slate-200 bg-slate-50/80 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    {isAutoSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-600" />
                        <span className="font-medium text-slate-600">Autosaving...</span>
                      </>
                    ) : saveError ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="font-medium text-rose-600">{saveError}</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="font-medium text-emerald-600">Changes saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium text-slate-500">Ready to save</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 className="h-3 w-3" />
                      Undo
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Redo (Ctrl+Shift+Z)"
                    >
                      <Redo2 className="h-3 w-3" />
                      Redo
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <PreviewPane
          funnel={funnel}
          content={draftContent}
          products={productsData.products}
          previewMode={previewMode}
          onEditSection={handleEditSection}
        />
      </div>

      {/* ✅ FIX #12: Premium Publish Success Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="absolute right-6 top-6">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-10 pt-12">
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 shadow-inner">
                      <Rocket className="h-10 w-10 text-orange-500" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-3 font-serif text-3xl font-bold tracking-tight text-slate-900">
                    Your Funnel is Live!
                  </h3>
                  <p className="mb-8 text-[15px] leading-relaxed text-slate-600 px-4">
                    Congratulations! Your high-conversion furniture funnel is now published and ready to capture leads.
                  </p>

                  <div className="mb-10 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left px-2">
                      Public URL
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                      <span className="truncate text-sm font-medium text-slate-600">
                        {window.location.origin}/s/{funnel.slug}
                      </span>
                      <button
                        onClick={handleCopyLink}
                        className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-black transition-all active:scale-95"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/s/${funnel.slug}`}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-[14px] font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Live Funnel
                    </Link>
                    <button
                      onClick={() => setShowPublishModal(false)}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
