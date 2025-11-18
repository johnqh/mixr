import { FC } from 'react';
import type { Mood } from '@sudobility/mixr_client';

interface MoodSelectorProps {
  moods: Mood[];
  selectedMoodId: number | null;
  onMoodSelect: (moodId: number) => void;
  disabled?: boolean;
}

export const MoodSelector: FC<MoodSelectorProps> = ({
  moods,
  selectedMoodId,
  onMoodSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">How are you feeling?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {moods.map(mood => {
          const isSelected = mood.id === selectedMoodId;
          return (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(mood.id)}
              disabled={disabled}
              className={`
                relative p-6 rounded-xl transition-all duration-200
                flex flex-col items-center justify-center gap-3
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Emoji */}
              <span className="text-5xl">{mood.emoji}</span>

              {/* Mood Name */}
              <span
                className={`
                text-sm font-medium text-center
                ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
              `}
              >
                {mood.name}
              </span>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
