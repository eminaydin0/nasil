import { useEffect, useMemo } from 'react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import { PAGE_SEO, generateFAQSchema, SITE_CONFIG } from '../../constants/seo';
import { SITE_TOOLS } from '../../constants/tools';
import { TOOLS_HUB_FAQS } from '../../constants/toolLandingCopy';

const BOARD = [
  {
    id: '101-yazboz',
    job: 'Ceza puanını yaz, toplam kendiliğinden gelsin',
    photo: '/media/tools/101-yazboz.jpg',
  },
  {
    id: 'okey-sayaci',
    job: 'Elin cezasını kaydet',
    photo: '/media/cards/perişan-okey.webp',
  },
  {
    id: 'batak-yazboz',
    job: 'Tur puanını yaz, toplam otomatik',
    photo: '/media/cards/eşli-batak.webp',
  },
  { id: 'halisaha-takim-olusturucu', job: 'Dizilişi kur, PNG olarak indir', photo: '/media/tools/halisaha.jpg' },
  { id: 'takim-olusturucu', job: 'İsimleri yaz, takımlar karışsın', still: 'split' },
  { id: 'karar-carki', job: 'Seçenekleri yaz, çarkı çevir', still: 'wheel' },
  { id: 'kura-cek', job: 'Kutudan bir isim çek', photo: '/media/tools/kura.jpg' },
  { id: 'zar-at', job: 'Tek veya çift zar at', still: 'dice' },
  { id: 'skor-tablosu', job: 'İsimleri yaz, sırayı gör', still: 'score' },
];

const PITCH = [
  [18, 28],
  [38, 22],
  [62, 22],
  [82, 28],
  [30, 48],
  [50, 42],
  [70, 48],
  [40, 70],
  [60, 70],
  [50, 86],
];

function Still({ kind }) {
  if (kind === 'pitch') {
    return (
      <div className="tools-still tools-pitch" aria-hidden>
        {PITCH.map(([x, y]) => (
          <i key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>
    );
  }

  if (kind === 'dice') {
    const five = [1, 0, 1, 0, 1, 0, 1, 0, 1];
    const two = [1, 0, 0, 0, 0, 0, 0, 0, 1];
    return (
      <div className="tools-still tools-dice" aria-hidden>
        <b className="tools-die">
          {five.map((on, i) => (
            <i key={i} className={on ? '' : 'is-off'} />
          ))}
        </b>
        <b className="tools-die tools-die--tilt">
          {two.map((on, i) => (
            <i key={i} className={on ? '' : 'is-off'} />
          ))}
        </b>
      </div>
    );
  }

  if (kind === 'wheel') {
    return (
      <div className="tools-still tools-wheel" aria-hidden>
        <b />
        <i />
      </div>
    );
  }

  if (kind === 'draw') {
    return (
      <div className="tools-still tools-draw" aria-hidden>
        <span>Ayşe</span>
        <span className="is-pick">Veli</span>
        <span>Ali</span>
      </div>
    );
  }

  if (kind === 'score') {
    return (
      <ul className="tools-still tools-score" aria-hidden>
        <li>
          Ali <b>42</b>
        </li>
        <li>
          Veli <b>37</b>
        </li>
        <li>
          Ayşe <b>29</b>
        </li>
      </ul>
    );
  }

  return (
    <div className="tools-still tools-split" aria-hidden>
      <b>
        <i />
        <i />
        <i />
      </b>
      <b>
        <i />
        <i />
        <i />
      </b>
    </div>
  );
}

function Shot({ tool, spec, eager }) {
  return (
    <Link to={tool.link} className="tools-shot">
      <span className="tools-shot-visual">
        {spec.photo ? (
          <img
            src={spec.photo}
            alt=""
            width="640"
            height="400"
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
          />
        ) : (
          <Still kind={spec.still} />
        )}
      </span>
      <span className="tools-shot-copy">
        <strong>{tool.title}</strong>
        <span>{spec.job}</span>
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
            <Shot key={spec.id} tool={byId[spec.id]} spec={spec} eager={index === 0} />
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
