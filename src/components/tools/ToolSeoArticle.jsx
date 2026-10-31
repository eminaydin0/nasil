import { Link } from 'react-router-dom';
import { TOOL_LANDING } from '../../constants/toolLandingCopy';

export function getToolLanding(slug) {
  return TOOL_LANDING[slug] || null;
}

export function toolHowToWordCount(data) {
  if (!data) return 0;
  const parts = [...(data.paragraphs || []), ...(data.steps || [])];
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

export function ToolSeoArticle({ slug }) {
  const data = getToolLanding(slug);
  if (!data) return null;

  return (
    <>
      <h2>{data.h2 || 'Nasıl kullanılır?'}</h2>
      {data.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      {data.steps?.length ? (
        <ol className="list-decimal space-y-1 pl-5">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      {data.related?.length ? (
        <p>
          İlgili rehberler:{' '}
          {data.related.map((item, index) => (
            <span key={item.to}>
              {index > 0 ? ' · ' : null}
              <Link to={item.to}>{item.label}</Link>
            </span>
          ))}
        </p>
      ) : null}
    </>
  );
}
