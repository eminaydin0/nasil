import { extractHeadings } from '../../utils/newsContent';

function slugifyHeading(text, index) {
  return `section-${index}-${text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')}`;
}

function renderInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    const linkIdx = linkMatch ? remaining.indexOf(linkMatch[0]) : -1;
    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;

    let nextMatch = null;
    let type = null;

    if (linkIdx >= 0 && (boldIdx < 0 || linkIdx <= boldIdx)) {
      nextMatch = linkMatch;
      type = 'link';
    } else if (boldIdx >= 0) {
      nextMatch = boldMatch;
      type = 'bold';
    }

    if (!nextMatch) {
      parts.push(remaining);
      break;
    }

    const idx = remaining.indexOf(nextMatch[0]);
    if (idx > 0) parts.push(remaining.slice(0, idx));

    if (type === 'link') {
      const [, label, href] = nextMatch;
      const isExternal = href.startsWith('http');
      parts.push(
        <a
          key={key++}
          href={href}
          className="font-semibold text-orange-600 underline decoration-orange-300 underline-offset-2 hover:text-orange-700"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    } else {
      parts.push(
        <strong key={key++} className="font-bold text-warm-900">
          {nextMatch[1]}
        </strong>
      );
    }

    remaining = remaining.slice(idx + nextMatch[0].length);
  }

  return parts;
}

function NewsContent({ content }) {
  if (!content?.trim()) return null;

  const headings = extractHeadings(content);
  let headingIndex = 0;

  const blocks = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="news-prose">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
          const text = trimmed.slice(3).trim();
          const id = headings[headingIndex]?.id || slugifyHeading(text, headingIndex);
          headingIndex += 1;
          return (
            <h2 key={i} id={id} className="news-prose-h2 scroll-mt-28">
              {text}
            </h2>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="news-prose-h3">
              {trimmed.slice(4).trim()}
            </h3>
          );
        }

        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split('\n').map((l) => l.replace(/^>\s?/, ''));
          return (
            <blockquote key={i} className="news-prose-quote">
              {quoteLines.map((line, j) => (
                <p key={j}>{renderInline(line)}</p>
              ))}
            </blockquote>
          );
        }

        const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          const [, alt, src] = imageMatch;
          return (
            <figure key={i} className="news-prose-figure">
              <img src={src} alt={alt || ''} loading="lazy" className="news-prose-img" />
              {alt && <figcaption className="news-prose-caption">{alt}</figcaption>}
            </figure>
          );
        }

        if (/^[-*]\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter((l) => /^[-*]\s/.test(l.trim()));
          return (
            <ul key={i} className="news-prose-ul">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="news-prose-p">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default NewsContent;
