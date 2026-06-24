import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../common/SEO';
import Breadcrumb from '../common/Breadcrumb';

/**
 * Araç alt sayfası iskeleti — /araclar listesi ile aynı ölçek ve dil
 */
export default function ToolLayout({
  title,
  description,
  icon: Icon,
  badge,
  children,
  helpContent,
  seoTitle,
  seoDescription,
  seoUrl,
}) {
  const breadcrumbs = [
    { name: 'Oyun Araçları', url: '/araclar' },
    { name: title, url: null },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <SEO
        title={seoTitle || `${title} - Kuralı Ne?`}
        description={seoDescription || description}
        url={seoUrl}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Başlık — ToolsPage ile aynı ölçek */}
        <div className="mb-6">
            <div className="mb-4 flex items-start gap-3">
              {Icon && (
                <div className="shrink-0 rounded-xl bg-orange-100 p-3">
                  <Icon className="text-orange-600" size={32} aria-hidden />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black text-warm-900">{title}</h1>
                  {badge ? (
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                      {badge}
                    </span>
                  ) : null}
                </div>
                {description ? (
                  <p className="mt-1 text-sm leading-relaxed text-warm-600 sm:text-base">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>

            <Link
              to="/araclar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
            >
              <ArrowLeft size={16} aria-hidden />
              Tüm araçlara dön
            </Link>
          </div>

          {/* Araç içeriği */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft">
            {children}
          </div>

          {/* Yardım */}
          {helpContent ? (
            <section className="mt-6 rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="mb-4 text-sm font-bold text-warm-900">Yardım & ipuçları</h2>
              <div className="text-sm leading-relaxed text-warm-600">{helpContent}</div>
            </section>
          ) : null}
      </div>
    </div>
  );
}
