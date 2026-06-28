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
    const codeMatch = remaining.match(/`([^`]+)`/);
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)|_([^_]+)_/);

    const candidates = [
      linkMatch && { match: linkMatch, type: 'link', idx: remaining.indexOf(linkMatch[0]) },
      boldMatch && { match: boldMatch, type: 'bold', idx: remaining.indexOf(boldMatch[0]) },
      codeMatch && { match: codeMatch, type: 'code', idx: remaining.indexOf(codeMatch[0]) },
      italicMatch && {
        match: italicMatch,
        type: 'italic',
        idx: remaining.indexOf(italicMatch[0]),
      },
    ].filter(Boolean);

    candidates.sort((a, b) => a.idx - b.idx);
    const next = candidates.find((c) => c.idx >= 0);

    if (!next) {
      parts.push(remaining);
      break;
    }

    const { match, type, idx } = next;
    if (idx > 0) parts.push(remaining.slice(0, idx));

    if (type === 'link') {
      const [, label, href] = match;
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
    } else if (type === 'bold') {
      parts.push(
        <strong key={key++} className="font-bold text-warm-900">
          {match[1]}
        </strong>
      );
    } else if (type === 'code') {
      parts.push(
        <code key={key++} className="news-prose-code">
          {match[1]}
        </code>
      );
    } else {
      parts.push(
        <em key={key++} className="italic text-warm-800">
          {match[1] || match[2]}
        </em>
      );
    }

    remaining = remaining.slice(idx + match[0].length);
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

        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={i} className="news-prose-hr" />;
        }

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

        const lines = trimmed.split('\n').filter(Boolean);
        if (lines.length > 0 && lines.every((l) => /^[-*]\s/.test(l.trim()))) {
          return (
            <ul key={i} className="news-prose-ul">
              {lines.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        if (lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
          return (
            <ol key={i} className="news-prose-ol">
              {lines.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^\d+\.\s+/, ''))}</li>
              ))}
            </ol>
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
