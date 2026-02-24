import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoodSelector } from './MoodSelector';
import type { Mood } from '@sudobility/mixr_client';

const mockMoods: Mood[] = [
  { id: 1, name: 'Happy', emoji: '😊' } as Mood,
  { id: 2, name: 'Relaxed', emoji: '😌' } as Mood,
  { id: 3, name: 'Adventurous', emoji: '🤠' } as Mood,
];

describe('MoodSelector', () => {
  it('renders all moods', () => {
    render(
      <MoodSelector moods={mockMoods} selectedMoodId={null} onMoodSelect={vi.fn()} />
    );
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Relaxed')).toBeInTheDocument();
    expect(screen.getByText('Adventurous')).toBeInTheDocument();
  });

  it('renders mood emojis', () => {
    render(
      <MoodSelector moods={mockMoods} selectedMoodId={null} onMoodSelect={vi.fn()} />
    );
    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText('😌')).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(
      <MoodSelector moods={mockMoods} selectedMoodId={null} onMoodSelect={vi.fn()} />
    );
    expect(screen.getByText('How are you feeling?')).toBeInTheDocument();
  });

  it('calls onMoodSelect when a mood is clicked', async () => {
    const user = userEvent.setup();
    const onMoodSelect = vi.fn();
    render(
      <MoodSelector moods={mockMoods} selectedMoodId={null} onMoodSelect={onMoodSelect} />
    );

    await user.click(screen.getByText('Relaxed'));
    expect(onMoodSelect).toHaveBeenCalledWith(2);
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <MoodSelector moods={mockMoods} selectedMoodId={null} onMoodSelect={vi.fn()} disabled />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('renders empty state when no moods provided', () => {
    const { container } = render(
      <MoodSelector moods={[]} selectedMoodId={null} onMoodSelect={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });
});
