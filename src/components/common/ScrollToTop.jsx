import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const SHOW_AFTER = 320;

function ScrollToTop() {
  const { pathname, search } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Yukarı çık"
      className={[
        'scroll-to-top-btn fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-warm-200/80 bg-white/95 text-warm-700 shadow-soft backdrop-blur-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2',
        'bottom-[calc(5.5rem+var(--mobile-bottom-ui,0px)+var(--safe-bottom))] right-[calc(1rem+var(--safe-right))]',
        'md:bottom-[calc(1.5rem+var(--safe-bottom))]',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      ].join(' ')}
    >
      <ChevronUp size={20} strokeWidth={2.5} aria-hidden />
    </button>
  );
}

export default ScrollToTop;
