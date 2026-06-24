import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { hasAnalyticsConsent, trackPageView } from '../../utils/analytics';

/** Tüm SPA rotalarında merkezi sayfa görüntüleme takibi */
export default function AnalyticsRouteTracker() {
  const { pathname, search } = useLocation();
  const lastTracked = useRef('');

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    if (pathname.startsWith('/admin')) return;

    const url = `${pathname}${search || ''}`;
    if (url === lastTracked.current) return;
    lastTracked.current = url;

    trackPageView(url);
  }, [pathname, search]);

  return null;
}
