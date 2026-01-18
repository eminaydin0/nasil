function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const innerSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin ${sizeClasses[size]}`}></div>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`bg-orange-500 rounded-full animate-pulse ${innerSizeClasses[size]}`}></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
