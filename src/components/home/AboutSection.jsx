import { Award, ArrowRight, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSiteStats } from '../../hooks/useSiteStats';

/**
 * AboutSection - kültürel miras hikayesi.
 * Yüzen rozet StatsSection ile aynı veri kaynağından besleniyor (sahte 500+ kaldırıldı).
 */
export default function AboutSection() {
  const { stats } = useSiteStats();
  const [culturalContent, setCulturalContent] = useState({
    title: 'Kültürel Mirasımız',
    subtitle: 'Geleneksel Oyunlarımızı Yaşatıyoruz',
    content:
      'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.\n\nTeknolojinin hızla geliştiği günümüzde, bu geleneksel oyunları dijital ortamda belgeleyerek gelecek nesillere aktarmak ve yaşatmak istiyoruz.',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('section_key', 'cultural_heritage')
          .single();
        if (!cancelled && !error && data) {
          setCulturalContent({
            title: data.title,
            subtitle: data.subtitle,
            content: data.content,
          });
        }
      } catch (err) {
        console.error('Error loading content:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Görüntülenecek "X+ aktif kullanıcı" - gerçek sayıyı warm bir floor'a yuvarla
  const userBadgeCount = (() => {
    const u = Number(stats.users) || 0;
    if (u >= 1000) return `${Math.floor(u / 100) * 100}+`;
    if (u >= 100) return `${Math.floor(u / 10) * 10}+`;
    if (u >= 10) return `${u}+`;
    return `${u}`;
  })();

  return (
    <section id="hakkinda" className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-orange-200/40 bg-gradient-to-br from-cream-100 via-white to-orange-50 p-5 shadow-soft sm:rounded-3xl sm:p-8 md:p-12 lg:p-16">
        {/* Dekoratif şekiller */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 grid items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-orange-700 shadow-soft backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <Award size={15} className="sm:w-4 sm:h-4" />
              {culturalContent.title}
            </div>

            <h2 className="mb-4 text-2xl font-extrabold leading-[1.1] tracking-tight text-warm-900 sm:mb-6 sm:text-3xl md:text-4xl lg:text-[2.5rem]">
              {culturalContent.subtitle}
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-warm-600 sm:space-y-4 sm:text-base md:text-lg">
              {culturalContent.content.split('\n').map(
                (paragraph, index) => paragraph.trim() && <p key={index}>{paragraph}</p>
              )}
            </div>

            <div className="mt-8">
              <Link
                to="/hakkimizda"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-charcoal-900 text-cream-50 rounded-2xl font-semibold hover:bg-charcoal-800 transition-all duration-300 ease-spring shadow-soft-md hover:-translate-y-0.5 group"
              >
                <span>Daha Fazla Bilgi</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Sağ - Görsel */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-soft-xl group">
              <img
                src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop"
                alt="Geleneksel oyunlar"
                loading="lazy"
                decoding="async"
                width="800"
                height="600"
                className="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/25 via-transparent to-transparent" />
            </div>

            {/* Yüzen badge - gerçek istatistikten besleniyor */}
            <div className="absolute -bottom-3 left-3 rounded-xl border border-warm-100 bg-white p-3 shadow-soft-lg sm:-bottom-4 sm:-left-4 sm:rounded-2xl sm:p-4 md:-left-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-warm-glow">
                  <Users size={20} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-extrabold text-warm-900 tracking-tight tabular-nums">{userBadgeCount}</p>
                  <p className="text-warm-500 text-xs">Aktif Kullanıcı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
