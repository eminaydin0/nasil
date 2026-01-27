import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import HalisahaGenerator from '../../components/tools/HalisahaGenerator';
import { Link } from 'react-router-dom';
import { ChevronLeft, Users } from 'lucide-react';

export default function HalisahaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Halısaha Takımı Oluşturucu" 
        description="Küçük saha maçları için hızlı takım kurma aracı. 5v5, 6v6, 7v7 formatlarını destekler."
        url="/araclar/halisaha-takim-olusturucu"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            Halısaha Takımı Oluşturucu
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <HalisahaGenerator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
