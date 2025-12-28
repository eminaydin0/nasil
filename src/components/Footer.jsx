import { Heart, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">N</span>
              </div>
              <div className="text-2xl font-black">
                NASIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">OYNANIR</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md text-base">
              Geleneksel Türk oyunlarını dijital ortamda yaşatıyoruz. Kültürümüzün değerli mirasını gelecek nesillere aktarıyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-5 text-orange-400">Hızlı Erişim</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-all hover:translate-x-1 inline-block">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#oyunlar" className="text-gray-400 hover:text-white transition-all hover:translate-x-1 inline-block">
                  Oyunlar
                </a>
              </li>
              <li>
                <a href="#hakkinda" className="text-gray-400 hover:text-white transition-all hover:translate-x-1 inline-block">
                  Hakkımızda
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-5 text-orange-400">İletişim</h3>
            <a href="mailto:info@nasiloynanir.com" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group">
              <Mail size={18} className="text-orange-500 group-hover:text-orange-400 transition-colors" />
              <span>info@nasiloynanir.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Nasıl Oynanır. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm font-medium">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm font-medium">
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
