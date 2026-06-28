import {
  Download,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import {
  isDigitalGameCategory,
  normalizeDigitalInfo,
  hasDigitalInfoContent,
  getActiveDownloads,
} from '../../constants/digitalGames';

function SpecRow({ label, value }) {
  if (!value?.trim()) return null;
  return (
    <div className="digital-spec-row">
      <dt className="digital-spec-label">{label}</dt>
      <dd className="digital-spec-value">{value}</dd>
    </div>
  );
}

function RequirementsBlock({ title, tier, accent }) {
  const hasAny = Object.values(tier || {}).some((v) => String(v).trim());
  if (!hasAny) return null;

  return (
    <div className={`digital-req-block ${accent}`}>
      <h3 className="digital-req-title">{title}</h3>
      <dl className="digital-spec-list">
        <SpecRow label="İşletim sistemi" value={tier.os} />
        <SpecRow label="İşlemci" value={tier.cpu} />
        <SpecRow label="RAM" value={tier.ram} />
        <SpecRow label="Ekran kartı" value={tier.gpu} />
        <SpecRow label="Depolama" value={tier.storage} />
        {tier.notes?.trim() && (
          <div className="digital-spec-notes">
            <p>{tier.notes}</p>
          </div>
        )}
      </dl>
    </div>
  );
}

function GameDigitalSection({ game }) {
  if (!isDigitalGameCategory(game?.category)) return null;

  const info = normalizeDigitalInfo(game.digitalInfo);
  if (!hasDigitalInfoContent(info)) return null;

  const { minimum, recommended } = info.requirements;
  const downloads = getActiveDownloads(info);

  return (
    <section className="digital-game-section" aria-labelledby="digital-game-title">
      <header className="digital-game-header">
        <span className="digital-game-icon" aria-hidden>
          <Monitor size={20} />
        </span>
        <div>
          <h2 id="digital-game-title" className="digital-game-title">
            İndirme & Sistem Gereksinimleri
          </h2>
          <p className="digital-game-subtitle">
            Dosya boyutu, platform ve donanım ihtiyaçları
          </p>
        </div>
      </header>

      <div className="digital-game-meta-grid">
        {info.platforms.length > 0 && (
          <div className="digital-meta-card">
            <Smartphone size={18} className="text-cyan-600" aria-hidden />
            <div>
              <p className="digital-meta-label">Platform</p>
              <div className="digital-platform-chips">
                {info.platforms.map((p) => (
                  <span key={p} className="digital-platform-chip">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {info.fileSize?.trim() && (
          <div className="digital-meta-card">
            <HardDrive size={18} className="text-orange-600" aria-hidden />
            <div>
              <p className="digital-meta-label">Dosya boyutu</p>
              <p className="digital-meta-value">{info.fileSize}</p>
            </div>
          </div>
        )}

        {downloads.length > 0 && (
          <div className="digital-meta-card digital-meta-card-wide">
            <Download size={18} className="text-emerald-600" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="digital-meta-label">Nereden indirilir?</p>
              <div className="digital-download-list">
                {downloads.map((item) => (
                  <a
                    key={`${item.label}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="digital-download-btn"
                  >
                    {item.label || 'İndir'}
                    <ExternalLink size={15} aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {(minimum || recommended) && (
        <div className="digital-req-grid">
          <RequirementsBlock title="Minimum gereksinimler" tier={minimum} accent="digital-req-min" />
          <RequirementsBlock title="Önerilen gereksinimler" tier={recommended} accent="digital-req-rec" />
        </div>
      )}

      <div className="digital-spec-legend">
        <Cpu size={14} aria-hidden />
        <MemoryStick size={14} aria-hidden />
        <Monitor size={14} aria-hidden />
        <span>Gereksinimler oyun geliştiricisinin önerdiği değerlerdir; güncellenebilir.</span>
      </div>
    </section>
  );
}

export default GameDigitalSection;
