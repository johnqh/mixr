import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReviewList } from './ReviewList';
import type { RecipeRating } from '@sudobility/mixr_client';

const mockReviews: RecipeRating[] = [
  {
    id: 1,
    recipe_id: 1,
    user_id: 'user1',
    user_name: 'Alice',
    stars: 5,
    review: 'Amazing cocktail!',
    created_at: '2024-06-15T10:00:00Z',
  } as RecipeRating,
  {
    id: 2,
    recipe_id: 1,
    user_id: 'user2',
    user_name: 'Bob',
    stars: 3,
    review: undefined,
    created_at: '2024-06-16T10:00:00Z',
  } as RecipeRating,
];

describe('ReviewList', () => {
  it('renders reviews', () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders review text when present', () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText('Amazing cocktail!')).toBeInTheDocument();
  });

  it('renders user initials as avatar', () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText('A')).toBeInTheDocument(); // Alice
    expect(screen.getByText('B')).toBeInTheDocument(); // Bob
  });

  it('shows empty state when no reviews', () => {
    render(<ReviewList reviews={[]} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    expect(screen.getByText('Be the first to share your experience with this recipe!')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    render(<ReviewList reviews={[]} isLoading />);
    const loadingContainer = screen.getByRole('status');
    expect(loadingContainer).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<ReviewList reviews={mockReviews} />);
    // The date should be formatted in long format
    expect(screen.getByText('June 15, 2024')).toBeInTheDocument();
  });
});
