'use client';

/**
 * Emet un event client une seule fois au montage (page_offre_vue, dashboard_parrain_vu, ...).
 * Gate consentement gere par trackClient. Ne rend rien.
 */
import { useEffect, useRef } from 'react';
import { trackClient, type ClientEvent } from '@/lib/analytics-client';

export function TrackOnMount({ event, props }: { event: ClientEvent; props?: Record<string, unknown> }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackClient(event, props ?? {});
    // props volontairement hors deps : on emet une seule fois au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
