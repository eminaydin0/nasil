import { useState, useEffect } from 'react';
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
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xl">N</span>
              </div>
              <div className="text-xl font-black text-gray-900 tracking-tight leading-none">
                NASIL <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-600">OYNANIR</span>
              </div>
            </div>
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
              <p>
                Geliştirici: <a href={`mailto:${contactInfo.email}`} className="text-orange-600 hover:text-orange-700 font-medium transition-colors">Emin Aydın</a>
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/hakkimizda" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Hakkımızda
              </a>
              <a href="/iletisim" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                İletişim
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
