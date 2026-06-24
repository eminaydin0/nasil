import { Star } from 'lucide-react';

function StarRating({ rating, onRatingChange, readOnly = false }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
          disabled={readOnly}
          className={`transition-all ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            size={readOnly ? 16 : 24}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-warm-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
