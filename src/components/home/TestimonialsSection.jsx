import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('id, name');
      
      if (gamesError) throw gamesError;
      
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('is_testimonial', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (commentsError) throw commentsError;
      
      const formattedTestimonials = (commentsData || []).map(comment => {
        const game = gamesData.find(g => g.id === comment.game_id);
        return {
          name: comment.author_name,
          comment: comment.content,
          rating: comment.rating,
          gameName: game?.name || 'Bilinmeyen Oyun',
          avatarUrl: comment.avatar_url
        };
      });
      
      setTestimonials(formattedTestimonials);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials([]);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Oyuncu Yorumları</h2>
        <p className="text-gray-600">
          Platformumuzu kullanan oyun severlerin deneyimleri
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < testimonial.rating ? 'fill-yellow-400' : 'fill-gray-200 text-gray-200'}
                />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mb-6 min-h-[80px]">"{testimonial.comment}"</p>
            <div className="flex items-center space-x-3 pt-6 border-t border-gray-50">
              <div className="shrink-0 w-10 h-10">
                {testimonial.avatarUrl ? (
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-gray-100">
                    {getInitials(testimonial.name)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.gameName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
