import ShareBar from '../common/ShareBar';
import { trackShare } from '../../utils/analytics';

function NewsShareBar({ title, url, description = '', layout = 'inline' }) {
  const handleShare = (platform) => {
    trackShare(platform, title, url);
  };

  return (
    <ShareBar
      title={title}
      url={url}
      description={description}
      layout={layout}
      hashtags={['KuraliNe', 'OyunHaberleri']}
      onShare={handleShare}
    />
  );
}

export default NewsShareBar;
