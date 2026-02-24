import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '@sudobility/mixr_client';

const mockRecipe: Recipe = {
  id: 1,
  name: 'Classic Mojito',
  description: 'A refreshing Cuban classic with rum, mint, and lime',
  ingredients: [
    { id: 1, name: 'White Rum', amount: '2 oz' },
    { id: 2, name: 'Lime Juice', amount: '1 oz' },
    { id: 3, name: 'Sugar', amount: '2 tsp' },
  ] as Recipe['ingredients'],
  steps: ['Muddle mint', 'Add rum', 'Shake'],
  mood: { id: 1, name: 'Relaxed', emoji: '😌' } as Recipe['mood'],
  equipment: [],
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
} as Recipe;

describe('RecipeCard', () => {
  it('renders the recipe name', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
    expect(screen.getByText('Classic Mojito')).toBeInTheDocument();
  });

  it('renders the recipe description', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
    expect(screen.getByText('A refreshing Cuban classic with rum, mint, and lime')).toBeInTheDocument();
  });

  it('renders ingredient and step counts', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
    expect(screen.getByText('3 ingredients')).toBeInTheDocument();
    expect(screen.getByText('3 steps')).toBeInTheDocument();
  });

  it('renders the mood emoji and name', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
    expect(screen.getByText('Relaxed')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<RecipeCard recipe={mockRecipe} onClick={onClick} />);

    await user.click(screen.getByText('Classic Mojito'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('handles recipe without description', () => {
    const recipeNoDesc = { ...mockRecipe, description: undefined };
    render(<RecipeCard recipe={recipeNoDesc} onClick={vi.fn()} />);
    expect(screen.getByText('Classic Mojito')).toBeInTheDocument();
  });

  it('handles recipe without mood', () => {
    const recipeNoMood = { ...mockRecipe, mood: undefined } as unknown as Recipe;
    render(<RecipeCard recipe={recipeNoMood} onClick={vi.fn()} />);
    expect(screen.getByText('Classic Mojito')).toBeInTheDocument();
    expect(screen.queryByText('Relaxed')).not.toBeInTheDocument();
  });
});
