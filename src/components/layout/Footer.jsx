import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const exploreLinks = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/oyunlar', label: 'Oyunlar' },
  { to: '/araclar', label: 'Araçlar' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/reklam-verin', label: 'Reklam Verin' },
];

const legalLinks = [
  { to: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
  { to: '/gizlilik', label: 'Gizlilik Politikası' },
  { to: '/cerez-politikasi', label: 'Çerez Politikası' },
];

function FooterLink({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`text-sm text-warm-600 transition-colors hover:text-orange-600 ${className}`}
    >
      {children}
    </Link>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-warm-900">{title}</h3>
      {children}
    </div>
  );
}

function Footer() {
  const [contactInfo, setContactInfo] = useState({
    email: 'eminaydinyazilim@gmail.com',
    phone: '0553 882 76 46',
  });

  useEffect(() => {
    loadContactInfo();
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
    <footer className="mt-auto border-t border-warm-200/80 bg-cream-50/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Kuralı Ne? - Ana Sayfa">
              <img
                src="/logo.svg"
                alt="Kuralı Ne?"
                className="h-12 w-auto object-contain"
                loading="lazy"
                decoding="async"
                width="48"
                height="48"
              />
              <span className="text-base font-extrabold tracking-tight text-warm-900">
                Kuralı Ne?
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-warm-600">
              Geleneksel Türk oyunlarının kurallarını anlatan dijital rehberiniz. Kültürümüzün
              değerli mirasını gelecek nesillere aktarıyoruz.
            </p>
            <Link
              to="/iletisim"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
            >
              Bize ulaşın
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>

          {/* Keşfet */}
          <FooterColumn title="Keşfet">
            <ul className="space-y-2.5">
              {exploreLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Yasal */}
          <FooterColumn title="Yasal">
            <ul className="space-y-2.5">
              {legalLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* İletişim */}
          <FooterColumn title="İletişim">
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex items-center gap-2.5 text-sm text-warm-600 transition-colors hover:text-orange-600"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-soft ring-1 ring-warm-200/60 transition-colors group-hover:bg-orange-50">
                    <Mail size={15} aria-hidden />
                  </span>
                  <span className="min-w-0 font-medium break-words">{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={phoneHref}
                  className="group flex items-center gap-2.5 text-sm text-warm-600 transition-colors hover:text-orange-600"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-soft ring-1 ring-warm-200/60 transition-colors group-hover:bg-orange-50">
                    <Phone size={15} aria-hidden />
                  </span>
                  <span className="font-medium whitespace-nowrap">{contactInfo.phone}</span>
                </a>
              </li>
            </ul>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-warm-200/70 bg-white/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
          <p className="text-center text-xs leading-relaxed text-warm-500 md:text-left">
            © {new Date().getFullYear()} Kuralı Ne?. Tüm hakları saklıdır.
            <span className="mx-1.5 text-warm-300">·</span>
            Zenvolab tarafından kurulmuştur.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <FooterLink to="/iletisim">İletişim</FooterLink>
            <FooterLink to="/gizlilik">Gizlilik</FooterLink>
            <FooterLink to="/cerez-politikasi">Çerezler</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
