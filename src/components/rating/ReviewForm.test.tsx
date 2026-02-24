import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewForm } from './ReviewForm';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ReviewForm', () => {
  const defaultProps = {
    recipeId: 1,
    onSubmit: vi.fn(),
    isSubmitting: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { uid: '123' } });
  });

  it('renders nothing when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { container } = render(<ReviewForm {...defaultProps} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the rating form when user is authenticated', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText('Rate this recipe')).toBeInTheDocument();
    expect(screen.getByText('Your Rating')).toBeInTheDocument();
  });

  it('has an accessible form element', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByRole('form', { name: 'Rate this recipe' })).toBeInTheDocument();
  });

  it('submit button is disabled when no rating is selected', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText('Submit Rating')).toBeDisabled();
  });

  it('shows prompt text when no rating selected', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText('Click to rate this recipe')).toBeInTheDocument();
  });

  it('calls onSubmit with rating when form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReviewForm {...defaultProps} onSubmit={onSubmit} />);

    // Click on 4th star
    await user.click(screen.getByLabelText('4 stars'));

    // Submit form
    await user.click(screen.getByText('Submit Rating'));

    expect(onSubmit).toHaveBeenCalledWith(4, undefined);
  });

  it('shows add review button after selecting a rating', async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);

    await user.click(screen.getByLabelText('3 stars'));
    expect(screen.getByText('+ Add a written review (optional)')).toBeInTheDocument();
  });

  it('disables submit button when isSubmitting is true', async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} isSubmitting={true} />);

    // Select a star first
    await user.click(screen.getByLabelText('3 stars'));

    // The submit button should show submitting state
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });
});
