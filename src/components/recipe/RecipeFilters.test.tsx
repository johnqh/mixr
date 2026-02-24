import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeFilters } from './RecipeFilters';

describe('RecipeFilters', () => {
  it('renders the search input', () => {
    render(<RecipeFilters searchQuery="" onSearchChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument();
  });

  it('has an accessible search input with label', () => {
    render(<RecipeFilters searchQuery="" onSearchChange={vi.fn()} />);
    expect(screen.getByLabelText('Search recipes')).toBeInTheDocument();
  });

  it('uses type="search" for the input', () => {
    render(<RecipeFilters searchQuery="" onSearchChange={vi.fn()} />);
    const input = screen.getByLabelText('Search recipes');
    expect(input).toHaveAttribute('type', 'search');
  });

  it('displays the current search query', () => {
    render(<RecipeFilters searchQuery="mojito" onSearchChange={vi.fn()} />);
    expect(screen.getByDisplayValue('mojito')).toBeInTheDocument();
  });

  it('calls onSearchChange when user types', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<RecipeFilters searchQuery="" onSearchChange={onSearchChange} />);

    const input = screen.getByPlaceholderText('Search recipes...');
    await user.type(input, 'margarita');

    expect(onSearchChange).toHaveBeenCalled();
    // Each keystroke triggers a call
    expect(onSearchChange).toHaveBeenCalledTimes(9); // "margarita" = 9 chars
  });
});
