import { useState } from 'react';
import { Mail, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Lütfen e-posta adresinizi girin');
      return;
    }

    setLoading(true);
    
    // Simüle edilmiş kayıt - gerçek backend entegrasyonu eklenebilir
    setTimeout(() => {
      toast.success('Bültenimize başarıyla abone oldunuz!');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Arka plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"></div>
      
      {/* Dekoratif şekiller */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-400/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>Yeni oyunlardan haberdar olun</span>
          </div>

          {/* Başlık */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oyun Dünyasından Haberler
          </h2>
          
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Yeni eklenen oyunlar, ipuçları ve özel içeriklerden ilk siz haberdar olun.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-black/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Abone Ol</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>

          {/* Alt bilgi */}
          <p className="text-white/60 text-sm mt-4">
            Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
