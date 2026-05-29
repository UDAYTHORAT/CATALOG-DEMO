'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { produce } from 'immer';
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Loader2,
  Menu,
  Eye,
  Edit2,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Redo2,
  Rocket,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  ExternalLink,
  GripVertical,
  X,
  HelpCircle,
  ChevronRight,
  Trophy,
  ShieldCheck,
  Zap,
  Wand2,
  Settings2,
  Clock,
  ArrowRight,
  LayoutList,
  AlertTriangle,
} from 'lucide-react';
import { useEditorHistory } from '@/components/dashboard/editor/hooks/useEditorHistory';
import type { Funnel } from '@/app/actions/funnels';
import { updateFunnel } from '@/app/actions/funnels';
import type { Product } from '@/app/actions/products';
import EditorSidebar from '@/components/dashboard/editor/EditorSidebar';
import PreviewPane from '@/components/dashboard/editor/PreviewPane';
import WizardMode from '@/components/dashboard/editor/WizardMode';
import CategoriesPanel from '@/components/dashboard/editor/sections/CategoriesPanel';
import RealEstateHeroPanel from '@/components/dashboard/editor/sections/RealEstateHeroPanel';
import LocationPanel from '@/components/dashboard/editor/sections/LocationPanel';
import RealEstateProductsPanel from '@/components/dashboard/editor/sections/RealEstateProductsPanel';
import RealEstateLayoutsPanel from '@/components/dashboard/editor/sections/RealEstateLayoutsPanel';
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

type GuideHighlightMap = Record<string, DOMRect | null>;

