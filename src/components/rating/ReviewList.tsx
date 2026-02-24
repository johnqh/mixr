import { FC } from 'react';
import { StarRating } from './StarRating';
import type { RecipeRating } from '@sudobility/mixr_client';

/** Props for the {@link ReviewList} component. */
interface ReviewListProps {
  /** Array of user reviews to display. */
  reviews: RecipeRating[];
  /** Whether the reviews are currently loading (shows skeleton placeholders). */
  isLoading?: boolean;
}

/**
 * Displays a list of community reviews with star ratings, user avatars,
 * and timestamps. Shows skeleton loading states and an empty state prompt.
 */
export const ReviewList: FC<ReviewListProps> = ({ reviews, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading reviews">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="text-5xl mb-3">⭐</div>
        <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share your experience with this recipe!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                {review.user_name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Review Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.user_name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <StarRating rating={review.stars} size="sm" />
              </div>

              {/* Review Text */}
              {review.review && (
                <p className="text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-wrap">
                  {review.review}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
