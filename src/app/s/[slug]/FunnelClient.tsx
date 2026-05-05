'use client';

import EliteFurnitureTemplate, { type FunnelProduct } from '@/components/templates/EliteFurnitureTemplate';

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
  // In the future, you can dynamically render different templates here
  // based on props.funnel.template_id or props.funnel.theme.
  return <EliteFurnitureTemplate {...props} />;
}