export default function FunnelAdRealEstateEditor({
  funnel,
  allProducts: products = [],
}: {
  funnel: Funnel;
  allProducts?: Product[];
}) {
  const templateId = (funnel.story_mode_data?.[0]?.templateId as string | undefined) ?? 'funnelad-elite-real-estate';
  const defaultSections = useMemo(() => createDefaultSections(templateId), [templateId]);
  const initialContent = useMemo(() => createInitialContent(funnel), [funnel]);

  // ✅ FIX #1: Properly destructure the history hook for cleaner state access
  const {
    current: draftContent,
    push: pushHistory,
    undo,
    redo,
    reset,
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
  const [isDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editorMode, setEditorMode] = useState<'choosing' | 'wizard' | 'advanced'>('choosing');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [guideHighlights, setGuideHighlights] = useState<GuideHighlightMap>({});
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 400), window.innerWidth - 320);
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = () => setIsKeyboardOpen(false);

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem(`editor_mode_${funnel.id}`);
    if (saved === 'advanced' || saved === 'wizard') {
      setEditorMode(saved as 'advanced' | 'wizard');
    }

    // Restore active tab
    const savedTab = localStorage.getItem(`editor_tab_${funnel.id}`);
    if (savedTab) {
      setActiveTab(savedTab as TabId);
    }

    // Restore draft from localStorage
    const savedDraft = localStorage.getItem(`funnel_draft_${funnel.id}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as Content;
        setLiveContent(parsed);
        reset(parsed);
      } catch (e) {
        console.error('Failed to parse draft from localStorage:', e);
      }
    }
  }, [funnel.id, reset]);

  const saveSuccessTimer = useRef<NodeJS.Timeout | null>(null);
  const copyTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<Content>(structuredClone(initialContent));
  const isPendingSaveRef = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [liveContent, setLiveContent] = useState<Content>(initialContent);
  const pushHistoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync liveContent when history changes (undo/redo)
  useEffect(() => {
    setLiveContent(draftContent);
  }, [draftContent]);

  // Persist active tab changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(`editor_tab_${funnel.id}`, activeTab);
    }
  }, [activeTab, funnel.id, isHydrated]);

  // Instantly save draft to localStorage as user edits
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(`funnel_draft_${funnel.id}`, JSON.stringify(liveContent));
    }
  }, [liveContent, funnel.id, isHydrated]);

  // Restore and persist scroll position of editor panel
  useEffect(() => {
    const container = document.getElementById('tour-tabs');
    if (!container) return;

    const savedScroll = localStorage.getItem(`editor_scroll_${funnel.id}_${activeTab}`);
    if (savedScroll) {
      container.scrollTop = parseInt(savedScroll, 10);
    }

    const handleScroll = () => {
      localStorage.setItem(`editor_scroll_${funnel.id}_${activeTab}`, container.scrollTop.toString());
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, funnel.id, isHydrated]);

  // ✅ Auto-show onboarding whenever entering Advanced mode, but only once
  useEffect(() => {
    if (editorMode === 'advanced') {
      const shown = localStorage.getItem(`guide_shown_${funnel.id}`);
      if (!shown) {
        const timer = setTimeout(() => {
          setShowOnboarding(true);
          localStorage.setItem(`guide_shown_${funnel.id}`, 'true');
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [funnel.id, editorMode]);

  const handleChooseMode = useCallback((mode: 'wizard' | 'advanced') => {
    setEditorMode(mode);
    localStorage.setItem(`editor_mode_${funnel.id}`, mode);
  }, [funnel.id]);



  const updateContent = useCallback(
    (recipe: (draft: Content) => void) => {
      setLiveContent((prev) => {
        const next = produce(prev, recipe);
        
        // Debounce the push to history
        if (pushHistoryTimeoutRef.current) clearTimeout(pushHistoryTimeoutRef.current);
        pushHistoryTimeoutRef.current = setTimeout(() => {
          pushHistory(next);
        }, 500);

        return next;
      });
      
      setSaveSuccess(false);
      setSaveError(null);
      setChangeTick((prev) => prev + 1);
    },
    [pushHistory]
  );

  const handleSectionUpdate = useCallback(
    <T extends SectionId>(sectionId: T, updater: (data: Section['data']) => void) => {
      updateContent((draft) => {
        let section = draft.sections.find((item) => item.id === sectionId);
        if (!section) {
          const fallback = defaultSections.find((item) => item.id === sectionId);
          if (!fallback) return;
          const nextSection = structuredClone(fallback);
          draft.sections.push(nextSection);
          section = nextSection;
        }
        updater(section.data);
      });
    },
    [defaultSections, updateContent]
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
    liveContent,
    'content',
    defaultSections.find((section) => section.id === 'content')?.data as HeroData
  );
  const categoriesData = getSectionData<CategoriesData>(
    liveContent,
    'categories',
    defaultSections.find((section) => section.id === 'categories')?.data as CategoriesData
  );
  const productsData = getSectionData<ProductsData>(
    liveContent,
    'products',
    defaultSections.find((section) => section.id === 'products')?.data as ProductsData
  );
  const testimonialsData = getSectionData<TestimonialsData>(
    liveContent,
    'testimonials',
    defaultSections.find((section) => section.id === 'testimonials')?.data as TestimonialsData
  );
  const locationData = getSectionData<LocationData>(
    liveContent,
    'location',
    defaultSections.find((section) => section.id === 'location')?.data as LocationData
  );
  const whatsappData = getSectionData<WhatsAppData>(
    liveContent,
    'whatsapp',
    defaultSections.find((section) => section.id === 'whatsapp')?.data as WhatsAppData
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
        const defaultCatId = categoriesData.categories[0]?.id ?? 'seating';
        const countInCat = productsList.filter(p => p.category_id === defaultCatId).length;
        
        if (countInCat >= 3) {
          alert(`The category "${categoriesData.categories[0]?.label}" is full (max 3). Remove an item or change category after adding.`);
          return;
        }

        const nextProduct: ProductItem = {
          id: product.id ?? `prod-${Date.now()}`,
          category_id: defaultCatId,
          name: product.name ?? 'Product',
          priceLabel: formatProductPrice(product.price ?? 0),
          image: product.image_url || FALLBACK_PRODUCT_IMAGE,
          image2: product.image_url_2 || undefined,
          urgency: 'Limited stock',
          delivery: '7-10 Days',
          description: product.description || undefined,
          dimensions: product.dimensions || undefined,
        };
        productsList.unshift(nextProduct);
      });
    },
    [categoriesData.categories, handleSectionUpdate]
  );

  const handleAddCustomProduct = useCallback(() => {
    handleSectionUpdate('products', (data) => {
      const productsList = (data as ProductsData).products;

      // Limit to max 4 configs
      if (productsList.length >= 4) return;

      productsList.push({
        id: `bhk-${Date.now()}`,
        category_id: categoriesData.categories[0]?.id ?? 'family',
        name: 'New BHK',
        priceLabel: '₹ 0',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
        urgency: 'New Listing',
        delivery: 'Possession: TBD',
        dimensions: '0 sqft',
        description: 'A new residence configuration.',
        rooms: [
          {
            id: `room-${Date.now()}-1`,
            name: 'Living Room',
            area: '300 sqft',
            img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
            details: ['Premium flooring', 'Natural light'],
            direction: { x: 0, y: 0, scale: 1 },
            x: 6, y: 8, w: 56, h: 44,
            label: 'Living'
          },
          {
            id: `room-${Date.now()}-2`,
            name: 'Kitchen',
            area: '150 sqft',
            img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80',
            details: ['Modular kitchen', 'Modern appliances'],
            direction: { x: -40, y: 0, scale: 1.02 },
            x: 6, y: 56, w: 36, h: 36,
            label: 'Kitchen'
          },
          {
            id: `room-${Date.now()}-3`,
            name: 'Master Bedroom',
            area: '200 sqft',
            img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80',
            details: ['Ensuite bathroom', 'Walk-in wardrobe'],
            direction: { x: 40, y: 20, scale: 1.04 },
            x: 46, y: 56, w: 48, h: 36,
            label: 'Master'
          }
        ] as any
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

          // Enforce 3 product limit per category
          if (updates.hasOwnProperty('category_id')) {
            const nextCatId = (updates as Partial<ProductItem>).category_id;
            const currentCatId = productsList[index].category_id;
            
            if (nextCatId && nextCatId !== currentCatId) {
              const countInNewCat = productsList.filter(p => p.category_id === nextCatId).length;
              if (countInNewCat >= 3) {
                alert("This category already has 3 products. Please remove one before moving this product here.");
                return;
              }
            }
          }

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

  const handleResetSection = useCallback((sectionId: SectionId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Section Settings',
      message: 'Are you sure you want to reset this section to its default state? All your changes in this section will be lost.',
      onConfirm: () => {
        updateContent((draft) => {
          const fallback = defaultSections.find((item) => item.id === sectionId);
          if (!fallback) return;
          const index = draft.sections.findIndex((item) => item.id === sectionId);
          if (index !== -1) {
            draft.sections[index] = structuredClone(fallback);
          } else {
            draft.sections.push(structuredClone(fallback));
          }
        });
        setConfirmModal(null);
      }
    });
  }, [defaultSections, updateContent]);

  const handleResetAll = useCallback(() => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Entire Funnel',
      message: 'Are you sure you want to completely reset the entire funnel to the default template? ALL your changes will be lost.',
      onConfirm: () => {
        const resetContent = {
          sections: structuredClone(defaultSections),
          storeName: 'Aurelia Residences',
          whatsappNumber: '919876543210',
          logoUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=300&q=80',
        };
        updateContent((draft) => {
          draft.sections = resetContent.sections;
          draft.storeName = resetContent.storeName;
          draft.whatsappNumber = resetContent.whatsappNumber;
          draft.logoUrl = resetContent.logoUrl;
        });
        // Clear persisted values
        localStorage.removeItem(`funnel_draft_${funnel.id}`);
        localStorage.removeItem(`wizard_step_${funnel.id}`);
        localStorage.removeItem(`editor_tab_${funnel.id}`);
        localStorage.removeItem(`guide_shown_${funnel.id}`);
        
        // Reset editor history to the default values
        reset(resetContent);
        setConfirmModal(null);
      }
    });
  }, [defaultSections, updateContent, funnel.id, reset]);

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

      const contentChanged = JSON.stringify(liveContent) !== JSON.stringify(lastSavedContentRef.current);
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
          story_mode_data: [{
            ...(funnel.story_mode_data?.[0] ?? {}),
            templateId,
            content: liveContent,
          }],
        });
        lastSavedContentRef.current = structuredClone(liveContent);
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
    [liveContent, funnel?.id, funnel.story_mode_data, templateId]
  );

  const handlePublish = useCallback(async () => {
    if (!funnel?.id) return;
    setIsPublishing(true);
    try {
      // 1. Force a save first
      const contentChanged = JSON.stringify(draftContent) !== JSON.stringify(lastSavedContentRef.current);
      if (contentChanged) {
        await updateFunnel(funnel.id, {
          story_mode_data: [{
            ...(funnel.story_mode_data?.[0] ?? {}),
            templateId,
            content: draftContent,
          }],
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
  }, [draftContent, funnel?.id, funnel.story_mode_data, templateId]);

  const handleWizardFinish = useCallback(async () => {
    await handlePublish();
    setEditorMode('advanced');
    localStorage.setItem(`editor_mode_${funnel.id}`, 'advanced');
  }, [handlePublish, funnel.id]);

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

  // ✅ ADVANCED: Outcome-Driven Spotlight Tour
  const tourSteps = useMemo(() => [
    {
      id: 'sidebar',
      title: "Your Project Studio",
      label: "Step 1 — Branding",
      description: "This is where you define the project identity — project name, contact information, hero visuals, residences, and more. Each tab on the left controls a critical part of your lead generation funnel.",
      proTip: "Start with the Project Identity tab to set your developer profile. Naming and contact info build instant trust with luxury property buyers.",
      icon: ShieldCheck,
      color: "indigo",
      position: "left-12 top-[140px]",
      arrow: "left-[-12px] top-1/2 -translate-y-1/2 border-r-white",
      highlightClass: "left-6 top-[100px] w-[660px] h-[calc(100vh-140px)]"
    },
    {
      id: 'tabs',
      title: "Lead Generation Tabs",
      label: "Step 2 — Navigate",
      description: "Switch between sections: Project Identity, Property Hero, Residences, Project Location, and Lead Capture. Each controls a specific conversion touchpoint.",
      proTip: "Focus on the Residences tab — add high-res renders and clear pricing. That's what stops the scroll.",
      icon: Zap,
      color: "amber",
      position: "left-[100px] top-[200px]",
      arrow: "left-1/2 -translate-x-1/2 top-[-12px] border-b-white",
      highlightClass: "left-[20px] top-[180px] w-12 h-64"
    },
    {
      id: 'preview',
      title: "Interactive Preview",
      label: "Step 3 — Visualize",
      description: "See your property funnel exactly as your buyers will see it. Test the virtual walkthrough and spatial tour features in real-time.",
      proTip: "Toggle between Mobile and Desktop. 90% of your leads will come from mobile devices.",
      icon: Smartphone,
      color: "emerald",
      position: "right-[15%] top-[250px]",
      arrow: "right-[-12px] top-1/2 -translate-y-1/2 border-l-white",
      highlightClass: "right-[4%] top-[100px] w-[calc(100%-720px)] h-[calc(100vh-140px)]"
    },
    {
      id: 'launch',
      title: "Go Live Instantly",
      label: "Step 4 — Conversion",
      description: "Once your project looks majestic, hit Publish. Your high-conversion property funnel will be live and ready to capture leads.",
      proTip: "Use the 'Copy Link' feature to share your funnel directly on Instagram, Facebook Ads, or WhatsApp.",
      icon: Rocket,
      color: "rose",
      position: "right-12 top-[40px]",
      arrow: "right-[-12px] top-1/2 -translate-y-1/2 border-l-white",
      highlightClass: "right-6 top-[20px] w-48 h-12"
    }
  ], []);

  // Dynamic Guide Tracking
  useEffect(() => {
    if (!showOnboarding || editorMode !== 'advanced') return;
    
    // Auto scroll based on step
    const step = tourSteps[onboardingStep - 1];
    if (step) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setTimeout(() => {
          if (step.id === 'preview') {
             document.getElementById('mobile-scroll-layout')?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
          } else {
             document.getElementById('mobile-scroll-layout')?.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }, 50);
      }
    }

    const interval = setInterval(() => {
      const highlights: GuideHighlightMap = {};
      
      const sidebarEl = document.getElementById('tour-sidebar');
      if (sidebarEl) highlights.sidebar = sidebarEl.getBoundingClientRect();
      
      const tabsEl = document.getElementById('tour-tabs');
      if (tabsEl) highlights.tabs = tabsEl.getBoundingClientRect();
      
      const previewEl = document.getElementById('tour-preview');
      if (previewEl) highlights.preview = previewEl.getBoundingClientRect();
      
      const launchEl = document.getElementById(window.innerWidth < 1024 ? 'tour-launch-mobile' : 'tour-launch-desktop');
      if (launchEl) highlights.launch = launchEl.getBoundingClientRect();
      
      setGuideHighlights((prev) => {
        let changed = false;
        for (const k of ['sidebar', 'tabs', 'preview', 'launch']) {
          if (!prev[k] && highlights[k]) changed = true;
          else if (prev[k] && highlights[k]) {
            if (Math.abs(prev[k].top - highlights[k].top) > 1 || Math.abs(prev[k].left - highlights[k].left) > 1) changed = true;
          }
        }
        return changed ? highlights : prev;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [showOnboarding, editorMode, onboardingStep, tourSteps]);

  const readiness = useMemo(() => {
    const items = [
      { id: 'store', label: 'Project Name', met: liveContent.storeName.trim().length > 0 },
      { id: 'store', label: 'Contact Number', met: liveContent.whatsappNumber.trim().length > 0 },
      { id: 'products', label: 'Residence Listings', met: productsData.products.length > 0 },
    ];

    const metItems = items.filter(i => i.met);
    const missingItems = items.filter(i => !i.met);
    const score = Math.round((metItems.length / items.length) * 100);

    return { score, missingItems };
  }, [
    categoriesData.categories.length,
    liveContent.storeName,
    liveContent.whatsappNumber,
    productsData.products.length,
    testimonialsData.testimonials.length,
  ]);

  // ✅ FIX #9: Clean panel rendering without redundant memoization
  const getPanelContent = (tab?: TabId) => {
    const currentTab = tab ?? activeTab;
    if (currentTab === 'store') {
      return (
        <StorePanel
          storeName={liveContent.storeName}
          whatsappNumber={liveContent.whatsappNumber}
          logoUrl={liveContent.logoUrl}
          readiness={readiness}
          counts={{
            collections: 0,
            products: productsData.products.length,
            reviews: 0,
          }}
          isWizard={editorMode === 'wizard'}
          onChangeStoreName={(value) => handleStoreUpdate('storeName', value)}
          onChangeWhatsApp={(value) => handleStoreUpdate('whatsappNumber', value)}
          onChangeLogo={(value) => handleStoreUpdate('logoUrl', value)}
          onJumpTo={(tab) => setActiveTab(tab)}
          panelLabel="Developer Profile"
          nameLabel="Construction Company Name"
          namePlaceholder="e.g. Aurelia Group"
          hideLogo={true}
          whatsappLabel="Lead Capture Number"
          whatsappHint="Concierge requests, visitor callbacks, and lead inquiries will route directly to this WhatsApp number."
          inventorySectionLabel="Active Project Assets"
          inventoryLabels={{
            products: 'Residences',
          }}
        />
      );
    }

    if (currentTab === 'content') {
      return (
        <RealEstateHeroPanel
          data={heroData}
          hideCtaSection={editorMode === 'wizard'}
          onChange={(updates) => {
            handleSectionUpdate('content', (data) => {
              Object.assign(data as HeroData, updates);
            });
          }}
          locationAddress={locationData.experienceCenterAddress}
          onChangeLocationAddress={(val) => {
            handleSectionUpdate('location', (data) => {
              (data as LocationData).experienceCenterAddress = val;
            });
          }}
        />
      );
    }

    if (currentTab === 'categories') {
      return (
        <CategoriesPanel
          data={categoriesData}
          onAdd={handleAddCategory}
          onRemove={handleRemoveCategory}
          onUpdate={handleUpdateCategory}
        />
      );
    }

    if (currentTab === 'products') {
      return (
        <RealEstateProductsPanel
          data={productsData}
          onAddCustomProduct={handleAddCustomProduct}
          onRemove={handleRemoveProduct}
          onUpdate={handleUpdateProduct}
          heroData={heroData}
          onChangeHero={(updates) => {
            handleSectionUpdate('content', (data) => {
              Object.assign(data as HeroData, updates);
            });
          }}
        />
      );
    }

    if (currentTab === 'layouts') {
      return (
        <RealEstateLayoutsPanel
          data={productsData}
          onUpdate={handleUpdateProduct}
        />
      );
    }

    if (currentTab === 'testimonials') {
      return (
        <TestimonialsPanel
          data={testimonialsData}
          onAdd={handleAddTestimonial}
          onRemove={handleRemoveTestimonial}
          onUpdate={handleUpdateTestimonial}
        />
      );
    }

    if (currentTab === 'location') {
      return (
        <LocationPanel
          data={locationData}
          isRealEstate={true}
          onChange={(updates) => {
            handleSectionUpdate('location', (data) => {
              Object.assign(data as LocationData, updates);
            });
          }}
        />
      );
    }

    if (currentTab === 'whatsapp') {
      return (
        <WhatsAppPanel
          data={whatsappData}
          storeName={liveContent.storeName}
          whatsappNumber={liveContent.whatsappNumber}
          isRealEstate={true}
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

  const handleNextTour = () => {
    if (onboardingStep < tourSteps.length) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        setShowOnboarding(false);
        setOnboardingStep(1);
        setShowConfetti(false);
      }, 3000);
    }
  };

  // ===================== MODE SELECTOR =====================
  if (!isHydrated || editorMode === 'choosing') {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="w-full max-w-3xl px-8">
          <div className="text-center mb-14">
            <h1 
              className="text-5xl text-slate-900 tracking-tight mb-4"
              style={{ fontFamily: "'Tanker', serif" }}
            >
              How would you like to start?
            </h1>
            <p className="text-lg text-slate-400 font-medium">Choose a setup style that fits your experience level.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Wizard Mode */}
            <button
              onClick={() => handleChooseMode('wizard')}
              className="group relative p-10 rounded-[3rem] border-2 border-slate-100 bg-white hover:border-indigo-400 hover:shadow-[0_20px_60px_rgba(99,102,241,0.15)] transition-all text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-indigo-50">
                <Wand2 size={32} />
              </div>
              <h3 
                className="text-2xl text-slate-900 mb-3 tracking-tight"
                style={{ fontFamily: "'Tanker', serif" }}
              >
                Quick Setup
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">Step-by-step guided wizard. Add project identity, residences, and go live in under 30 seconds.</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600">
                  <Clock size={14} />
                  <span className="text-[11px] font-black uppercase tracking-widest">30 Seconds</span>
                </div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Recommended</span>
              </div>
            </button>

            {/* Advanced Mode */}
            <button
              onClick={() => handleChooseMode('advanced')}
              className="group relative p-10 rounded-[3rem] border-2 border-slate-100 bg-white hover:border-slate-900 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)] transition-all text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 text-slate-600 flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-lg shadow-slate-100">
                <Settings2 size={32} />
              </div>
              <h3 
                className="text-2xl text-slate-900 mb-3 tracking-tight"
                style={{ fontFamily: "'Tanker', serif" }}
              >
                Advanced Editor
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">Full sidebar + live preview. Fine-tune every detail — hero copy, WhatsApp scripts, residence specs, and more.</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600">
                  <Settings2 size={14} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Full Control</span>
                </div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Power users</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== WIZARD MODE =====================
  if (editorMode === 'wizard') {
    return (
      <>
        <WizardMode
          content={liveContent}
          funnel={funnel}
          products={productsData.products}
          panelRenderer={getPanelContent}
          onFinish={() => void handleWizardFinish()}
          onSwitchToAdvanced={() => handleChooseMode('advanced')}
          onReorderSections={handleReorderSections}
          onResetSection={handleResetSection}
          onResetAll={handleResetAll}
        />
        <ConfirmModal
          isOpen={!!confirmModal?.isOpen}
          title={confirmModal?.title || ''}
          message={confirmModal?.message || ''}
          onConfirm={confirmModal?.onConfirm || (() => {})}
          onCancel={() => setConfirmModal(null)}
        />
      </>
    );
  }

  // ===================== ADVANCED MODE =====================
  return (
    <div className={`flex h-full flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1117]' : 'bg-white'}`}>
      {/* ✅ ADVANCED GUIDE — Moves & Highlights Each Area */}
      <AnimatePresence>
        {showOnboarding && (() => {
          const step = tourSteps[onboardingStep - 1];
          const colorMap: Record<string, { bg: string; bgLight: string; text: string; border: string; btn: string; btnHover: string; shadow: string; ring: string }> = {
            indigo: { bg: 'bg-indigo-500', bgLight: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-400', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700', shadow: 'shadow-indigo-200', ring: 'ring-indigo-400/30' },
            amber: { bg: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-400', btn: 'bg-amber-500', btnHover: 'hover:bg-amber-600', shadow: 'shadow-amber-200', ring: 'ring-amber-400/30' },
            emerald: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-400', btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700', shadow: 'shadow-emerald-200', ring: 'ring-emerald-400/30' },
            rose: { bg: 'bg-rose-500', bgLight: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-400', btn: 'bg-rose-600', btnHover: 'hover:bg-rose-700', shadow: 'shadow-rose-200', ring: 'ring-rose-400/30' },
          };
          const c = colorMap[step.color] || colorMap.indigo;

          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const isMobile = windowWidth < 1024;

          const hlData = guideHighlights[step.id];
          const hl: React.CSSProperties = hlData ? {
            top: hlData.top,
            left: hlData.left,
            width: hlData.width,
            height: hlData.height
          } : {};

          let cardStyle: React.CSSProperties = {};
          let arrowStyle: React.CSSProperties = { display: 'none' };
          
          if (isMobile) {
            // Smart docking logic
            const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
            if (hlData?.top !== undefined && hlData.top > windowHeight / 2) {
              cardStyle = { left: 16, right: 16, top: 80, bottom: 'auto', transform: 'none' };
            } else {
              cardStyle = { left: 16, right: 16, bottom: 24, top: 'auto', transform: 'none' };
            }
          } else {
            // Desktop logic
            if (step.id === 'sidebar') cardStyle = { left: 220, top: '50%', transform: 'translateY(-50%)' };
            if (step.id === 'tabs') cardStyle = { left: 680, top: '50%', transform: 'translateY(-50%)' };
            if (step.id === 'preview') cardStyle = { right: 40, top: '50%', transform: 'translateY(-50%)' };
            if (step.id === 'launch') cardStyle = { right: 20, top: 80 };
            
            if (step.id === 'sidebar' || step.id === 'tabs' || step.id === 'preview') {
              arrowStyle = { position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid white' };
            } else if (step.id === 'launch') {
              arrowStyle = { position: 'absolute', top: -8, right: 40, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid white' };
            }
          }

          return (
            <div className="fixed inset-0 z-[200]">
              {/* Dim overlay with cutout for highlighted area */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={() => setShowOnboarding(false)}
              >
                {/* Top dimmer */}
                <div className="absolute top-0 left-0 right-0 bg-black/40" style={{ height: hlData?.top ?? 0 }} />
                {/* Bottom dimmer */}
                {hlData?.height ? (
                  <div className="absolute left-0 right-0 bottom-0 bg-black/40" style={{ top: hlData.top + hlData.height }} />
                ) : null}
                {/* Left dimmer */}
                <div className="absolute bg-black/40" style={{ top: hlData?.top ?? 0, left: 0, width: hlData?.left ?? 0, height: hlData?.height }} />
                {/* Right dimmer */}
                <div className="absolute bg-black/40" style={{ top: hlData?.top ?? 0, left: (hlData?.left ?? 0) + (hlData?.width ?? 0), right: 0, height: hlData?.height }} />
              </motion.div>

              {/* Highlight border ring around the focused area */}
              <motion.div
                layoutId="guide-highlight"
                className={`absolute z-[201] pointer-events-none border-2 ${c.border} ring-4 ${c.ring}`}
                style={hl}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              />

              {/* Tooltip Card — positioned near the highlighted area */}
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280, delay: 0.1 }}
                className={`fixed z-[210] w-[calc(100%-32px)] lg:w-[360px]`}
                style={cardStyle}
              >
                {/* Arrow */}
                <div style={arrowStyle} />

                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[85vh]">
                  {/* Accent bar */}
                  <div className={`h-1 shrink-0 ${c.bg}`} />

                  <div className="p-6 overflow-y-auto overflow-x-hidden">
                    {/* Step badge + count */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${c.bgLight} ${c.text}`}>
                        {React.createElement(step.icon, { size: 10 })}
                        {step.label}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">{onboardingStep}/{tourSteps.length}</span>
                    </div>

                    {/* Title — Tanker */}
                    <h3
                      className="text-[28px] leading-[1.1] text-slate-900 mb-3"
                      style={{ fontFamily: "'Tanker', serif" }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Pro tip */}
                    <div className={`p-3.5 rounded-xl ${c.bgLight} mb-5`}>
                      <div className="flex items-start gap-2.5">
                        <p className="text-[12px] font-semibold text-slate-700 leading-snug">{step.proTip}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      {/* Progress */}
                      <div className="flex gap-1.5">
                        {tourSteps.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-400 ${
                              i < onboardingStep - 1 ? `w-1.5 ${c.bg} opacity-40` :
                              i === onboardingStep - 1 ? `w-6 ${c.bg}` :
                              'w-1.5 bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowOnboarding(false)}
                          className="px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors"
                        >
                          Skip
                        </button>
                        <button
                          onClick={handleNextTour}
                          className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all active:scale-95 flex items-center gap-1.5 ${c.btn} ${c.btnHover} shadow-md ${c.shadow}`}
                        >
                          {onboardingStep === tourSteps.length ? "Done" : "Next"}
                          <ChevronRight size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Celebration Overlay */}
              {showConfetti && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-[220] flex items-center justify-center bg-white/90"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-20 h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200"
                    >
                      <Trophy size={40} />
                    </motion.div>
                    <h2
                      className="text-4xl text-slate-900 mb-2"
                      style={{ fontFamily: "'Tanker', serif" }}
                    >
                      You&apos;re All Set!
                    </h2>
                    <p className="text-slate-400 font-medium text-sm">Start building your elite funnel now.</p>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })()}
      </AnimatePresence>




      <div className={`flex items-center justify-between border-b px-6 py-4 transition-colors duration-300 ${isDarkMode ? 'border-white/[0.06] bg-[#13151b]' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/funnels"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to funnels
          </Link>
          <div className={`h-5 w-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div>
            <p className={`text-xs uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Editor</p>
            <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{funnel?.welcome_title ?? 'Real Estate Funnel'}</p>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChooseMode('wizard')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                isDarkMode 
                  ? 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-800/40 hover:text-indigo-300 border border-indigo-500/20' 
                  : 'bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-100'
              }`}
            >
              <Wand2 size={14} strokeWidth={2.5} />
              Wizard
            </button>

            <button
              onClick={() => {
                localStorage.removeItem(`guide_shown_${funnel.id}`);
                setShowOnboarding(true);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <HelpCircle size={14} strokeWidth={2.5} />
              Guide
            </button>

            <button
              onClick={handleResetAll}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                isDarkMode 
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-800/40 hover:text-red-300 border border-red-500/20' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
              }`}
              title="Reset Entire Funnel"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
              Reset All
            </button>

          </div>

          <button
            onClick={handleCopyLink}
            className={`hidden md:inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy link'}
          </button>

          {/* Device Preview Toggle */}
          <div className={`hidden md:flex items-center rounded-full border p-0.5 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
            {[
              { mode: 'mobile' as PreviewMode, icon: Smartphone, label: 'Mobile' },
              { mode: 'tablet' as PreviewMode, icon: Tablet, label: 'Tablet' },
              { mode: 'desktop' as PreviewMode, icon: Monitor, label: 'Desktop' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                title={label}
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-all ${
                  previewMode === mode
                    ? isDarkMode
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : isDarkMode
                      ? 'text-slate-500 hover:text-white'
                      : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsSidebarVisible((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            {isSidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            <span className="hidden md:inline">{isSidebarVisible ? 'Hide panels' : 'Show panels'}</span>
            <span className="md:hidden">{isSidebarVisible ? 'Hide' : 'Edit'}</span>
          </button>

          <button
            onClick={() => void handleSave()}
            className={`inline-flex items-center gap-2 rounded-full border px-3 md:px-4 py-2 text-xs font-semibold active:scale-95 transition-all ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {isSaving ? <Loader2 className={`h-4 w-4 animate-spin ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} /> : <Save className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />}
            <span className="hidden md:inline">{isSaving ? 'Saving' : 'Save'}</span>
          </button>

          <button
            id="tour-launch-desktop"
            onClick={() => void handlePublish()}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4 text-orange-400" />}
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          id="tour-launch-mobile"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-[73px] left-0 right-0 z-[100] bg-white border-b border-slate-200 shadow-2xl p-4 flex flex-col gap-3"
          >
            {/* Row 1: Wizard & Guide */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  handleChooseMode('wizard');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 text-indigo-600 p-3 text-xs font-black uppercase tracking-widest border border-indigo-100"
              >
                <Wand2 size={16} strokeWidth={2.5} />
                Wizard
              </button>
              <button
                onClick={() => {
                  setShowOnboarding(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-700 p-3 text-xs font-black uppercase tracking-widest border border-slate-200"
              >
                <HelpCircle size={16} strokeWidth={2.5} />
                Guide
              </button>
            </div>

            {/* Row 2: Hide panels & Copy link */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsSidebarVisible((prev) => !prev);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-700"
              >
                {isSidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                {isSidebarVisible ? 'Hide panels' : 'Show panels'}
              </button>
              <button
                onClick={() => {
                  handleCopyLink();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-700"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>

            {/* Row 3: Save & Device Preview */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  void handleSave();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-700"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : <Save className="h-4 w-4 text-slate-500" />}
                {isSaving ? 'Saving' : 'Save'}
              </button>
              <button
                onClick={() => {
                  void handlePublish();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isPublishing}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 p-3 text-xs font-bold text-white shadow-lg disabled:opacity-50"
              >
                {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4 text-orange-400" />}
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>

            {/* Row 4: Device Preview Toggle */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Device Preview</span>
              <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                {[
                  { mode: 'mobile' as PreviewMode, icon: Smartphone, label: 'Mobile' },
                  { mode: 'tablet' as PreviewMode, icon: Tablet, label: 'Tablet' },
                  { mode: 'desktop' as PreviewMode, icon: Monitor, label: 'Desktop' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setPreviewMode(mode);
                      setIsMobileMenuOpen(false);
                    }}
                    title={label}
                    className={`flex items-center justify-center h-8 w-8 rounded-full transition-all ${
                      previewMode === mode
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="mobile-scroll-layout" className="flex flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory lg:overflow-hidden lg:flex-row w-full scrollbar-none scroll-smooth">
        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <motion.aside
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ '--desktop-width': sidebarWidth ? `${sidebarWidth}px` : (activeTab === 'layouts' ? '900px' : '660px') } as React.CSSProperties}
              className={`flex h-full w-full lg:w-[var(--desktop-width)] shrink-0 snap-center flex-col relative z-40 border-r border-slate-200 bg-white shadow-xl ${!isResizing ? 'transition-[width] duration-300' : ''}`}
            >
              {/* Resizer Handle */}
              <div 
                className={`hidden lg:flex absolute top-0 right-[-10px] bottom-0 w-[20px] cursor-col-resize z-50 flex-col items-center justify-center group transition-colors ${isResizing ? 'bg-orange-500/10' : 'hover:bg-orange-500/10'}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                }}
              >
                <div className={`flex items-center justify-center h-8 w-4 rounded-full bg-white border shadow-sm transition-all ${isResizing ? 'border-orange-500 text-orange-500 scale-110 shadow-md' : 'border-slate-200 text-slate-400 group-hover:border-orange-400 group-hover:text-orange-400'}`}>
                  <GripVertical size={12} strokeWidth={2.5} />
                </div>
              </div>
              
              {/* ✅ FIX #10: Professional Two-Column Sidebar Layout */}
              <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                {/* Navigation Column */}
                <div id="tour-sidebar" className="flex w-full md:w-[260px] shrink-0 flex-col border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
                  <EditorSidebar
                    sections={draftContent.sections.filter(s => s.id !== 'testimonials' && s.id !== 'categories')}
                    activeTab={activeTab}
                    onChangeTab={setActiveTab}
                    onReorderSections={handleReorderSections}
                    onStoreClick={() => setActiveTab('store')}
                    storeLabel="Project Identity"
                    sectionLabels={{
                      content: { label: 'Property Hero', icon: Building2 },
                      products: { label: 'Residences', icon: Building2 },
                      location: { label: 'Project Location' },
                      whatsapp: { label: 'Lead Capture' },
                    }}
                    extraTabs={[
                      { id: 'layouts', label: 'Layout Config', icon: LayoutList }
                    ]}
                  />
                </div>
                
                {/* Editing Column */}
                <div id="tour-tabs" className={`flex-1 overflow-y-auto bg-white p-4 md:p-6 pb-20 ${isKeyboardOpen ? 'pb-[50vh]' : ''}`}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getPanelContent()}
                      
                      {activeTab !== 'layouts' && activeTab !== 'store' && (
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleResetSection(activeTab as SectionId)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <RotateCcw size={14} />
                            Reset this section
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ✅ FIX #11: Footer with unified autosave status and undo/redo */}
              <div className={`border-t border-slate-200 bg-slate-50/80 p-4 backdrop-blur-sm ${isKeyboardOpen ? 'hidden md:block' : ''}`}>
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

              {/* Floating Mobile Action (Editor -> Preview) */}
              <div className="lg:hidden absolute bottom-24 right-6 z-50">
                <button 
                  onClick={() => {
                    document.getElementById('mobile-scroll-layout')?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl shadow-slate-900/30 font-bold text-xs active:scale-95 transition-transform"
                >
                  <Eye size={16} />
                  Preview
                  <ArrowRight size={14} className="ml-1 opacity-50" />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div id="tour-preview" className="w-full h-full shrink-0 snap-center lg:w-auto lg:flex-1 relative">
          <PreviewPane
            funnel={funnel}
            content={liveContent}
            products={productsData.products}
            previewMode={previewMode}
            onEditSection={handleEditSection}
            activeSectionId={activeTab}
          />
          
          {/* Floating Mobile Action (Preview -> Editor) */}
          <div className="lg:hidden absolute bottom-6 left-6 z-50">
            <button 
              onClick={() => {
                document.getElementById('mobile-scroll-layout')?.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-5 py-3 rounded-full shadow-2xl font-bold text-xs active:scale-95 transition-transform"
            >
              <ChevronLeft size={14} className="mr-1 opacity-50" />
              <Edit2 size={16} />
              Editor
            </button>
          </div>
        </div>
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
                    Congratulations! Your high-conversion real estate funnel is now published and ready to capture leads.
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

      <ConfirmModal
        isOpen={!!confirmModal?.isOpen}
        title={confirmModal?.title || ''}
        message={confirmModal?.message || ''}
        onConfirm={confirmModal?.onConfirm || (() => {})}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIRM MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

            <div className="flex gap-4 items-start mt-2">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-500 shrink-0">
                <AlertTriangle size={24} className="animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all active:scale-95 border border-slate-200/50"
              >
                No, Keep Changes
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/10 hover:shadow-rose-600/20 hover:scale-[1.02] transition-all active:scale-95"
              >
                Yes, Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
