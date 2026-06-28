import { Share2, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { SITE_CONFIG, SHARE_URLS } from '../../constants/seo';

function NewsShareBar({ title, url, layout = 'inline' }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${SITE_CONFIG.url}${url}`;

  const shareLinks = [
    { label: 'WhatsApp', href: SHARE_URLS.whatsapp(fullUrl, title), icon: '💬' },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, icon: '𝕏' },
    { label: 'Facebook', href: SHARE_URLS.facebook(fullUrl), icon: 'f' },
    { label: 'Telegram', href: SHARE_URLS.telegram(fullUrl, title), icon: '✈' },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url: fullUrl });
    } catch {
      /* cancelled */
    }
  };

  return (
    <aside className={`news-share ${layout === 'sticky' ? 'news-share-sticky' : ''}`} aria-label="Paylaş">
      <p className="news-share-label">
        <Share2 size={15} aria-hidden />
        Paylaş
      </p>

      {layout === 'sticky' ? (
        <div className="news-share-stack">
          {typeof navigator !== 'undefined' && navigator.share && (
            <button type="button" onClick={nativeShare} className="news-share-icon-btn news-share-icon-primary" title="Paylaş">
              <Share2 size={18} />
            </button>
          )}
          {shareLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="news-share-icon-btn"
              title={label}
            >
              <span aria-hidden>{icon}</span>
            </a>
          ))}
          <button type="button" onClick={copyLink} className="news-share-icon-btn" title="Linki kopyala">
            {copied ? <Check size={18} /> : <Link2 size={18} />}
          </button>
        </div>
      ) : (
        <div className="news-share-row">
          {typeof navigator !== 'undefined' && navigator.share && (
            <button type="button" onClick={nativeShare} className="news-share-pill news-share-pill-primary">
              Paylaş
            </button>
          )}
          {shareLinks.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="news-share-pill">
              {label}
            </a>
          ))}
          <button type="button" onClick={copyLink} className="news-share-pill">
            {copied ? 'Kopyalandı' : 'Link'}
          </button>
        </div>
      )}
    </aside>
  );
}

export default NewsShareBar;
