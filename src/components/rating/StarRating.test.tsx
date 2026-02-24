import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('renders the correct number of stars', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5); // default maxRating
  });

  it('renders custom maxRating number of stars', () => {
    render(<StarRating rating={2} maxRating={10} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(10);
  });

  it('displays the numeric rating', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays count when showCount is true', () => {
    render(<StarRating rating={4} showCount count={1234} />);
    expect(screen.getByText('(1,234)')).toBeInTheDocument();
  });

  it('does not display count when showCount is false', () => {
    render(<StarRating rating={4} count={100} />);
    expect(screen.queryByText('(100)')).not.toBeInTheDocument();
  });

  it('has proper aria-label with rating info', () => {
    render(<StarRating rating={3.5} />);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Rating: 3.5 out of 5 stars');
  });

  it('star buttons have aria-labels', () => {
    render(<StarRating rating={3} />);
    expect(screen.getByLabelText('1 star')).toBeInTheDocument();
    expect(screen.getByLabelText('2 stars')).toBeInTheDocument();
    expect(screen.getByLabelText('5 stars')).toBeInTheDocument();
  });

  it('stars are disabled when not interactive', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toBeDisabled();
    });
  });

  it('stars are enabled when interactive', () => {
    render(<StarRating rating={3} interactive onChange={vi.fn()} />);
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).not.toBeDisabled();
    });
  });

  it('calls onChange when an interactive star is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating rating={0} interactive onChange={onChange} />);

    await user.click(screen.getByLabelText('4 stars'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('does not call onChange when not interactive', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating rating={3} onChange={onChange} />);

    await user.click(screen.getByLabelText('4 stars'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
