import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PAGE_SEO, SCHEMA_TEMPLATES, SITE_CONFIG } from '../../constants/seo';
import { trackPageView } from '../../utils/analytics';
import toast from 'react-hot-toast';

function Contact() {
  const [contactInfo, setContactInfo] = useState({
    email: 'eminaydinyazilim@gmail.com',
    phone: '0553 882 76 46',
    address: 'İstanbul, Türkiye'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [sending, setSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/iletisim');
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'contact_info')
        .single();

      if (!error && data) {
        const parsed = JSON.parse(data.content);
        setContactInfo({
          email: parsed.email || 'eminaydinyazilim@gmail.com',
          phone: parsed.phone || '0553 882 76 46',
          address: parsed.address || 'İstanbul, Türkiye'
        });
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.message?.trim()) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setSending(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        });

      if (error) throw error;
      
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin veya doğrudan e-posta gönderin.');
    } finally {
      setSending(false);
    }
  };

  // Structured Data
  const structuredData = [
    SCHEMA_TEMPLATES.webPage(
      PAGE_SEO.contact.title,
      PAGE_SEO.contact.description,
      '/iletisim'
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: PAGE_SEO.contact.title,
      description: PAGE_SEO.contact.description,
      url: `${SITE_CONFIG.url}/iletisim`,
      mainEntity: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        email: contactInfo.email,
        telephone: contactInfo.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'İstanbul',
          addressCountry: 'TR',
        },
      },
    },
  ];

  // Breadcrumb
  const breadcrumbs = [
    { name: 'İletişim', url: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        keywords={PAGE_SEO.contact.keywords}
        url="/iletisim"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6">
              <MessageCircle className="text-orange-600" size={32} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              İletişim
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
                
                <div className="space-y-5">
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-200 transition-colors">
                      <Mail className="text-orange-600" size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">E-posta</h3>
                      <p className="text-gray-600 text-sm group-hover:text-orange-600 transition-colors">
                        {contactInfo.email}
                      </p>
                    </div>
                  </a>

                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-200 transition-colors">
                      <Phone className="text-orange-600" size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Telefon</h3>
                      <p className="text-gray-600 text-sm group-hover:text-orange-600 transition-colors">
                        {contactInfo.phone}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-orange-600" size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Konum</h3>
                      <p className="text-gray-600 text-sm">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-3">Hızlı Bağlantılar</h3>
                <ul className="space-y-2 text-sm text-white/90">
                  <li>
                    <a href="/oyunlar" className="hover:text-white transition-colors">→ Tüm Oyunlar</a>
                  </li>
                  <li>
                    <a href="/araclar" className="hover:text-white transition-colors">→ Oyun Araçları</a>
                  </li>
                  <li>
                    <a href="/hakkimizda" className="hover:text-white transition-colors">→ Hakkımızda</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Adınız Soyadınız
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      placeholder="Adınız Soyadınız"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresiniz
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız
                    </label>
                    <textarea 
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Mesajı Gönder
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
