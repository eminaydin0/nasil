import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft as ChevronBack, Eye, Image as ImageIcon, ChevronLeft, ChevronRight, X, ZoomIn, Wrench, ArrowUpRight } from 'lucide-react';
import SocialShare from './SocialShare';
import { Badge } from '../ui';
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const scrollThumbnail = (direction) => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({ left: direction * 130, behavior: 'smooth' });
    }
  };

  const relatedTool = getToolForGame(game);

  return (
    <div className="bg-cream-50 border-b border-warm-200/60">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-14">
        {/* Geri - minimal */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-warm-500 hover:text-orange-600 mb-6 transition-colors group text-sm font-medium"
        >
          <ChevronBack size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
          <span>Geri</span>
        </button>

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-12">
          {/* Galeri */}
          <div className="lg:col-span-3 space-y-3">
            <div
              className="relative aspect-[16/10] w-full bg-warm-100 rounded-3xl overflow-hidden group cursor-pointer shadow-soft-md hover:shadow-soft-xl transition-all duration-500 ease-spring border border-warm-200/70"
              onClick={() => allImages.length > 0 && openLightbox(currentIndex)}
            >
              <img
                src={currentImage}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                width="1000"
                height="625"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 backdrop-blur-sm text-warm-800 text-xs font-semibold shadow-soft">
                  <ZoomIn size={14} />
                  Büyüt
                </span>
              </div>
              {allImages.length > 1 && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-full bg-charcoal-900/75 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1.5">
                  <ImageIcon size={12} />
                  <span>{currentIndex + 1} / {allImages.length}</span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="relative group/thumb">
                {allImages.length > 5 && (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollThumbnail(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-soft-md border border-warm-200 flex items-center justify-center text-warm-600 hover:text-orange-600 hover:border-orange-300 transition-all -translate-x-0.5"
                      aria-label="Önceki fotoğraflar"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollThumbnail(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-soft-md border border-warm-200 flex items-center justify-center text-warm-600 hover:text-orange-600 hover:border-orange-300 transition-all translate-x-0.5"
                      aria-label="Sonraki fotoğraflar"
                    >
                      <ChevronRight size={18} />
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
                        className={`flex-shrink-0 w-[88px] h-[66px] rounded-xl overflow-hidden border-2 transition-all duration-300 ease-spring ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-200 shadow-warm-glow scale-[1.03]'
                            : 'border-warm-200 hover:border-orange-300 opacity-90 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${game.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          width="88"
                          height="66"
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

          {/* Içerik */}
          <div className="lg:col-span-2 flex flex-col justify-center min-w-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                <Badge variant="brand" size="md" className="uppercase tracking-wider">
                  {game.category}
                </Badge>
                <span className="inline-flex items-center text-xs font-medium text-warm-500">
                  <Eye size={13} className="mr-1.5 shrink-0" />
                  {viewCount.toLocaleString('tr-TR')} görüntülenme
                </span>
              </div>
              <div className="shrink-0 self-start sm:self-auto">
                <SocialShare game={game} />
              </div>
            </div>
            <h1 className="mb-3 text-2xl font-extrabold leading-[1.08] tracking-tight text-warm-900 sm:text-3xl md:text-4xl lg:text-5xl">
              {game.name}{' '}
              <span className="text-orange-600">Kuralı Ne?</span>
            </h1>
            <p className="text-warm-600 text-base md:text-lg leading-relaxed">
              {game.shortDescription}
            </p>

            {relatedTool && (
              <button
                type="button"
                onClick={() => navigate(relatedTool.link)}
                className="mt-7 group w-full text-left"
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-100 via-orange-50 to-cream-100 border border-orange-200/60 hover:border-orange-300 transition-all duration-500 ease-spring shadow-soft hover:shadow-warm-glow hover:-translate-y-0.5">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-warm-glow transition-transform duration-500 ease-spring group-hover:-rotate-3 group-hover:scale-105">
                    <Wrench size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-warm-900 group-hover:text-orange-700 transition-colors tracking-tight truncate">
                      {relatedTool.label}
                    </div>
                    <div className="text-sm text-warm-500 group-hover:text-orange-600 transition-colors">
                      Bu oyun için özel araç
                    </div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 group-hover:bg-orange-500 text-orange-600 group-hover:text-white transition-all duration-300 shadow-soft">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal-950/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Fotoğraf galerisi"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Kapat"
          >
            <X size={22} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Önceki"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Sonraki"
              >
                <ChevronRight size={26} />
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
              loading="eager"
              decoding="async"
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
