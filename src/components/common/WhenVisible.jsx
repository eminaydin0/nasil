import { useEffect, useRef, useState } from 'react';

/**
 * Alt bölümlerin veri isteklerini, bölüm görünene kadar bekletir.
 * İlk ekran kahraman görseliyle yarışmasın diye.
 */
function WhenVisible({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: '240px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  );
}

export default WhenVisible;
