import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * SectionHeader - tutarlı bölüm başlığı (warm/sophisticated)
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
  const headingClasses =
    'font-extrabold text-warm-900 tracking-tight text-xl sm:text-3xl md:text-[2.125rem] leading-[1.12]';
  const subtitleClasses =
    'text-[10px] sm:text-sm font-semibold text-orange-600 uppercase tracking-[0.16em] sm:tracking-[0.18em] mb-2';

  return (
    <header
      className={`mb-6 sm:mb-8 md:mb-12 ${
        centered
          ? 'text-center'
          : 'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6'
      } ${className}`}
    >
      <div className={centered ? 'mx-auto max-w-xl' : 'min-w-0 flex-1'}>
        {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
        <div className={`flex items-center gap-2.5 sm:gap-3 ${centered ? 'justify-center' : ''}`}>
          {Icon && (
            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${iconBg} shadow-soft`}
            >
              <Icon className={`h-[18px] w-[18px] sm:h-5 sm:w-5 ${iconColor}`} aria-hidden="true" />
            </span>
          )}
          <h2 className={headingClasses}>{title}</h2>
        </div>
      </div>

      {link && !centered && (
        <Link
          to={link}
          className="group inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-2 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-100 sm:self-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:font-semibold sm:text-orange-600 sm:hover:text-orange-700"
        >
          <span>{linkText}</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
            aria-hidden="true"
          />
        </Link>
      )}
    </header>
  );
}

export default SectionHeader;
