function SkeletonLoader({ type = 'game-detail' }) {
  if (type === 'game-detail') {
    return (
      <div className="min-h-screen bg-cream-50 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-warm-200">
          <div className="container mx-auto px-4 py-6">
            <div className="h-4 w-20 bg-warm-200 rounded mb-4"></div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Image skeleton */}
              <div className="md:col-span-1">
                <div className="w-full h-64 md:h-full bg-warm-200 rounded-xl"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-6 w-24 bg-warm-200 rounded-lg"></div>
                  <div className="h-6 w-32 bg-warm-200 rounded-lg"></div>
                </div>
                <div className="h-8 w-3/4 bg-warm-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-warm-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          {/* Quick Info Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-warm-100">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warm-200 rounded-lg"></div>
                <div>
                  <div className="h-3 w-20 bg-warm-200 rounded mb-1"></div>
                  <div className="h-4 w-24 bg-warm-200 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warm-200 rounded-lg"></div>
                <div>
                  <div className="h-3 w-20 bg-warm-200 rounded mb-1"></div>
                  <div className="h-4 w-24 bg-warm-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-warm-100">
                <div className="h-6 w-32 bg-warm-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-warm-200 rounded"></div>
                  <div className="h-4 w-full bg-warm-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-warm-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-warm-100">
                <div className="h-5 w-28 bg-warm-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-16 bg-warm-200 rounded-lg"></div>
                  <div className="h-16 bg-warm-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'game-card') {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-warm-100 animate-pulse">
        <div className="h-48 bg-warm-200"></div>
        <div className="p-4">
          <div className="h-4 w-20 bg-warm-200 rounded mb-2"></div>
          <div className="h-6 w-3/4 bg-warm-200 rounded mb-2"></div>
          <div className="h-3 w-full bg-warm-200 rounded mb-1"></div>
          <div className="h-3 w-5/6 bg-warm-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'category-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-warm-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-warm-200 rounded-xl"></div>
              <div>
                <div className="h-5 w-24 bg-warm-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-warm-200 rounded"></div>
              </div>
            </div>
            <div className="h-16 bg-warm-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'home-hero') {
    return (
      <div className="h-[500px] w-full bg-charcoal-900 rounded-3xl shadow-2xl animate-pulse flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-64 bg-warm-700 rounded mx-auto"></div>
          <div className="h-6 w-96 bg-warm-700 rounded mx-auto"></div>
          <div className="h-10 w-32 bg-orange-600 rounded-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  if (type === 'comment-list') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-warm-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-warm-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-warm-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-warm-200 rounded mb-1"></div>
                <div className="h-3 w-3/4 bg-warm-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default SkeletonLoader;
