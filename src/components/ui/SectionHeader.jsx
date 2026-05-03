import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * SectionHeader - tutarlı bölüm başlığı (warm/sophisticated)
 * Eski common/SectionHeader API'sini koruyor; yeni boyut/spacing kullanır.
 */
function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-orange-600',
  iconBg = 'bg-orange-50',
  link,
  linkText = 'Tümünü Gör',
  centered = false,
  className = '',
}) {
  const headingClasses = 'font-extrabold text-warm-900 tracking-tight text-2xl sm:text-3xl md:text-[2.125rem] leading-[1.1]';
  const subtitleClasses = 'text-xs sm:text-sm font-semibold text-orange-600 uppercase tracking-[0.18em] mb-2.5';

  return (
    <header className={`mb-8 md:mb-12 ${centered ? 'text-center' : 'flex items-end justify-between gap-6 flex-wrap'} ${className}`}>
      <div className={centered ? 'mx-auto max-w-xl' : 'flex-1 min-w-0'}>
        {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
        <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
          {Icon && (
            <span className={`shrink-0 inline-flex items-center justify-center w-11 h-11 ${iconBg} rounded-2xl shadow-soft`}>
              <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
            </span>
          )}
          <h2 className={headingClasses}>{title}</h2>
        </div>
      </div>

      {link && !centered && (
        <Link
          to={link}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group shrink-0"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      )}
    </header>
  );
}

export default SectionHeader;
