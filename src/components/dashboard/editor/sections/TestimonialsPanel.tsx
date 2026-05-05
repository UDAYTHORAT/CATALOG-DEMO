import React from 'react';
import { MessageCircle, Plus, Star, Trash2 } from 'lucide-react';
import { IconButton, PanelTitle, subtleInputClass } from '../ui';
import type { TestimonialItem, TestimonialsData } from '../types';

export default React.memo(function TestimonialsPanel({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: TestimonialsData;
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<TestimonialItem>) => void;
  onRemove: (id: string) => void;
}) {
  const testimonials = data.testimonials;

  return (
    <div className="space-y-5">
      <PanelTitle
        icon={MessageCircle}
        label="Customer Reviews"
        meta={`${testimonials.length} visible`}
        action={
          <IconButton label="Add review" onClick={onAdd}>
            <Plus size={15} />
          </IconButton>
        }
      />

      <div className="space-y-3">
        {testimonials.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-400">
            No reviews yet. Add one to build trust.
          </div>
        )}

        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Star size={16} />
              </div>
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                <input
                  value={testimonial.name}
                  onChange={(event) => onUpdate(index, { name: event.target.value })}
                  className={subtleInputClass}
                />
                <input
                  value={testimonial.city}
                  onChange={(event) => onUpdate(index, { city: event.target.value })}
                  className={subtleInputClass}
                />
              </div>
              <IconButton label="Delete review" onClick={() => onRemove(testimonial.id)}>
                <Trash2 size={15} />
              </IconButton>
            </div>
            <textarea
              value={testimonial.text}
              onChange={(event) => onUpdate(index, { text: event.target.value })}
              rows={3}
              className={`${subtleInputClass} resize-none leading-relaxed`}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
