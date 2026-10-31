import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import SEO from '../common/SEO';
import Breadcrumb from '../common/Breadcrumb';
import { ToolFeaturesCard, RelatedToolsCard, RelatedToolsStrip } from '../tools/ToolExtras';
import { buildToolSeoMeta, buildToolStructuredData } from '../../lib/seoEngine';
import { generateFAQSchema } from '../../constants/seo';

/**
 * Araç alt sayfası iskeleti — /araclar listesi ile aynı ölçek ve dil
 *
 * SEO içerik slotları:
 * - seoContent: aramada hedeflenen kelimeleri içeren indexlenebilir prose (JSX)
 * - faqItems: [{ question, answer }] — görünür SSS + FAQPage schema
 */
export default function ToolLayout({
  title,
  description,
  icon: Icon,
  badge,
  children,
  helpContent,
  seoContent,
  faqItems = [],
  seoTitle,
  seoDescription,
  seoUrl,
}) {
  const stageRef = useRef(null);
  const nativeFullRef = useRef(false);
  const [full, setFull] = useState(false);
  const breadcrumbs = [
    { name: 'Oyun Araçları', url: '/araclar' },
    { name: title, url: null },
  ];

  useEffect(() => {
    if (!full) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') setFull(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [full]);

  useEffect(() => {
    const onChange = () => {
      if (document.fullscreenElement) return;
      if (!nativeFullRef.current) return;
      nativeFullRef.current = false;
      setFull(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enterFull = async () => {
    setFull(true);
    const node = stageRef.current;
    if (!node?.requestFullscreen) return;
    try {
      await node.requestFullscreen();
      nativeFullRef.current = true;
    } catch {
      nativeFullRef.current = false;
    }
  };

  const exitFull = async () => {
    setFull(false);
    nativeFullRef.current = false;
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      /* yoksay */
    }
  };

  const toolSeo = useMemo(
    () => buildToolSeoMeta(seoUrl, { seoTitle, seoDescription, title, description, seoUrl }),
    [seoUrl, seoTitle, seoDescription, title, description]
  );

  const structuredData = useMemo(() => {
    const schema = buildToolStructuredData(seoUrl, {
      seoTitle,
      seoDescription,
      title,
      description,
      seoUrl,
    });
    const list = schema ? [schema] : [];
    if (faqItems.length > 0) list.push(generateFAQSchema(faqItems));
    return list;
  }, [seoUrl, seoTitle, seoDescription, title, description, faqItems]);

  return (
    <div className="min-h-screen overflow-x-clip bg-cream-50 py-4 sm:py-6">
      <SEO
        title={toolSeo.title}
        description={toolSeo.description}
        keywords={toolSeo.keywords}
        url={toolSeo.url}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto min-w-0 px-3 sm:px-4">
        <Breadcrumb items={breadcrumbs} className="mb-3" />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 items-center gap-2.5">
            {Icon ? (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-100">
                <Icon className="text-orange-600" size={16} aria-hidden />
              </div>
            ) : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-warm-900 sm:text-xl">{title}</h1>
                {badge ? (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                    {badge}
                  </span>
                ) : null}
              </div>
              {description ? (
                <p className="text-sm leading-snug text-warm-600">{description}</p>
              ) : null}
            </div>
          </div>
          <Link
            to="/araclar"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
          >
            <ArrowLeft size={14} aria-hidden />
            Tüm araçlara dön
          </Link>
        </div>

        {/* İçerik + yan panel */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="min-w-0 space-y-6 overflow-x-clip">
            <div
              ref={stageRef}
              className={`tool-stage min-w-0 rounded-2xl border border-warm-200/70 bg-white shadow-soft${
                full ? ' tool-stage--full' : ' overflow-x-clip'
              }`}
            >
              <div className="tool-stage-bar">
                <button
                  type="button"
                  className="tool-fullscreen-btn"
                  onClick={full ? exitFull : enterFull}
                  aria-pressed={full}
                >
                  {full ? <Minimize2 size={15} aria-hidden /> : <Maximize2 size={15} aria-hidden />}
                  {full ? 'Küçült' : 'Tam ekran'}
                </button>
              </div>
              <div className="tool-stage-body">{children}</div>
            </div>

            {helpContent ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="mb-4 text-sm font-bold text-warm-900">Yardım & ipuçları</h2>
                <div className="text-sm leading-relaxed text-warm-600">{helpContent}</div>
              </section>
            ) : null}

            {seoContent ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <div className="prose-tool max-w-none space-y-4 text-sm leading-relaxed text-warm-700 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-warm-900 [&_h2:first-child]:mt-0 [&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-warm-900 [&_a]:font-semibold [&_a]:text-orange-600 hover:[&_a]:text-orange-700 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                  {seoContent}
                </div>
              </section>
            ) : null}

            {faqItems.length > 0 ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-warm-900">Sıkça Sorulan Sorular</h2>
                <div className="divide-y divide-warm-200/70">
                  {faqItems.map((item) => (
                    <details key={item.question} className="group py-3">
                      <summary className="cursor-pointer list-none font-semibold text-warm-900 marker:content-none [&::-webkit-details-marker]:hidden">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-warm-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="hidden space-y-4 lg:block">
            <ToolFeaturesCard />
            {seoUrl ? <RelatedToolsCard currentLink={seoUrl} /> : null}
          </aside>
        </div>

        {/* Mobilde diğer araçlar */}
        {seoUrl ? (
          <div className="lg:hidden">
            <RelatedToolsStrip currentLink={seoUrl} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
