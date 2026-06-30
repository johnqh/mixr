import { FC } from 'react';
import { StarRating } from './StarRating';
import type { RatingAggregate } from '@sudobility/mixr_client';

/** Props for the {@link AggregateRating} component. */
interface AggregateRatingProps {
  /** Aggregate rating data including average, total count, and distribution. */
  aggregate: RatingAggregate;
}

/**
 * Displays the aggregate community rating for a recipe, including
 * the average score, star visualization, total count, and a bar chart
 * showing the distribution across 1-5 stars.
 */
export const AggregateRating: FC<AggregateRatingProps> = ({ aggregate }) => {
  const { average_rating, total_ratings, rating_distribution } = aggregate;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-4">Community Rating</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-foreground mb-2">{average_rating.toFixed(1)}</div>
          <StarRating rating={average_rating} size="lg" />
          <p className="text-sm text-muted-foreground mt-2">
            Based on {total_ratings.toLocaleString()} {total_ratings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = rating_distribution[String(stars) as keyof typeof rating_distribution];
            const percentage = total_ratings > 0 ? (count / total_ratings) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8 text-muted-foreground">{stars} ★</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  {/* Decorative gold rating-bar fill matching the star color
                      (rating-data visual, not a semantic warning accent). */}
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
