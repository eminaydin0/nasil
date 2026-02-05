import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function CategoryCard({ category, count, icon: IconComponent, image }) {
  const categoryUrl = encodeURIComponent(category);
  
  return (
    <Link to={`/kategori/${categoryUrl}`} className="group block w-full">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/20">
        
        {/* Arka Plan Görseli */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={category} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>

        {/* İçerik */}
        <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between">
          {/* Üst - İkon */}
          <div className="self-start">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
              <IconComponent size={20} className="text-white" />
            </div>
          </div>

          {/* Alt - Başlık ve Sayı */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
              {category}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60 font-medium">
                {count} Oyun
              </span>
              
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={16} className="text-white" />
              </span>
            </div>
          </div>
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/30 transition-colors duration-300"></div>
      </div>
    </Link>
  );
}

export default CategoryCard;