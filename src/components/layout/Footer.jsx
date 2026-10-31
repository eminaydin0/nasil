import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { afterHeroImage } from '../../lib/afterHero';

const HOME_TAGLINE =
  'Geleneksel Türk oyunlarının kurallarını anlatan dijital rehberiniz. Kültürümüzün değerli mirasını gelecek nesillere aktarıyoruz.';

const SHORT_TAGLINE = 'Oyun kuralları, rehberler, araçlar ve haberler — Kuralı Ne?';

const exploreLinks = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/oyunlar', label: 'Oyunlar' },
  { to: '/haberler', label: 'Haberler' },
  { to: '/ucretsiz-oyunlar', label: 'Bedava Oyunlar' },
  { to: '/araclar', label: 'Araçlar' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/reklam-verin', label: 'Reklam Verin' },
];

const legalLinks = [
  { to: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
  { to: '/gizlilik', label: 'Gizlilik Politikası' },
  { to: '/cerez-politikasi', label: 'Çerez Politikası' },
];

function FooterLink({ to, children, night = false, className = '' }) {
  return (
    <Link
      to={to}
      className={`text-sm transition-colors ${
        night ? 'text-white/60 hover:text-orange-300' : 'text-warm-600 hover:text-orange-600'
      } ${className}`}
    >
      {children}
    </Link>
  );
}

function FooterColumn({ title, night = false, children }) {
  return (
    <div>
      <h3 className={`mb-3 text-sm font-bold ${night ? 'text-white' : 'text-warm-900'}`}>{title}</h3>
      {children}
    </div>
  );
}

function Footer() {
  const { pathname } = useLocation();
  const night = true;

  const [contactInfo, setContactInfo] = useState({
    email: 'eminaydinyazilim@gmail.com',
    phone: '0553 882 76 46',
  });

  useEffect(() => {
    let cancelled = false;
    afterHeroImage().then(() => {
      if (!cancelled) loadContactInfo();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'contact_info')
        .single();

      if (!error && data) {
        const parsed = JSON.parse(data.content);
        setContactInfo({
          email: parsed.email || 'eminaydinyazilim@gmail.com',
          phone: parsed.phone || '0553 882 76 46',
        });
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const phoneHref = `tel:${contactInfo.phone.replace(/\s/g, '')}`;

  return (
    <footer
      className={
        night
          ? 'mt-auto border-t border-white/[0.06] bg-[#0c0b09]'
          : 'mt-auto border-t border-warm-200/80 bg-cream-50/90'
      }
    >
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center" aria-label="Kuralı Ne? - Ana Sayfa">
              <img
                src="/logo.webp"
                alt="Kuralı Ne?"
                className="h-11 w-auto object-contain sm:h-12"
                loading="lazy"
                decoding="async"
                width="288"
                height="96"
              />
            </Link>
            <p className={`mt-4 text-sm leading-relaxed ${night ? 'text-white/60' : 'text-warm-600'}`}>
              {pathname === '/' ? HOME_TAGLINE : SHORT_TAGLINE}
            </p>
            <Link
              to="/iletisim"
              className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                night ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-700'
              }`}
            >
              Bize ulaşın
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>

          {/* Keşfet — snippet kirliliğini önle */}
          <div data-nosnippet>
            <FooterColumn title="Keşfet" night={night}>
              <ul className="space-y-2.5">
                {exploreLinks.map(({ to, label }) => (
                  <li key={to}>
                    <FooterLink to={to} night={night}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Yasal */}
          <div data-nosnippet>
            <FooterColumn title="Yasal" night={night}>
              <ul className="space-y-2.5">
                {legalLinks.map(({ to, label }) => (
                  <li key={to}>
                    <FooterLink to={to} night={night}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* İletişim */}
          <div data-nosnippet>
            <FooterColumn title="İletişim" night={night}>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className={`group flex items-center gap-2.5 text-sm transition-colors ${
                    night ? 'text-white/70 hover:text-orange-300' : 'text-warm-600 hover:text-orange-600'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-orange-500 ring-1 transition-colors ${
                      night
                        ? 'bg-white/[0.06] ring-white/10 group-hover:bg-orange-500/15'
                        : 'bg-white shadow-soft ring-warm-200/60 group-hover:bg-orange-50'
                    }`}
                  >
                    <Mail size={15} aria-hidden />
                  </span>
                  <span className="min-w-0 font-medium break-words">{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={phoneHref}
                  className={`group flex items-center gap-2.5 text-sm transition-colors ${
                    night ? 'text-white/70 hover:text-orange-300' : 'text-warm-600 hover:text-orange-600'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-orange-500 ring-1 transition-colors ${
                      night
                        ? 'bg-white/[0.06] ring-white/10 group-hover:bg-orange-500/15'
                        : 'bg-white shadow-soft ring-warm-200/60 group-hover:bg-orange-50'
                    }`}
                  >
                    <Phone size={15} aria-hidden />
                  </span>
                  <span className="font-medium whitespace-nowrap">{contactInfo.phone}</span>
                </a>
              </li>
            </ul>
            </FooterColumn>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={night ? 'border-t border-white/[0.06]' : 'border-t border-warm-200/70 bg-white/60'}>
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
          <p className={`text-center text-xs leading-relaxed md:text-left ${night ? 'text-white/45' : 'text-warm-500'}`}>
            © {new Date().getFullYear()} Kuralı Ne?. Tüm hakları saklıdır.
            <span className={`mx-1.5 ${night ? 'text-white/20' : 'text-warm-300'}`}>·</span>
            Zenvolab tarafından kurulmuştur.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" data-nosnippet>
            <FooterLink to="/iletisim" night={night}>İletişim</FooterLink>
            <FooterLink to="/gizlilik" night={night}>Gizlilik</FooterLink>
            <FooterLink to="/cerez-politikasi" night={night}>Çerezler</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
