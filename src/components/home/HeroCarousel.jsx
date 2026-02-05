import { useState, useEffect } from 'react';
import { Play, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length === 0 || isRolling) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isRolling]);

  if (loading) {
    return (
      <div className="h-[500px] md:h-[600px] w-full max-w-[1400px] mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-3xl group bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl shadow-gray-900/50">
        
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out ${
              index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
            </div>

            {/* Dekoratif şekiller */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-end p-8 md:p-12 lg:p-16">
              <div className={`max-w-2xl transition-all duration-700 delay-200 ${
                index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {/* Badge */}
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
                    <Sparkles size={16} className="text-white" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">
                      {slide.badge}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                  {slide.title}
                </h2>

                {/* Description */}
                <p className="text-gray-200 text-base md:text-lg lg:text-xl mb-8 leading-relaxed max-w-xl">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={slide.button_link}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                  >
                    <Play size={20} fill="currentColor" />
                    <span>{slide.button_text || 'Keşfet'}</span>
                  </a>
                  
                  <button className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold transition-all duration-300">
                    <TrendingUp size={20} />
                    <span>Popüler</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-8 right-8 md:right-12 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsRolling(true);
                setTimeout(() => setIsRolling(false), 2000);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-orange-500 to-red-500'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Side thumbnails - Desktop only */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsRolling(true);
                  setTimeout(() => setIsRolling(false), 2000);
                }}
                className={`group relative w-20 h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'ring-4 ring-orange-500 scale-110'
                    : 'ring-2 ring-white/20 hover:ring-white/40 hover:scale-105'
                }`}
              >
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors"></div>
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;