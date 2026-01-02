import { Link } from 'react-router-dom';

const colorMap = {
  green: { text: 'text-green-600', border: 'hover:border-green-400', groupHover: 'group-hover:text-green-600' },
  blue: { text: 'text-blue-600', border: 'hover:border-blue-400', groupHover: 'group-hover:text-blue-600' },
  purple: { text: 'text-purple-600', border: 'hover:border-purple-400', groupHover: 'group-hover:text-purple-600' },
  red: { text: 'text-red-600', border: 'hover:border-red-400', groupHover: 'group-hover:text-red-600' },
  orange: { text: 'text-orange-600', border: 'hover:border-orange-400', groupHover: 'group-hover:text-orange-600' },
  indigo: { text: 'text-indigo-600', border: 'hover:border-indigo-400', groupHover: 'group-hover:text-indigo-600' },
  gray: { text: 'text-gray-600', border: 'hover:border-gray-400', groupHover: 'group-hover:text-gray-600' },
};

function CategoryCard({ category, count, icon, color, bgColor, image }) {
  const colorClasses = colorMap[color] || colorMap.gray;

  return (
    <Link to={`/kategori/${category}`} className="group block h-full">
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={category} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl filter drop-shadow-lg">{icon}</span>
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/30">
              {count} Oyun
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
            {category}
          </h3>
          <p className="text-white/80 text-sm line-clamp-1">
            En popüler {category.toLowerCase()}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;

