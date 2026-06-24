import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PAGE_SEO, SCHEMA_TEMPLATES, SITE_CONFIG } from '../../constants/seo';
import { trackPageView } from '../../utils/analytics';
import toast from 'react-hot-toast';
import { TextField, Button } from '../../components/ui';

function ContactLink({ href, icon: Icon, label, value, external = true }) {
  const inner = (
    <>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
        <Icon size={18} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-warm-500">{label}</span>
        <span className="mt-0.5 block break-all text-sm font-semibold text-warm-900">{value}</span>
      </span>
    </>
  );

  const className =
    'flex items-start gap-3 rounded-xl border border-warm-200/70 bg-cream-50 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50';

  if (external && href) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

function Contact() {
  const [contactInfo, setContactInfo] = useState({
    email: 'eminaydinyazilim@gmail.com',
    phone: '0553 882 76 46',
    address: 'İstanbul, Türkiye',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
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
        try {
          const parsed = JSON.parse(data.content);
          setContactInfo({
            email: parsed.email || 'eminaydinyazilim@gmail.com',
            phone: parsed.phone || '0553 882 76 46',
            address: parsed.address || 'İstanbul, Türkiye',
          });
        } catch {
          console.error('Invalid contact_info JSON');
        }
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
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      if (error) throw error;

      toast.success('Mesajınız alındı! En kısa sürede dönüş yapacağız.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Gönderilemedi. Tekrar deneyin veya doğrudan e-posta gönderin.');
    } finally {
      setSending(false);
    }
  };

  const structuredData = [
    SCHEMA_TEMPLATES.webPage(PAGE_SEO.contact.title, PAGE_SEO.contact.description, '/iletisim'),
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

  const breadcrumbs = [{ name: 'İletişim', url: null }];

  const quickLinks = [
    { to: '/oyunlar', label: 'Tüm oyunlar' },
    { to: '/araclar', label: 'Oyun araçları' },
    { to: '/hakkimizda', label: 'Hakkımızda' },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12 font-sans">
      <SEO
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        keywords={PAGE_SEO.contact.keywords}
        url="/iletisim"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Giriş */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3">
              <MessageCircle className="text-orange-600" size={32} aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-black text-warm-900">İletişim</h1>
              <p className="text-warm-600">Sorularınız, önerileriniz ve iş birliği teklifleri</p>
            </div>
          </div>

          <div className="rounded-2xl border border-warm-200/70 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-relaxed text-warm-600 sm:text-base">
              Formu doldurarak bize ulaşabilir veya aşağıdaki e-posta ve telefon kanallarını kullanabilirsiniz.
              Mesajlarınıza genellikle birkaç iş günü içinde yanıt veriyoruz.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Sol — iletişim bilgileri */}
          <aside className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-extrabold text-warm-900">İletişim bilgileri</h2>
              <div className="mt-4 space-y-3">
                <ContactLink
                  href={`mailto:${contactInfo.email}`}
                  icon={Mail}
                  label="E-posta"
                  value={contactInfo.email}
                />
                <ContactLink
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  icon={Phone}
                  label="Telefon"
                  value={contactInfo.phone}
                />
                <ContactLink icon={MapPin} label="Konum" value={contactInfo.address} external={false} />
              </div>
            </div>

            <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft">
              <h2 className="text-sm font-extrabold text-warm-900">Hızlı bağlantılar</h2>
              <ul className="mt-3 space-y-1">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-cream-50 hover:text-orange-700"
                    >
                      {label}
                      <ArrowRight size={16} className="text-warm-400" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Sağ — form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-lg font-extrabold text-warm-900">Mesaj gönderin</h2>
              <p className="mt-1 text-sm text-warm-500">
                Ad, e-posta ve mesaj alanlarını doldurun.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <TextField
                  label="Adınız soyadınız"
                  type="text"
                  id="contact-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tam adınız"
                  tone="subtle"
                  required
                />
                <TextField
                  label="E-postanız"
                  type="email"
                  id="contact-email-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="isim@posta.com.tr"
                  icon={Mail}
                  tone="subtle"
                  required
                />
                <TextField
                  as="textarea"
                  label="Mesajınız"
                  id="contact-message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mesajınızı yazın..."
                  tone="subtle"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={sending}
                  iconRight={!sending ? Send : undefined}
                >
                  {sending ? 'Gönderiliyor…' : 'Mesajı gönder'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
