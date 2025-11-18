/**
 * Rating and Review types
 * These types define the expected API structure for ratings/reviews
 * Backend endpoints to be implemented
 */

export interface Rating {
  id: number;
  recipe_id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  stars: number; // 1-5
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface AggregateRating {
  recipe_id: number;
  average_rating: number;
  total_ratings: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface SubmitRatingRequest {
  recipe_id: number;
  stars: number;
  review?: string;
}

export interface RatingListResponse {
  success: boolean;
  data: Rating[];
  count: number;
}

export interface RatingResponse {
  success: boolean;
  data: Rating;
}

export interface AggregateRatingResponse {
  success: boolean;
  data: AggregateRating;
}
