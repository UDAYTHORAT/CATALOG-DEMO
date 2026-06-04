import React from 'react';
import { MessageCircle, Plus, Star, Trash2, Video } from 'lucide-react';
import { IconButton, PanelTitle, subtleInputClass } from '../ui';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import type { TestimonialItem, TestimonialsData } from '../types';

export default React.memo(function TestimonialsPanel({
  data,
  onAdd,
  onUpdate,
  onRemove,
  templateId,
}: {
  data: TestimonialsData;
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<TestimonialItem>) => void;
  onRemove: (id: string) => void;
  templateId?: string;
}) {
  const testimonials = data.testimonials;

  return (
    <div className="space-y-6">
      <PanelTitle
        icon={MessageCircle}
        label="Customer Reviews & Installations"
        meta={`${testimonials.length}/3 visible`}
        action={
          testimonials.length < 3 ? (
            <IconButton label="Add review" onClick={onAdd}>
              <Plus size={15} />
            </IconButton>
          ) : (
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Max 3</span>
          )
        }
      />

      <div id="tour-testimonials-list" className="space-y-4">
        {testimonials.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-400">
            No reviews yet. Add one to build trust.
          </div>
        )}

        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">Review #{index + 1}</span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-current" />
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onRemove(testimonial.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Delete review"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3" id="tour-testimonials-name">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer Name</label>
                <input
                  value={testimonial.name}
                  onChange={(event) => onUpdate(index, { name: event.target.value })}
                  placeholder="e.g. Rahul S."
                  className={subtleInputClass}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">City</label>
                <input
                  value={testimonial.city}
                  onChange={(event) => onUpdate(index, { city: event.target.value })}
                  placeholder="e.g. Mumbai"
                  className={subtleInputClass}
                />
              </div>
            </div>

            <div id="tour-testimonials-quote">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Short Testimonial (Quote)</label>
              <textarea
                value={testimonial.text}
                onChange={(event) => onUpdate(index, { text: event.target.value })}
                rows={2}
                placeholder="e.g. Looks even better in person."
                className={`${subtleInputClass} resize-none leading-relaxed`}
              />
            </div>

            {templateId !== 'funnelad-elite-cafe' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Detail 1 (Delivery Proof)</label>
                    <input
                      value={testimonial.detail1 || ''}
                      onChange={(event) => onUpdate(index, { detail1: event.target.value })}
                      placeholder="e.g. Delivered in 9 Days"
                      className={subtleInputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Detail 2 (Finish/Material)</label>
                    <input
                      value={testimonial.detail2 || ''}
                      onChange={(event) => onUpdate(index, { detail2: event.target.value })}
                      placeholder="e.g. Custom walnut finish"
                      className={subtleInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2" id="tour-testimonials-photo">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Real Installation Photo</label>
                    <ImageUpload
                      defaultImage={testimonial.image}
                      onUploadComplete={(url) => onUpdate(index, { image: url })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
