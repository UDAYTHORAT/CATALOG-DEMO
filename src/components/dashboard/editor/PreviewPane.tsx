import React from 'react';
import EliteFurnitureTemplate from '@/components/templates/EliteFurnitureTemplate';
import type { Funnel } from '@/app/actions/funnels';
import type { Content, PreviewMode, SectionId } from './types';

const previewSizeClass: Record<PreviewMode, string> = {
  mobile: 'max-w-[420px]',
  tablet: 'max-w-[900px]',
  desktop: 'w-full',
};

export default React.memo(function PreviewPane({
  funnel,
  content,
  products,
  previewMode,
  onEditSection,
}: {
  funnel: Funnel;
  content: Content;
  products?: any[];
  previewMode: PreviewMode;
  onEditSection?: (sectionId: SectionId) => void;
}) {
  return (
    <main className="relative flex min-w-0 h-full w-full min-h-0 items-center justify-center overflow-hidden bg-[#f6f7f9] p-0 md:p-6">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className={`relative z-10 h-full w-full ${previewSizeClass[previewMode]}`}>
        <div 
          id="mobile-scroll-container"
          className="h-full overflow-y-auto rounded-none md:rounded-[28px] bg-white shadow-none md:shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]"
        >
          <EliteFurnitureTemplate
            funnel={{ ...funnel, story_mode_data: [{ content: content as any }] }}
            store={{
              name: content.storeName,
              whatsapp_number: content.whatsappNumber,
              logo_url: content.logoUrl,
            }}
            products={products}
            isPreview={true}
            previewMode={previewMode}
            onEditSection={onEditSection}
          />
        </div>
      </div>
    </main>
  );
});
