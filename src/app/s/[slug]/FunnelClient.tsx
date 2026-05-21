'use client';

import EliteFurnitureTemplate, { type FunnelProduct } from '@/components/templates/EliteFurnitureTemplate';
import EliteRealEstateTemplate from '@/components/templates/EliteRealEstateTemplate';

export type { FunnelProduct };

interface Props {
  funnel: {
    id: string;
    theme: string | null;
    welcome_title: string | null;
    welcome_description: string | null;
    questions?: unknown[];
    story_mode_data?: Array<Record<string, unknown>>;
  };
  store: {
    id: string;
    name: string;
    bio: string | null;
    logo_url: string | null;
    whatsapp_number: string | null;
  };
  products: FunnelProduct[];
  isPreview?: boolean;
}

export default function FunnelClient(props: Props) {
  const templateId = props.funnel.story_mode_data?.[0]?.templateId as string | undefined;

  if (templateId === 'funnelad-elite-real-estate') {
    return <EliteRealEstateTemplate {...props} />;
  }

  return <EliteFurnitureTemplate {...props} />;
}
