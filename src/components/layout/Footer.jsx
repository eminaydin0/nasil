import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function Footer() {
  const [contactInfo, setContactInfo] = useState({
    email: 'eminaydinyazilim@gmail.com',
    phone: '0553 882 76 46'
  });

  useEffect(() => {
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
          phone: parsed.phone || '0553 882 76 46'
        });
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  return (
    <footer className="bg-white border-t border-orange-100">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-3" aria-label="Nasıl Oynanır - Ana Sayfa">
              <img
                src="/logo.svg"
                alt="Nasıl Oynanır"
                className="h-14 w-auto object-contain"
                loading="lazy"
                decoding="async"
                width="42"
                height="56"
              />
            </Link>
            <p className="text-gray-600 leading-relaxed max-w-md text-sm">
              Geleneksel Türk oyunlarını dijital ortamda yaşatıyoruz. Kültürümüzün değerli mirasını gelecek nesillere aktarıyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider mb-4 text-gray-900">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/#oyunlar" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  Oyunlar
                </a>
              </li>
              <li>
                <a href="/hakkimizda" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/iletisim" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  İletişim
                </a>
              </li>
              <li>
                <Link to="/reklam-verin" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  Reklam Verin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider mb-4 text-gray-900">İletişim</h3>
            <div className="space-y-3">
              <a href={`mailto:${contactInfo.email}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group text-sm">
                <Mail size={16} className="text-orange-600 transition-colors" />
                <span className="font-medium">{contactInfo.email}</span>
              </a>
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group text-sm">
                <span className="w-4 h-4 flex items-center justify-center text-orange-600 font-bold text-xs">📞</span>
                <span className="font-medium">{contactInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-100 pt-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Nasıl Oynanır. Tüm hakları saklıdır.</p>
              <span className="hidden md:inline text-gray-300">|</span>
              <p>Zenvolab tarafından kurulmuştur.</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/hakkimizda" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Hakkımızda
              </Link>
              <Link to="/iletisim" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                İletişim
              </Link>
              <Link to="/kullanim-kosullari" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Kullanım Koşulları
              </Link>
              <Link to="/gizlilik" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Gizlilik
              </Link>
              <Link to="/cerez-politikasi" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Çerezler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
