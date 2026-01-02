import { Link } from 'react-router-dom';

function CategoryCard({ category, count, icon, image }) {
  return (
    <Link to={`/kategori/${category}`} className="group block h-full relative">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={category} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300 origin-left filter drop-shadow-lg">
                {icon}
              </div>
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-orange-300 transition-colors">
                {category}
              </h3>
            </div>
            
            <span className="text-xs font-medium text-white/80 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
              {count} Oyun
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;

