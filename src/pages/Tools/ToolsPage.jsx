import { useEffect, useMemo } from 'react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import { PAGE_SEO, generateFAQSchema, SITE_CONFIG } from '../../constants/seo';
import { SITE_TOOLS } from '../../constants/tools';
import { TOOLS_HUB_FAQS } from '../../constants/toolLandingCopy';

const BOARD = [
  { id: '101-yazboz', job: 'Ceza puanını yaz, toplam kendiliğinden gelsin' },
  { id: 'okey-sayaci', job: 'Elin cezasını kaydet' },
  { id: 'batak-yazboz', job: 'Tur puanını yaz, toplam otomatik' },
  { id: 'halisaha-takim-olusturucu', job: 'Dizilişi kur, PNG olarak indir' },
  { id: 'takim-olusturucu', job: 'İsimleri yaz, takımlar karışsın' },
  { id: 'karar-carki', job: 'Seçenekleri yaz, çarkı çevir' },
  { id: 'kura-cek', job: 'Kutudan bir isim çek' },
  { id: 'zar-at', job: 'Tek veya çift zar at' },
  { id: 'skor-tablosu', job: 'İsimleri yaz, sırayı gör' },
];

function Shot({ tool, job, eager }) {
  return (
    <Link to={tool.link} className="tools-shot">
      <span className="tools-shot-visual">
        <img
          src={tool.photo}
          alt=""
          width="640"
          height="400"
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
        />
      </span>
      <span className="tools-shot-copy">
        <strong>{tool.title}</strong>
        <span>{job}</span>
      </span>
    </Link>
  );
}

export default function ToolsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const byId = useMemo(() => Object.fromEntries(SITE_TOOLS.map((tool) => [tool.id, tool])), []);
  const breadcrumbs = [{ name: 'Oyun Araçları', url: null }];

  const structuredData = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: PAGE_SEO.tools.title,
        description: PAGE_SEO.tools.description,
        url: `${SITE_CONFIG.url}/araclar`,
        isPartOf: { '@type': 'WebSite', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: SITE_TOOLS.length,
          itemListElement: SITE_TOOLS.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.title,
            url: `${SITE_CONFIG.url}${tool.link}`,
            description: tool.description,
          })),
        },
      },
      generateFAQSchema(TOOLS_HUB_FAQS),
    ],
    []
  );

  return (
    <div className="home-night min-h-screen overflow-x-clip">
      <SEO
        title={PAGE_SEO.tools.title}
        description={PAGE_SEO.tools.description}
        keywords={PAGE_SEO.tools.keywords}
        url="/araclar"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto min-w-0 px-3 py-6 sm:px-4 sm:py-8">
        <Breadcrumb items={breadcrumbs} className="mb-4" />

        <header className="tools-hub-hero">
          <h1>Oyun Araçları — Yazboz, Sayaç &amp; Takım</h1>
          <p>Masada aç, puanı yaz, takımı kur.</p>
        </header>

        <div className="tools-board">
          {BOARD.map((spec, index) => (
            <Shot key={spec.id} tool={byId[spec.id]} job={spec.job} eager={index === 0} />
          ))}
        </div>

        <section className="tools-hub-panel">
          <h2>Sıkça Sorulan Sorular</h2>
          {TOOLS_HUB_FAQS.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
          <Link to="/oyunlar" className="tools-hub-more">
            Oyun kurallarına bak
          </Link>
        </section>
      </div>
    </div>
  );
}
