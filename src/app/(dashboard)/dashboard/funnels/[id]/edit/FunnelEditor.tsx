'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Sparkles, Plus, Trash2, 
  Smartphone, Check, Loader2, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';
import { Funnel, updateFunnel } from '@/app/actions/funnels';
import { Product } from '@/app/actions/products';
import { motion, AnimatePresence } from 'framer-motion';
import { INDUSTRY_PRESETS, IndustryPreset, ResultRule } from '@/data/funnelTemplates';

interface FunnelEditorProps {
  funnel: Funnel;
  allProducts: Product[];
  initialLinkedProductIds: string[];
}

export default function FunnelEditor({ funnel, allProducts, initialLinkedProductIds }: FunnelEditorProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form States
  const [name, setName] = useState(funnel.name);
  const [slug, setSlug] = useState(funnel.slug);
  const [theme, setTheme] = useState(funnel.theme || 'ethereal');
  
  // Step 1: Experience
  const [headline, setHeadline] = useState(funnel.welcome_title || '');
  const [subheadline, setSubheadline] = useState(funnel.welcome_description || '');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [goal, setGoal] = useState<'leads' | 'sell' | 'booking'>('leads');
  
  // Step 2: Questions
  const [questions, setQuestions] = useState<any[]>(funnel.questions || []);

  // Step 3: Result
  const [resultTitle, setResultTitle] = useState('Your Perfect Match Found');
  const [resultDesc, setResultDesc] = useState('Based on your answers, we recommend this for you.');
  const [ctaType, setCtaType] = useState<'whatsapp' | 'link' | 'booking'>('whatsapp');
  const [ctaLabel, setCtaLabel] = useState('Get Started');
  const [resultRules, setResultRules] = useState<ResultRule[]>([]);
  
  // Preview State
  const [previewStep, setPreviewStep] = useState<'hero' | 'quiz' | 'result'>('hero');

  const applyIndustryPreset = (preset: IndustryPreset) => {
    setSelectedIndustry(preset.id);
    setHeadline(preset.headline);
    setSubheadline(preset.subheadline);
    setGoal(preset.goal);
    setCtaLabel(preset.ctaLabel);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // In a real app, we'd save all this new structure.
    // For now we map it to the existing schema or assume the schema is flexible (JSON).
    const updates = {
      name,
      slug,
      theme,
      welcome_title: headline,
      welcome_description: subheadline,
      questions,
      // We would save result data in a new column or inside story_mode_data
      story_mode_data: [{ resultTitle, resultDesc, ctaType, ctaLabel, resultRules, goal, selectedIndustry }]
    };

    const result = await updateFunnel(funnel.id, updates);
    
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert('Error saving: ' + result.error);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      question: 'New Question?',
      type: 'choice',
      options: ['Option 1', 'Option 2']
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addRule = () => {
    const newRule: ResultRule = {
      condition: { questionIndex: 0, optionIndex: 0 },
      title: 'Dynamic Result Title',
      description: 'Dynamic result description...',
      ctaLabel: 'Action',
      ctaType: 'whatsapp'
    };
    setResultRules([...resultRules, newRule]);
  };

  const score = Math.min(100, 50 + (headline ? 15 : 0) + (questions.length > 0 ? 20 : 0) + (resultRules.length > 0 ? 15 : 0));

  return (
    <div className="relative space-y-10 animate-fade-in-up pb-20">
      {/* BACKGROUND GLOWS */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/[0.02] relative z-20">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/funnels" className="w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-gray-400 hover:text-black hover:bg-neutral-100 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <div className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Interactive Engine</div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1a1a2e] mb-1">{name}</h1>
            <p className="text-[10px] text-[#6366f1] font-black uppercase tracking-[0.3em] opacity-60">/{slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right mr-4 hidden md:block">
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversion Score</div>
             <div className="text-2xl font-black text-emerald-500">{score}%</div>
           </div>
           <Link href={`/s/${slug}`} target="_blank" className="p-4 bg-neutral-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all shadow-inner">
              <Smartphone size={20} />
           </Link>
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-10 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
              saveSuccess 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'bg-black text-white hover:bg-[#6366f1] shadow-indigo-500/20'
            }`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <Check size={16} /> : <Save size={16} />}
            {isSaving ? 'Processing...' : saveSuccess ? 'Published' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Area */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step Navigation */}
          <div className="flex gap-2 bg-white p-2 rounded-3xl border border-black/5 shadow-sm">
             {[1, 2, 3].map((step) => (
               <button
                 key={step}
                 onClick={() => {
                   setActiveStep(step as any);
                   setPreviewStep(step === 1 ? 'hero' : step === 2 ? 'quiz' : 'result');
                 }}
                 className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                   activeStep === step 
                   ? 'bg-black text-white shadow-md' 
                   : 'text-gray-400 hover:bg-neutral-50 hover:text-black'
                 }`}
               >
                 <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeStep === step ? 'bg-white text-black' : 'bg-gray-100'}`}>{step}</span>
                 {step === 1 ? 'Experience' : step === 2 ? 'Questions' : 'Result'}
               </button>
             ))}
          </div>

          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 min-h-[500px]">
             <AnimatePresence mode="wait">
               {activeStep === 1 && (
                 <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                   <div>
                     <h3 className="text-xl font-black mb-1">1. Create Experience</h3>
                     <p className="text-sm text-gray-500 font-medium">Start with a high-converting template.</p>
                   </div>

                   <div className="space-y-4">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Industry Presets</label>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {INDUSTRY_PRESETS.map(p => (
                         <button
                           key={p.id}
                           onClick={() => applyIndustryPreset(p)}
                           className={`p-4 rounded-2xl border-2 text-left transition-all ${
                             selectedIndustry === p.id ? 'border-black bg-black text-white' : 'border-neutral-100 hover:border-black/20 bg-white'
                           }`}
                         >
                           <div className="text-2xl mb-2">{p.icon}</div>
                           <div className="font-bold text-sm">{p.name}</div>
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="space-y-6 pt-6 border-t border-black/5">
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Main Headline</label>
                       <input 
                         value={headline} onChange={e => setHeadline(e.target.value)}
                         className="w-full px-5 py-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-black transition-all outline-none font-black text-xl"
                         placeholder="What is the main promise?"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subheadline</label>
                       <textarea 
                         value={subheadline} onChange={e => setSubheadline(e.target.value)}
                         className="w-full h-24 px-5 py-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-black transition-all outline-none font-medium resize-none"
                         placeholder="Explain what they need to do..."
                       />
                     </div>
                   </div>
                 </motion.div>
               )}

               {activeStep === 2 && (
                 <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-xl font-black mb-1">2. Ask Questions</h3>
                       <p className="text-sm text-gray-500 font-medium">Keep it to 3-4 questions max.</p>
                     </div>
                     <button onClick={addQuestion} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full flex items-center gap-2 hover:bg-gray-800">
                       <Plus size={14} /> Add Question
                     </button>
                   </div>

                   <div className="space-y-4">
                     {questions.map((q, i) => (
                       <div key={q.id} className="p-6 bg-neutral-50 rounded-3xl border border-black/5 relative group">
                         <button onClick={() => removeQuestion(q.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                           <Trash2 size={16} />
                         </button>
                         <div className="space-y-4">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Question {i + 1}</label>
                             <input 
                               value={q.question} onChange={e => updateQuestion(q.id, { question: e.target.value })}
                               className="w-full bg-transparent font-bold text-lg outline-none"
                             />
                           </div>
                           <div className="pt-4 border-t border-black/5">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Options</label>
                             <div className="flex flex-wrap gap-2">
                               {q.options?.map((opt: string, optIdx: number) => (
                                 <input 
                                   key={optIdx} value={opt}
                                   onChange={e => {
                                     const newOpts = [...q.options]; newOpts[optIdx] = e.target.value;
                                     updateQuestion(q.id, { options: newOpts });
                                   }}
                                   className="px-3 py-1.5 bg-white border border-black/5 rounded-full text-sm font-medium w-32 outline-none focus:border-black"
                                 />
                               ))}
                               <button 
                                 onClick={() => updateQuestion(q.id, { options: [...(q.options||[]), 'New Option'] })}
                                 className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 rounded-full text-sm font-medium hover:text-black"
                               >+ Add</button>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                     {questions.length === 0 && (
                       <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 text-sm font-bold">
                         No questions added. Add a question to start the quiz.
                       </div>
                     )}
                   </div>
                 </motion.div>
               )}

               {activeStep === 3 && (
                 <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                   <div>
                     <h3 className="text-xl font-black mb-1">3. Show Result</h3>
                     <p className="text-sm text-gray-500 font-medium">This is where the conversion happens.</p>
                   </div>

                   <div className="p-6 bg-neutral-50 rounded-3xl border border-black/5 space-y-4">
                     <h4 className="font-bold text-sm">Default Result</h4>
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Result Title</label>
                       <input 
                         value={resultTitle} onChange={e => setResultTitle(e.target.value)}
                         className="w-full px-4 py-3 bg-white rounded-xl border border-transparent focus:border-black outline-none font-black"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                       <textarea 
                         value={resultDesc} onChange={e => setResultDesc(e.target.value)}
                         className="w-full px-4 py-3 bg-white rounded-xl border border-transparent focus:border-black outline-none font-medium resize-none h-20"
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CTA Label</label>
                         <input 
                           value={ctaLabel} onChange={e => setCtaLabel(e.target.value)}
                           className="w-full px-4 py-3 bg-white rounded-xl border border-transparent focus:border-black outline-none font-bold text-sm"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</label>
                         <select 
                           value={ctaType} onChange={e => setCtaType(e.target.value as any)}
                           className="w-full px-4 py-3 bg-white rounded-xl border border-transparent focus:border-black outline-none font-bold text-sm"
                         >
                           <option value="whatsapp">Open WhatsApp</option>
                           <option value="link">Direct Link</option>
                           <option value="booking">Book Meeting</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <h4 className="font-bold text-sm flex items-center gap-2"><Sparkles size={16} className="text-amber-500" /> Dynamic Rules (Optional)</h4>
                       <button onClick={addRule} className="text-xs font-bold text-[#6366f1]">+ Add Logic</button>
                     </div>
                     {resultRules.map((rule, idx) => (
                       <div key={idx} className="p-4 border-2 border-[#6366f1]/20 bg-[#6366f1]/5 rounded-2xl relative">
                         <button onClick={() => setResultRules(resultRules.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={14}/></button>
                         <div className="text-xs font-bold mb-3">If Question {rule.condition.questionIndex + 1} = Option {rule.condition.optionIndex + 1}</div>
                         <input 
                           value={rule.title} onChange={e => { const newR = [...resultRules]; newR[idx].title = e.target.value; setResultRules(newR); }}
                           className="w-full mb-2 px-3 py-2 bg-white rounded-lg outline-none font-bold text-sm"
                         />
                         <input 
                           value={rule.ctaLabel} onChange={e => { const newR = [...resultRules]; newR[idx].ctaLabel = e.target.value; setResultRules(newR); }}
                           className="w-full px-3 py-2 bg-white rounded-lg outline-none text-sm"
                         />
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Live Preview</h3>
              <div className="flex bg-white rounded-lg border border-black/5 p-1">
                {(['hero', 'quiz', 'result'] as const).map(p => (
                  <button 
                    key={p} onClick={() => setPreviewStep(p)}
                    className={`px-3 py-1 text-xs font-bold rounded-md ${previewStep === p ? 'bg-black text-white' : 'text-gray-500'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Device Mockup */}
            <div className="w-full max-w-[340px] mx-auto bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-900 relative h-[650px] overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 flex justify-center rounded-t-[3rem]">
                 <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
              </div>
              
              <div className="flex-1 bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col pt-8 bg-gradient-to-br from-indigo-50 to-white">
                {previewStep === 'hero' && (
                  <div className="p-6 flex flex-col items-center text-center h-full animate-fade-in-up">
                    <div className="w-20 h-20 bg-black rounded-full mb-6"></div>
                    <h2 className="text-2xl font-black mb-3">{headline || 'Your Headline Here'}</h2>
                    <p className="text-sm text-gray-600 mb-8">{subheadline || 'Subheadline will appear here.'}</p>
                    <button className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg mt-auto">{ctaLabel}</button>
                  </div>
                )}
                
                {previewStep === 'quiz' && (
                  <div className="p-6 flex flex-col h-full animate-fade-in-up">
                    <div className="w-full bg-gray-200 h-1 rounded-full mb-8"><div className="w-1/3 bg-black h-full rounded-full"></div></div>
                    <h2 className="text-xl font-black mb-6">{questions[0]?.question || 'Question appears here?'}</h2>
                    <div className="space-y-3 mt-auto mb-8">
                      {questions[0]?.options?.map((opt: string, i: number) => (
                        <div key={i} className="p-4 border-2 border-gray-100 rounded-2xl text-center font-bold text-sm bg-white hover:border-black">{opt}</div>
                      )) || <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400">Options here</div>}
                    </div>
                  </div>
                )}

                {previewStep === 'result' && (
                  <div className="p-6 flex flex-col items-center text-center h-full animate-fade-in-up">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"><Check size={40}/></div>
                    <h2 className="text-2xl font-black mb-3">{resultTitle}</h2>
                    <p className="text-sm text-gray-600 mb-8">{resultDesc}</p>
                    
                    <div className="w-full p-4 bg-white border border-gray-100 rounded-2xl mb-auto">
                      <div className="w-full h-32 bg-gray-100 rounded-xl mb-3"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    </div>

                    <button className="w-full py-4 bg-[#25d366] text-white font-bold rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2">
                      {ctaLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
