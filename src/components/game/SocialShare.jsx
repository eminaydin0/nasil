import ShareBar from '../common/ShareBar';
import { trackShare } from '../../utils/analytics';

function SocialShare({ game }) {
  const url = `/oyun/${game.slug}`;
  const title = `${game.name} Nasıl Oynanır? — Kuralı Ne?`;

  const handleShare = (platform) => {
    trackShare(platform, game.name, game.id);

    const currentShares = parseInt(localStorage.getItem('total_shares') || '0', 10);
    localStorage.setItem('total_shares', String(currentShares + 1));
  };

  return (
    <ShareBar
      title={title}
      url={url}
      description={game.shortDescription}
      layout="dropdown"
      hashtags={['KuraliNe', 'OyunKurallari']}
      platforms={['whatsapp', 'x', 'facebook', 'telegram']}
      onShare={handleShare}
    />
  );
}

export default SocialShare;
