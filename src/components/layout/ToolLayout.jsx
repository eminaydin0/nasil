import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import SEO from '../common/SEO';

export default function ToolLayout({ 
  title, 
  description, 
  icon: IconComponent, 
  iconColor = 'orange',
  badge,
  children,
  helpContent,
  seoTitle,
  seoDescription,
  seoUrl
}) {
  const navigate = useNavigate();
  
  // Icon color classes
  const iconColorClasses = {
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
    pink: { text: 'text-pink-600', bg: 'bg-pink-50' },
    red: { text: 'text-red-600', bg: 'bg-red-50' },
    blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
    indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50' },
    yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' }
  };
  
  const colorClass = iconColorClasses[iconColor] || iconColorClasses.orange;

  return (
    <div className={`${title && description ? "min-h-screen" : "flex flex-col h-full"} bg-gray-50`}>
      <SEO 
        title={seoTitle || `${title} - Nasıl Oynanır?`}
        description={seoDescription || description}
        url={seoUrl}
      />
      
      {/* Header Section - GameDetail Style */}
      {title && description && (
        <div className="bg-white border-b border-orange-100">
          <div className="container mx-auto px-4 py-12">
            <button
              onClick={() => navigate('/araclar')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group text-sm"
            >
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Araçlara Dön</span>
            </button>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Icon Section */}
              <div className="md:col-span-1">
                <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                  <div className={`relative z-10 p-4 ${colorClass.bg} rounded-lg backdrop-blur-sm border border-white/20`}>
                    {IconComponent && <IconComponent className={colorClass.text} size={48} />}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-3">
                  {badge && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg">
                      {badge}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool Content Section */}
      <div className={title && description ? "container mx-auto px-4 py-12" : "flex-1 min-h-0 overflow-hidden"}>
          <div className={title && description ? "max-w-5xl mx-auto" : "h-full"}>
          {/* Main Tool Component */}
          <div className={title && description ? "bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-8" : "h-full"}>
            {children}
          </div>

          {/* Help Content */}
          {helpContent && (
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
              {helpContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

