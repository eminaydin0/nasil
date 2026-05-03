import { Sparkles, Compass, Wrench, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * NewsletterSection - "yakında" + topluluk yönlendirme.
 *
 * Eskiden sahte (setTimeout) bir e-posta abonelik formu vardı; backend
 * olmadığı için yanıltıcıydı. Yerine dürüst "Yakında" durumu + topluluğa
 * yönlendiren CTA'lar koyduk.
 */
export default function NewsletterSection() {
  const ctas = [
    {
      to: '/oyunlar',
      icon: Compass,
      title: 'Oyunları Keşfet',
      desc: '50+ geleneksel oyun rehberi sizi bekliyor',
    },
    {
      to: '/araclar',
      icon: Wrench,
      title: 'Oyun Araçları',
      desc: 'Yazboz, sayaç, zar atma ve daha fazlası',
    },
    {
      to: '/hakkimizda',
      icon: MessagesSquare,
      title: 'Bize Ulaş',
      desc: 'Geri bildirimini paylaş, yenilikleri takip et',
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600" />

      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-300/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/95 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} />
            <span>Yakında — bülten</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
            Topluluğa katıl,{' '}
            <span className="bg-gradient-to-r from-amber-200 to-cream-100 bg-clip-text text-transparent">
              ilk sen oku
            </span>
          </h2>

          <p className="text-cream-100/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            E-posta bültenimiz hazırlanıyor. O zamana kadar yeni oyunları, araçları ve içerikleri keşfetmek için aşağıdaki bağlantıları kullanabilirsin.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {ctas.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to}
                to={c.to}
                className="group relative bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/40 text-white rounded-2xl p-5 transition-all duration-500 ease-spring hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 bg-white/15 rounded-xl mb-4 transition-transform duration-500 ease-spring group-hover:scale-110">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-lg mb-1 tracking-tight">{c.title}</h3>
                <p className="text-cream-100/75 text-sm leading-relaxed">{c.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
