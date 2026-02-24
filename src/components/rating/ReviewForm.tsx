import { FC, useState } from 'react';
import { StarRating } from './StarRating';
import { useAuth } from '../../context/AuthContext';

/** Props for the {@link ReviewForm} component. */
interface ReviewFormProps {
  /** The recipe being rated (used for form context). */
  recipeId: number;
  /** Callback fired on form submission with the star count and optional review text. */
  onSubmit: (rating: number, review?: string) => void;
  /** Whether the form is currently submitting (disables the submit button). */
  isSubmitting?: boolean;
}

/**
 * Form component for submitting a star rating and optional written review.
 * Only renders when the user is authenticated.
 */
export const ReviewForm: FC<ReviewFormProps> = ({ recipeId: _recipeId, onSubmit, isSubmitting = false }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewInput, setShowReviewInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    onSubmit(rating, review.trim() || undefined);

    // Reset form
    setRating(0);
    setReview('');
    setShowReviewInput(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Rate this recipe</h3>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Rate this recipe">
        {/* Star Rating */}
        <div>
          <label id="rating-label" className="block text-sm font-medium mb-2">Your Rating</label>
          <StarRating
            rating={rating}
            interactive
            onChange={setRating}
            size="lg"
          />
          {rating === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click to rate this recipe
            </p>
          )}
        </div>

        {/* Optional Review Text */}
        {!showReviewInput && rating > 0 && (
          <button
            type="button"
            onClick={() => setShowReviewInput(true)}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            + Add a written review (optional)
          </button>
        )}

        {showReviewInput && (
          <div>
            <label htmlFor="review" className="block text-sm font-medium mb-2">
              Your Review (Optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your experience with this recipe..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {review.length}/500 characters
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowReviewInput(false);
                  setReview('');
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Remove review
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium transition-colors
              ${
                rating === 0 || isSubmitting
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              'Submit Rating'
            )}
          </button>

          {(rating > 0 || review) && (
            <button
              type="button"
              onClick={() => {
                setRating(0);
                setReview('');
                setShowReviewInput(false);
              }}
              className="px-6 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
