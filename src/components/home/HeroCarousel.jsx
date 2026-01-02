import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="h-[500px] w-full bg-gray-900 rounded-3xl shadow-2xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-gray-900 rounded-3xl shadow-2xl group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10 visible' : 'opacity-0 z-0 invisible'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image_url}
              alt={slide.title}
              className={`w-full h-full object-cover opacity-40 transition-transform duration-[2000ms] ${
                index === currentIndex ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="h-full flex items-center relative z-20 px-8 md:px-16">
            <div className={`max-w-3xl transition-all duration-700 delay-300 ${
              index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full mb-4">
                {slide.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg text-gray-200 mb-6 leading-relaxed max-w-2xl">
                {slide.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href={slide.button_link}
                  className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm md:text-base"
                >
                  {slide.button_text}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors border border-white/10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors border border-white/10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
