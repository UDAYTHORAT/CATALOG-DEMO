'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ArrowRight, Zap } from 'lucide-react';
import { Product } from '@/app/actions/products';
import { createFunnel } from '@/app/actions/funnels';
import { useRouter } from 'next/navigation';
import { MASTER_TEMPLATES, FunnelTemplate } from '@/data/funnelTemplates';

interface CreateFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  selectedTemplate?: FunnelTemplate | null;
}

export function CreateFunnelModal({ isOpen, onClose, selectedTemplate }: CreateFunnelModalProps) {
  const router = useRouter();
  const defaultTemplate = MASTER_TEMPLATES.find((template) => template.id === 'funnelad-elite-furniture') || null;
  const activeTemplate = selectedTemplate || defaultTemplate;
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from template
  useEffect(() => {
    if (isOpen) {
      const defaultName = activeTemplate?.name || 'New Campaign';
      setName(defaultName);
      setSlug(
        defaultName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + 
        '-' + Math.floor(Math.random() * 1000)
      );
    }
  }, [isOpen, activeTemplate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    
    if (activeTemplate) {
      formData.append('theme', activeTemplate.theme || 'ethereal');
      if (activeTemplate.funnelad) {
        formData.append('welcome_title', activeTemplate.funnelad.landing.title || '');
        formData.append('welcome_description', activeTemplate.funnelad.landing.subtitle || '');
        formData.append('questions', JSON.stringify([]));
        formData.append(
          'story_mode_data',
          JSON.stringify([
            {
              templateId: activeTemplate.id,
              landing: activeTemplate.funnelad.landing,
              products: activeTemplate.funnelad.products,
              whatsapp: activeTemplate.funnelad.whatsapp,
              theme: activeTemplate.funnelad.theme,
            },
          ])
        );
      } else {
        formData.append('welcome_title', activeTemplate.hero?.headline || '');
        formData.append('welcome_description', activeTemplate.hero?.subheadline || '');

        const formattedQuestions = (activeTemplate.questions || []).map((q) => ({
          id: q.id,
          question: q.question,
          type: q.type || 'choice',
          options: q.options || [],
        }));
        formData.append('questions', JSON.stringify(formattedQuestions));

        const storyData = {
          templateId: activeTemplate.id,
          resultTitle: activeTemplate.resultDefault?.title || 'Your Match',
          resultDesc: activeTemplate.resultDefault?.description || '',
          ctaLabel: activeTemplate.resultDefault?.ctaLabel || 'Action',
          ctaType: activeTemplate.resultDefault?.ctaType || 'whatsapp',
          resultRules: activeTemplate.resultRules || [],
          goal: activeTemplate.goal || 'leads',
          selectedIndustry: activeTemplate.industry || '',
        };
        formData.append('story_mode_data', JSON.stringify([storyData]));
      }
    } else {
      formData.append('theme', 'bubbly');
      formData.append('welcome_title', 'Your Custom Funnel');
      formData.append('welcome_description', 'Configure your funnel in the editor.');
      formData.append('questions', JSON.stringify([]));
      formData.append('story_mode_data', JSON.stringify([]));
    }

    const result = await createFunnel(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result.funnel) {
      setIsSubmitting(false);
      onClose();
      // Go directly to editor to let them review
      router.push(`/dashboard/funnels/${result.funnel.id}/edit`);
    } else {
      setIsSubmitting(false);
      onClose();
      window.location.reload(); 
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm z-100 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white shadow-2xl z-101 rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Zap size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">
                One-Click Deploy
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 space-y-6 bg-white">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-2">
                <X size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Funnel Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Custom Link Slug
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all bg-white">
                  <span className="flex items-center px-3 bg-gray-50 text-gray-400 border-r border-gray-200 text-xs font-bold">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-3 bg-transparent text-gray-900 outline-none font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 bg-white">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Zap size={14} className="animate-spin" /> Deploying Engine...</>
              ) : (
                <>Deploy {activeTemplate ? activeTemplate.name : 'Funnel'} <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
