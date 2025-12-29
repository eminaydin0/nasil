import { Mail } from 'lucide-react';

function Footer() {
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
                <a href="#oyunlar" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  Oyunlar
                </a>
              </li>
              <li>
                <a href="#hakkinda" className="text-gray-600 hover:text-gray-900 transition-colors inline-block">
                  Hakkımızda
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider mb-4 text-gray-900">İletişim</h3>
            <a href="mailto:info@nasiloynanir.com" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group text-sm">
              <Mail size={16} className="text-orange-600 transition-colors" />
              <span className="font-medium">info@nasiloynanir.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-100 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Nasıl Oynanır. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                Kullanım Koşulları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
