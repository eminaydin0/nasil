import { useState, useEffect } from 'react';
import { Star, Quote, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SectionHeader from '../common/SectionHeader';

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
    <section>
      <SectionHeader
        title="Kullanıcı Yorumları"
        subtitle="Ne dediler?"
        icon={MessageCircle}
        iconColor="text-pink-500"
        iconBg="bg-pink-50"
        centered={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-stretch">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
          >
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Quote size={40} className="text-orange-500" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                />
              ))}
            </div>

            {/* Comment - Esnek alan, alttaki boşluğu doldurur */}
            <p className="text-gray-600 leading-relaxed flex-1 min-h-0 line-clamp-4">
              "{testimonial.comment}"
            </p>

            {/* Author - Alta sabit */}
            <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100 shrink-0">
              <div className="shrink-0 w-11 h-11">
                {testimonial.avatarUrl ? (
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="w-full h-full rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-orange-100">
                    {getInitials(testimonial.name)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.gameName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
