import { Link } from 'react-router-dom';

function CategoryCard({ category, count, icon, color, bgColor }) {
  return (
    <Link to={`/?kategori=${category}`} className="group block">
      <div className={`${bgColor} rounded-xl p-6 border border-gray-200 hover:border-${color}-400 hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-4xl">{icon}</span>
          <span className={`text-2xl font-bold text-${color}-600`}>{count}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-${color}-600 transition-colors">
          {category}
        </h3>
        <p className="text-sm text-gray-500 mt-1">Oyun keşfet</p>
      </div>
    </Link>
  );
}

export default CategoryCard;
