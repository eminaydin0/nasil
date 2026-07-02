import { useCallback, useMemo, useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  buildShareLinks,
  copyShareLink,
  nativeShareContent,
  openShareWindow,
  SHARE_PLATFORMS,
} from '../../lib/share';
import { SharePlatformIcon } from './ShareIcons';

const PLATFORM_STYLE = {
  whatsapp: 'share-btn--whatsapp',
  x: 'share-btn--x',
  facebook: 'share-btn--facebook',
  telegram: 'share-btn--telegram',
  linkedin: 'share-btn--linkedin',
};

function ShareBar({
  title,
  url,
  description = '',
  layout = 'inline',
  hashtags = [],
  platforms = ['whatsapp', 'x', 'facebook', 'telegram'],
  onShare,
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const links = useMemo(
    () => buildShareLinks({ title, description, url, hashtags }),
    [title, description, url, hashtags]
  );

  const canNativeShare = typeof navigator !== 'undefined' && navigator.share;
  const isSticky = layout === 'sticky';
  const isDropdown = layout === 'dropdown';

  const handlePlatformShare = useCallback(
    (platformId) => {
      const href = links[platformId];
      if (!href) return;

      if (platformId === 'whatsapp') {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        openShareWindow(href);
      }

      onShare?.(platformId);
      setOpen(false);
    },
    [links, onShare]
  );

  const handleCopy = useCallback(async () => {
    try {
      await copyShareLink(url);
      setCopied(true);
      onShare?.('copy_link');
      toast.success('Link kopyalandı', { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
      setOpen(false);
    } catch {
      toast.error('Link kopyalanamadı');
    }
  }, [url, onShare]);

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) {
      setOpen((v) => !v);
      return;
    }

    try {
      const shared = await nativeShareContent({ title, description, url });
      if (shared) {
        onShare?.('native');
        setOpen(false);
      } else {
        setOpen(true);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setOpen(true);
      }
    }
  }, [canNativeShare, title, description, url, onShare]);

  const platformButtons = platforms.map((id) => {
    const meta = SHARE_PLATFORMS.find((p) => p.id === id) || { id, label: id };

    if (isSticky) {
      return (
        <button
          key={id}
          type="button"
          onClick={() => handlePlatformShare(id)}
          className={`share-btn share-btn--icon ${PLATFORM_STYLE[id] || ''}`}
          title={meta.label}
          aria-label={`${meta.label} ile paylaş`}
        >
          <SharePlatformIcon platform={id} size={17} />
        </button>
      );
    }

    return (
      <button
        key={id}
        type="button"
        onClick={() => handlePlatformShare(id)}
        className={`share-btn share-btn--pill ${PLATFORM_STYLE[id] || ''}`}
        aria-label={`${meta.label} ile paylaş`}
      >
        <SharePlatformIcon platform={id} size={15} />
        <span>{meta.label}</span>
      </button>
    );
  });

  const copyButton = (
    <button
      type="button"
      onClick={handleCopy}
      className={`share-btn ${isSticky ? 'share-btn--icon share-btn--copy' : 'share-btn--pill share-btn--copy'}`}
      title="Linki kopyala"
      aria-label="Linki kopyala"
    >
      {copied ? <Check size={16} /> : <Link2 size={16} />}
      {!isSticky && <span>{copied ? 'Kopyalandı' : 'Link'}</span>}
    </button>
  );

  if (isDropdown) {
    return (
      <div className={`share-bar share-bar--dropdown relative ${className}`}>
        <button
          type="button"
          onClick={canNativeShare ? handleNativeShare : () => setOpen((v) => !v)}
          className="share-trigger-btn"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Share2 size={18} aria-hidden />
          <span className="hidden sm:inline">Paylaş</span>
        </button>

        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default bg-transparent"
              aria-label="Menüyü kapat"
              onClick={() => setOpen(false)}
            />
            <div className="share-dropdown-panel">
              <p className="share-dropdown-title">Paylaş</p>
              <div className="share-dropdown-list">
                {canNativeShare && (
                  <button type="button" onClick={handleNativeShare} className="share-dropdown-item">
                    <span className="share-btn share-btn--icon share-btn--native">
                      <Share2 size={16} />
                    </span>
                    <span>Cihazda paylaş</span>
                  </button>
                )}
                {platforms.map((id) => {
                  const meta = SHARE_PLATFORMS.find((p) => p.id === id) || { label: id };
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handlePlatformShare(id)}
                      className="share-dropdown-item"
                    >
                      <span className={`share-btn share-btn--icon ${PLATFORM_STYLE[id] || ''}`}>
                        <SharePlatformIcon platform={id} size={16} />
                      </span>
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
                <button type="button" onClick={handleCopy} className="share-dropdown-item">
                  <span className="share-btn share-btn--icon share-btn--copy">
                    {copied ? <Check size={16} /> : <Link2 size={16} />}
                  </span>
                  <span>{copied ? 'Kopyalandı!' : 'Linki kopyala'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <aside
      className={`share-bar ${isSticky ? 'share-bar--sticky' : 'share-bar--inline'} ${className}`}
      aria-label="Paylaş"
    >
      <p className="share-bar-label">
        <Share2 size={14} aria-hidden />
        Paylaş
      </p>

      <div className={isSticky ? 'share-bar-stack' : 'share-bar-row'}>
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className={`share-btn ${isSticky ? 'share-btn--icon share-btn--native' : 'share-btn--pill share-btn--native'}`}
            title="Paylaş"
          >
            <Share2 size={16} />
            {!isSticky && <span>Paylaş</span>}
          </button>
        )}
        {platformButtons}
        {copyButton}
      </div>
    </aside>
  );
}

export default ShareBar;
