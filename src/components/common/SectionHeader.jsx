import { Link } from 'react-router-dom';

/**
 * Tutarlı section başlığı bileşeni
 * Tüm ana sayfa bölümlerinde kullanılır
 */
function SectionHeader({ 
  title, 
  subtitle,
  icon: Icon, 
  iconColor = 'text-orange-500',
  iconBg = 'bg-orange-50',
  link,
  linkText = 'Tümünü Gör',
  centered = false,
  className = ''
}) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : 'flex items-end justify-between'} ${className}`}>
      <div className={centered ? '' : 'flex-1'}>
        {/* Üst etiket */}
        {subtitle && (
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
            {subtitle}
          </p>
        )}
        
        {/* Ana başlık */}
        <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
          {Icon && (
            <div className={`p-2.5 ${iconBg} rounded-xl`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
        </div>
      </div>

      {/* Link */}
      {link && !centered && (
        <Link 
          to={link}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group"
        >
          <span>{linkText}</span>
          <svg 
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
