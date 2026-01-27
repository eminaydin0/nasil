import { Award } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    <section id="hakkinda" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
            <Award size={18} />
            {culturalContent.title}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {culturalContent.subtitle}
          </h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            {culturalContent.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                  User
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900">500+ Oyuncu</p>
              <p className="text-gray-500">Topluluğumuza katılın</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop" 
              alt="Traditional Games" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
