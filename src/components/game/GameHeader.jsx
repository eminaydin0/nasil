import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Image as ImageIcon } from 'lucide-react';
import SocialShare from './SocialShare';

export default function GameHeader({ game, viewCount, selectedImage, setSelectedImage }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group text-sm"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Geri Dön</span>
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Image & Gallery */}
          <div className="md:col-span-1">
            {/* Ana Resim */}
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden mb-3 cursor-pointer group relative">
              <img 
                src={selectedImage || game.image} 
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImage(selectedImage || game.image)}
              />
              {game.gallery && game.gallery.length > 0 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <ImageIcon size={14} />
                  {game.gallery.length + 1}
                </div>
              )}
            </div>

            {/* Galeri Küçük Resimleri */}
            {game.gallery && game.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {/* Ana resim küçük hali */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    !selectedImage ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <img 
                    src={game.image} 
                    alt={`${game.name} ana`}
                    className="w-full h-full object-cover"
                  />
                </button>
                
                {/* Galeri resimleri */}
                {game.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${game.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                  {game.category}
                </span>
                <span className="flex items-center text-gray-500 text-xs">
                  <Eye size={14} className="mr-1" />
                  {viewCount.toLocaleString('tr-TR')} görüntülenme
                </span>
              </div>
              <SocialShare game={game} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
            <p className="text-gray-600 text-sm">{game.shortDescription}</p>
            {/* 101 oyunuysa skor tablosu butonu */}
            {game.name.toLowerCase().includes('101') && (
              <button
                onClick={() => navigate('/araclar/101-yazboz')}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                101 Skor Tablosu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
