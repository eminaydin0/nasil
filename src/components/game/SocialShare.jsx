import { Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { trackShare } from '../../utils/analytics';

function SocialShare({ game }) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  const url = `https://nasiloynanir.com/oyun/${game.slug}`;
  const title = `${game.name} Kuralı Ne?`;
  const description = game.shortDescription;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast.success('Link kopyalandı!', {
        icon: '🔗',
        duration: 2000,
      });
      
      // Track copy action
      trackShare('copy_link', game.name, game.id);
      
      // Increment total shares
      const currentShares = parseInt(localStorage.getItem('total_shares') || '0');
      localStorage.setItem('total_shares', (currentShares + 1).toString());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    
    // Track share event
    trackShare(platform, game.name, game.id);
    
    // Increment total shares counter
    const currentShares = parseInt(localStorage.getItem('total_shares') || '0');
    localStorage.setItem('total_shares', (currentShares + 1).toString());
  };

  // Native share API for mobile
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowShare(!showShare);
    }
  };

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
      >
        <Share2 size={18} />
        <span>Paylaş</span>
      </button>

      {/* Share Options Dropdown */}
      {showShare && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowShare(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-warm-100 p-3 z-50 min-w-[240px]">
            <p className="text-xs font-semibold text-warm-700 mb-3 px-2">Paylaşım Seçenekleri</p>
            
            <div className="space-y-1">
              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageCircle size={18} />
                </div>
                <span className="text-sm font-medium text-warm-700">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Facebook size={18} />
                </div>
                <span className="text-sm font-medium text-warm-700">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sky-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Twitter size={18} />
                </div>
                <span className="text-sm font-medium text-warm-700">Twitter (X)</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-warm-700 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                </div>
                <span className="text-sm font-medium text-warm-700">
                  {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SocialShare;
