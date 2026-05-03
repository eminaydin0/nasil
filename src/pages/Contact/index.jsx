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

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream-100 font-sans">
      <SEO
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        keywords={PAGE_SEO.contact.keywords}
        url="/iletisim"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[18%] -top-[38%] h-[68vmin] w-[68vmin] rounded-full bg-gradient-to-br from-orange-400/26 to-transparent blur-3xl" />
        <div className="absolute -bottom-[32%] -right-[14%] h-[56vmin] w-[56vmin] rounded-full bg-gradient-to-tl from-rose-400/22 to-transparent blur-3xl" />
      </div>

      <div className="relative z-[1]">
        <div className="container mx-auto max-w-6xl px-4 pb-16 pt-10 md:pb-20 md:pt-14">
          <Breadcrumb items={breadcrumbs} className="mb-8" />

          <header className="mx-auto mb-12 max-w-3xl animate-fade-up text-center md:mb-14">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-[1.25rem] bg-gradient-to-br from-orange-400/25 to-red-500/35 ring-2 ring-orange-400/30 shadow-soft-lg">
              <MessageCircle className="h-8 w-8 text-orange-700" aria-hidden />
            </div>
            <h1 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold tracking-tight text-charcoal-900">
              İletişim
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-warm-600">
              Öneriler, sorular veya iş birliği için bırakacağınız mesaj doğrudan yönetici panelinden
              görüntülenir — yanıt süremizi kısaltmak için lütfen net yazın.
            </p>
          </header>

          <div className="grid animate-fade-up gap-8 lg:grid-cols-12 lg:gap-10">
            <aside className="space-y-6 lg:col-span-5">
              <div className="overflow-hidden rounded-[1.375rem] border border-warm-200/75 bg-white/92 p-7 shadow-soft-xl backdrop-blur-sm">
                <h2 className="font-display text-lg font-bold text-charcoal-900">Kanallar</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-warm-500">
                  Tercih ettiğiniz yolu seçin
                </p>

                <div className="mt-6 space-y-2">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="group flex items-start gap-4 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-orange-200 hover:bg-orange-50/70"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-500/15 ring-1 ring-orange-400/35 transition-colors group-hover:bg-orange-500/25">
                      <Mail className="text-orange-700" size={22} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-warm-400">
                        E-posta
                      </span>
                      <span className="mt-0.5 block break-all font-bold text-orange-700 group-hover:text-orange-900">
                        {contactInfo.email}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="group flex items-start gap-4 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-orange-200 hover:bg-orange-50/70"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-500/15 ring-1 ring-orange-400/35">
                      <Phone className="text-orange-700" size={22} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-warm-400">
                        Telefon
                      </span>
                      <span className="mt-0.5 block font-display text-xl font-black tracking-tight text-charcoal-900 group-hover:text-orange-800">
                        {contactInfo.phone}
                      </span>
                    </span>
                  </a>

                  <div className="flex items-start gap-4 rounded-xl border border-warm-100 bg-cream-50/70 px-4 py-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-warm-200/70">
                      <MapPin className="text-warm-700" size={22} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-warm-400">
                        Konum
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold leading-relaxed text-warm-700">
                        {contactInfo.address}
                      </span>
                      <span className="mt-2 block text-[11px] text-warm-500">
                        Yayın adresi için detay görüşmede iletilir.
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.375rem] border border-transparent bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 p-[1px] shadow-warm-glow-lg">
                <div className="rounded-[calc(1.375rem-1px)] px-7 py-6 text-orange-50">
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-orange-50/85">
                    Hızlı bağlantılar
                  </p>
                  <ul className="mt-5 space-y-3 text-[15px] font-semibold">
                    <li>
                      <Link
                        to="/oyunlar"
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/15"
                      >
                        Tüm oyunlar
                        <ArrowRight size={18} className="opacity-80" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/araclar"
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/15"
                      >
                        Oyun araçları
                        <ArrowRight size={18} className="opacity-80" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/hakkimizda"
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/15"
                      >
                        Hakkımızda
                        <ArrowRight size={18} className="opacity-80" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-[1.625rem] border border-warm-200/75 bg-white/95 shadow-soft-xl ring-4 ring-orange-400/[0.07] backdrop-blur-sm">
                <div className="border-b border-warm-200/70 bg-gradient-to-r from-orange-500/18 via-transparent to-orange-600/14 px-6 py-4 sm:px-8">
                  <span className="text-[11px] font-black uppercase tracking-[0.26em] text-orange-950/85">
                    Form
                  </span>
                  <h2 className="font-display mt-1 text-xl font-bold tracking-tight text-charcoal-900">
                    Bir mesaj bırakın
                  </h2>
                  <p className="mt-2 text-sm font-medium text-warm-600">
                    Yanıtlar genelde iş günleri içinde. Güvenlik gereği doğrudan link paylaşımı gerektiren
                    kutular kullanmayız.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-7 sm:px-8 sm:py-9">
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
                    placeholder="Kısa ve net olun; gerekiyorsa oyun slug’ı yazın..."
                    tone="subtle"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
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
    </div>
  );
}

export default Contact;
