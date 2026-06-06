'use client';

import EliteFurnitureTemplate, { type FunnelProduct } from '@/components/templates/EliteFurnitureTemplate';
import EliteRealEstateTemplate from '@/components/templates/EliteRealEstateTemplate';
import EliteCafeTemplate from '@/components/templates/EliteCafeTemplate';

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

import { useEffect } from 'react';
import { incrementFunnelView } from '@/app/actions/leads';

export default function FunnelClient(props: Props) {
  const templateId = props.funnel.story_mode_data?.[0]?.templateId as string | undefined;

  useEffect(() => {
    if (props.isPreview) return;
    
    // Only count once per session
    const viewKey = `viewed_funnel_${props.funnel.id}`;
    if (!sessionStorage.getItem(viewKey)) {
      incrementFunnelView(props.funnel.id);
      sessionStorage.setItem(viewKey, 'true');
    }

    // Capture traffic source on landing (persist across sessions in localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || urlParams.get('source') || urlParams.get('ref') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const referrer = document.referrer || '';

    // Update localStorage if new UTMs are present, or use existing stored ones
    if (utmSource) {
      localStorage.setItem(`utm_source_${props.funnel.id}`, utmSource);
      if (utmMedium) localStorage.setItem(`utm_medium_${props.funnel.id}`, utmMedium);
      if (utmCampaign) localStorage.setItem(`utm_campaign_${props.funnel.id}`, utmCampaign);
    }
    if (referrer && !referrer.includes(window.location.hostname)) {
      localStorage.setItem(`referrer_${props.funnel.id}`, referrer);
    }

    // Mirror to sessionStorage for backwards compatibility
    sessionStorage.setItem('funnel_traffic_source', utmSource || localStorage.getItem(`utm_source_${props.funnel.id}`) || '');
    sessionStorage.setItem('funnel_traffic_referrer', referrer || localStorage.getItem(`referrer_${props.funnel.id}`) || '');
    sessionStorage.setItem('funnel_traffic_medium', utmMedium || localStorage.getItem(`utm_medium_${props.funnel.id}`) || '');
    sessionStorage.setItem('funnel_traffic_campaign', utmCampaign || localStorage.getItem(`utm_campaign_${props.funnel.id}`) || '');
  }, [props.funnel.id, props.isPreview]);

  if (templateId === 'funnelad-elite-real-estate') {
    return <EliteRealEstateTemplate {...props} />;
  }

  if (templateId === 'funnelad-elite-cafe') {
    return <EliteCafeTemplate {...props} />;
  }

  return <EliteFurnitureTemplate {...props} />;
}
