import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MessagesSquare, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SectionHeader } from '../ui';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('id, name, slug');

      if (gamesError) throw gamesError;

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('is_testimonial', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (commentsError) throw commentsError;

      const formatted = (commentsData || []).map((c) => {
        const game = gamesData.find((g) => g.id === c.game_id);
        return {
          name: c.author_name,
          comment: c.content,
          rating: c.rating,
          gameName: game?.name || 'Bilinmeyen Oyun',
          gameSlug: game?.slug,
          avatarUrl: c.avatar_url,
        };
      });

      setTestimonials(formatted);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section>
      <SectionHeader
        title="Kullanıcı Yorumları"
        subtitle="Topluluk diyor ki"
        icon={MessageCircle}
        iconColor="text-rose-500"
        iconBg="bg-rose-50"
        link="/oyunlar"
        linkText="Oyunları Keşfet"
      />

      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-stretch">
          {testimonials.map((t, index) => (
            <TestimonialCard key={index} {...t} />
          ))}
        </div>
      ) : (
        // Boş state - "İlk yorumu sen yap" CTA
        <div className="relative overflow-hidden rounded-3xl border border-warm-200/70 bg-gradient-to-br from-cream-100 via-white to-orange-50 p-10 md:p-14 text-center shadow-soft">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-soft mb-5">
              <MessagesSquare className="w-6 h-6 text-orange-600" aria-hidden="true" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-warm-900 mb-3 tracking-tight">
              İlk yorumu sen yap
            </h3>
            <p className="text-warm-600 leading-relaxed mb-7 max-w-sm mx-auto">
              Bir oyun aç, kuralları oku ve deneyimini paylaş. Yorumun burada öne çıkar.
            </p>
            <Link
              to="/oyunlar"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 ease-spring shadow-warm-glow hover:shadow-warm-glow-lg hover:-translate-y-0.5"
            >
              <span>Oyunlara Göz At</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
