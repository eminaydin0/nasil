import { Link } from 'react-router-dom';
import { TOOL_LANDING } from '../../constants/toolLandingCopy';

/**
 * Araç sayfası altı indexlenebilir SEO makalesi + FAQ verisi.
 */
export function getToolLanding(slug) {
  return TOOL_LANDING[slug] || null;
}

export function ToolSeoArticle({ slug }) {
  const data = getToolLanding(slug);
  if (!data) return null;

  return (
    <>
      <h2>{data.h2}</h2>
      <p>{data.intro}</p>
      {data.bullets?.length ? (
        <>
          <h3>Öne çıkanlar</h3>
          <ul>
            {data.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </>
      ) : null}
      {data.steps?.length ? (
        <>
          <h3>Nasıl kullanılır?</h3>
          <ol className="list-decimal space-y-1 pl-5">
            {data.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </>
      ) : null}
      {data.related?.length ? (
        <p>
          İlgili:{' '}
          {data.related.map((r, i) => (
            <span key={r.to}>
              {i > 0 ? ' · ' : null}
              <Link to={r.to}>{r.label}</Link>
            </span>
          ))}
        </p>
      ) : null}
    </>
  );
}
