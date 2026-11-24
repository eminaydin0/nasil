import { Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import Breadcrumb from './Breadcrumb';

function splitDocBlocks(raw) {
  return String(raw || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((para) => {
      const isHeading =
        /^\d+\.\s+\S+/.test(para) && para.length < 100 && !para.trim().endsWith('.');
      return { type: isHeading ? 'heading' : 'paragraph', text: para };
    });
}

/**
 * Statik içerik sayfaları (gizlilik, çerez, reklam, koşullar).
 * Gece modunda da okunur kalsın diye kendi renk değişkenlerini kullanır.
 */
export default function SiteDocPage({
  title,
  subtitle,
  content,
  loading = false,
  icon: Icon,
  accent = 'orange',
  seo,
  breadcrumbs = [],
  relatedLinks = [],
  cta = null,
  children = null,
}) {
  const blocks = splitDocBlocks(content);
  const crumbItems =
    breadcrumbs.length > 0 ? breadcrumbs : [{ name: title, url: null }];
  const CtaIcon = cta?.icon || null;

  return (
    <div className={`site-doc site-doc--${accent}`}>
      {seo ? (
        <SEO
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          url={seo.url}
          structuredData={seo.structuredData}
          breadcrumbs={crumbItems}
        />
      ) : null}

      <div className="site-doc-aura" aria-hidden />

      <div className="container relative z-[1] mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb items={crumbItems} className="site-doc-crumb mb-6" />

        <article className="site-doc-shell mx-auto w-full max-w-5xl">
          <header className="site-doc-hero">
            <div className="site-doc-hero-row">
              {Icon ? (
                <div className="site-doc-icon" aria-hidden>
                  <Icon size={26} strokeWidth={2.25} />
                </div>
              ) : null}
              <div className="min-w-0">
                <p className="site-doc-kicker">Bilgi</p>
                <h1 className="site-doc-title">{title}</h1>
                {subtitle ? (
                  <p className="site-doc-subtitle">
                    <Calendar size={15} aria-hidden />
                    <span>{subtitle}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </header>

          <div className="site-doc-body">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="site-doc-spinner animate-spin" size={36} aria-label="Yükleniyor" />
              </div>
            ) : (
              <div className="site-doc-prose">
                {blocks.map((block, i) =>
                  block.type === 'heading' ? (
                    <h2 key={i} className="site-doc-h2">
                      {block.text}
                    </h2>
                  ) : (
                    <p key={i} className="site-doc-p">
                      {block.text}
                    </p>
                  )
                )}
                {children}
              </div>
            )}
          </div>
        </article>

        {cta ? (
          <div className="mx-auto mt-8 flex w-full max-w-5xl justify-center">
            <Link to={cta.to} className="site-doc-cta">
              {CtaIcon ? <CtaIcon size={18} aria-hidden /> : null}
              {cta.label}
            </Link>
          </div>
        ) : null}

        {relatedLinks.length > 0 ? (
          <nav
            className="site-doc-related mx-auto mt-8 w-full max-w-5xl"
            aria-label="İlgili sayfalar"
          >
            {relatedLinks.map((link) => (
              <Link key={link.to} to={link.to} className="site-doc-related-link">
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
