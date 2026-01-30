import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Image as ImageIcon, ChevronLeft, ChevronRight, X, ZoomIn, Wrench } from 'lucide-react';
import SocialShare from './SocialShare';
import { getToolForGame } from '../../constants/gameTools';

export default function GameHeader({ game, viewCount, selectedImage, setSelectedImage }) {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbnailScrollRef = useRef(null);

  const allImages = [game.image, ...(game.gallery || [])];
  const currentImage = selectedImage || game.image;
  const currentIndex = allImages.indexOf(currentImage) >= 0 ? allImages.indexOf(currentImage) : 0;

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    const prev = lightboxIndex <= 0 ? allImages.length - 1 : lightboxIndex - 1;
    setLightboxIndex(prev);
  };

  const goToNext = () => {
    const next = lightboxIndex >= allImages.length - 1 ? 0 : lightboxIndex + 1;
    setLightboxIndex(next);
  };

  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  const scrollThumbnail = (direction) => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({ left: direction * 130, behavior: 'smooth' });
    }
  };

  const relatedTool = getToolForGame(game);

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-4 transition-colors group text-sm"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Geri Dön</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Image & Gallery */}
          <div className="md:col-span-1 space-y-4">
            {/* Ana Resim - Büyük ve şık */}
            <div
              className="relative aspect-[4/3] w-full bg-gray-100 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              onClick={() => allImages.length > 0 && openLightbox(currentIndex)}
            >
              <img
                src={currentImage}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop';
                }}
              />
              {/* Hover overlay - zoom ikonu */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <ZoomIn className="text-gray-800" size={26} />
                </div>
              </div>
              {/* Fotoğraf sayacı badge */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  <span>{currentIndex + 1} / {allImages.length}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip - Yatay kaydırılabilir, çok fotoğraf için */}
            {allImages.length > 1 && (
              <div className="relative group/thumb">
                {allImages.length > 4 && (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollThumbnail(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-all -translate-x-0.5"
                      aria-label="Önceki fotoğraflar"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollThumbnail(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-all translate-x-0.5"
                      aria-label="Sonraki fotoğraflar"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                <div
                  ref={thumbnailScrollRef}
                  className="flex gap-2 overflow-x-auto pb-1 -mx-1 scroll-smooth scrollbar-hide"
                >
                  {allImages.map((img, index) => {
                    const isSelected = (index === 0 && !selectedImage) || selectedImage === img;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index === 0 ? null : img)}
                        className={`flex-shrink-0 w-[88px] h-[66px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-200 shadow-md scale-[1.03]'
                            : 'border-gray-200 hover:border-orange-300 opacity-90 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${game.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=200&auto=format&fit=crop';
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg">
                  {game.category}
                </span>
                <span className="flex items-center text-gray-500 text-xs">
                  <Eye size={14} className="mr-1" />
                  {viewCount.toLocaleString('tr-TR')} görüntülenme
                </span>
              </div>
              <SocialShare game={game} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
            <p className="text-gray-600 text-sm leading-relaxed">{game.shortDescription}</p>
            {relatedTool && (
              <button
                type="button"
                onClick={() => navigate(relatedTool.link)}
                className="mt-5 group w-full sm:w-auto"
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200/60 hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-200/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:bg-orange-600 transition-transform duration-300">
                    <Wrench size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900 group-hover:text-orange-700 transition-colors">{relatedTool.label}</div>
                    <div className="text-sm text-gray-500 group-hover:text-orange-600/80">Bu oyun için özel araç →</div>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/80 group-hover:bg-orange-500 flex items-center justify-center text-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ArrowLeft size={20} className="rotate-180" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox - Tam ekran fotoğraf görüntüleyici */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Fotoğraf galerisi"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Kapat"
          >
            <X size={24} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Önceki"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Sonraki"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full px-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[lightboxIndex]}
              alt={`${game.name} - Fotoğraf ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
