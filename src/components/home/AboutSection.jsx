import { Award, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AboutSection() {
  const [culturalContent, setCulturalContent] = useState({
    title: 'Kültürel Mirasımız',
    subtitle: 'Geleneksel Oyunlarımızı Yaşatıyoruz',
    content: 'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.\n\nTeknolojinin hızla geliştiği günümüzde, bu geleneksel oyunları dijital ortamda belgeleyerek gelecek nesillere aktarmak ve yaşatmak istiyoruz.'
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_key', 'cultural_heritage')
        .single();

      if (!error && data) {
        setCulturalContent({
          title: data.title,
          subtitle: data.subtitle,
          content: data.content
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  return (
    <section id="hakkinda" className="relative">
      <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl p-8 md:p-12 lg:p-16 border border-orange-100/50 relative overflow-hidden">
        {/* Dekoratif şekiller */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Sol - İçerik */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200 text-orange-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Award size={16} />
              {culturalContent.title}
            </div>
            
            {/* Başlık */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {culturalContent.subtitle}
            </h2>
            
            {/* İçerik */}
            <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed">
              {culturalContent.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="mt-8">
              <Link
                to="/hakkimizda"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 group"
              >
                <span>Daha Fazla Bilgi</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Sağ - Görsel */}
          <div className="relative">
            {/* Ana görsel */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/20 group">
              <img 
                src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop" 
                alt="Traditional Games" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900">500+</p>
                  <p className="text-gray-500 text-xs">Aktif Kullanıcı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
