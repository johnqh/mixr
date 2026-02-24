import { FC, useState } from 'react';

/** Props for the {@link StarRating} component. */
interface StarRatingProps {
  /** Current rating value (can be fractional for display). */
  rating: number;
  /** Maximum number of stars (default: 5). */
  maxRating?: number;
  /** Visual size of the stars. */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the user can click to change the rating. */
  interactive?: boolean;
  /** Callback fired when the user selects a new rating (requires interactive=true). */
  onChange?: (rating: number) => void;
  /** Whether to display the rating count alongside the stars. */
  showCount?: boolean;
  /** Total number of ratings to display when showCount is true. */
  count?: number;
}

/**
 * Displays a star rating with optional interactivity.
 * Supports fractional ratings, hover preview, and accessible star buttons.
 */
export const StarRating: FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  count,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const displayRating = hoverRating ?? rating;

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Rating: ${rating.toFixed(1)} out of ${maxRating} stars`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartial = starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={`
                ${interactive ? 'cursor-pointer' : 'cursor-default'}
                ${interactive ? 'hover:scale-110 transition-transform' : ''}
                focus:outline-none
              `}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              {isPartial ? (
                <svg
                  className={`${sizeClasses[size]} text-yellow-400`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <defs>
                    <linearGradient id={`star-gradient-${starValue}`}>
                      <stop offset={`${(displayRating % 1) * 100}%`} stopColor="currentColor" />
                      <stop offset={`${(displayRating % 1) * 100}%`} stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#star-gradient-${starValue})`}
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                  <path
                    className="text-gray-300 dark:text-gray-600"
                    fill="currentColor"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              ) : (
                <svg
                  className={`${sizeClasses[size]} ${
                    isFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Rating Text */}
      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">{rating.toFixed(1)}</span>
        {showCount && count !== undefined && (
          <span className="text-gray-500 dark:text-gray-500">
            ({count.toLocaleString()})
          </span>
        )}
      </div>
    </div>
  );
};
