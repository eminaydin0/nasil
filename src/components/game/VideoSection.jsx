import { useMemo } from 'react';
import { PlayCircle } from 'lucide-react';

/**
 * YouTube veya Vimeo URL'sinden embed URL'si uretir.
 * Desteklenen formatlar:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://vimeo.com/VIDEO_ID
 */
function toEmbedUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();

  // YouTube: youtube.com/watch?v=...
  const ytWatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/);
  if (ytWatch) {
    return `https://www.youtube-nocookie.com/embed/${ytWatch[1]}`;
  }

  // YouTube: youtu.be/...
  const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (ytShort) {
    return `https://www.youtube-nocookie.com/embed/${ytShort[1]}`;
  }

  // YouTube: zaten embed
  const ytEmbed = url.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (ytEmbed) {
    return `https://www.youtube-nocookie.com/embed/${ytEmbed[1]}`;
  }

  // Vimeo: vimeo.com/123456
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  return null;
}

export default function VideoSection({ game }) {
  const embedUrl = useMemo(() => toEmbedUrl(game?.videoUrl), [game?.videoUrl]);

  if (!embedUrl) return null;

  const title = game.videoTitle || `${game.name} Kuralı Ne? - Video Anlatım`;

  return (
    <section
      id="video-anlatim"
      aria-labelledby="video-anlatim-baslik"
      className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
          <PlayCircle className="text-white" size={22} />
        </div>
        <div>
          <h2 id="video-anlatim-baslik" className="text-lg font-bold text-gray-900">
            Video Anlatım
          </h2>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl bg-gray-900" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
