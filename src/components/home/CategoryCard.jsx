import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function CategoryCard({ category, count, icon: IconComponent, image }) {
  // URL'de kategori ismini encode et
  const categoryUrl = encodeURIComponent(category);
  
  return (
    <Link to={`/kategori/${categoryUrl}`} className="group block w-full">
      <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden bg-[#121212] transition-all duration-300">
        
        {/* Arka Plan Görseli - Keskin ve Net */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={category} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800';
            }}
          />
          {/* Görseldeki gibi çok katmanlı karartma */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-black/20"></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
        </div>

        {/* İçerik - Minimalist ve Şık */}
        <div className="absolute inset-0 z-10 p-5 flex flex-col justify-end">
          
          {/* İkon - Sol Üstte Küçük ve Zarif */}
          <div className="absolute top-4 left-4 p-2.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <IconComponent size={18} className="text-white" />
          </div>

          <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white tracking-tight leading-none">
              {category}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {count} Oyun Mevcut
              </span>
              
              {/* İnce Ok İşareti */}
              <ChevronRight size={16} className="text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Aktif Kenarlık - Sadece Hover'da */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-300"></div>
      </div>
    </Link>
  );
}

export default CategoryCard;