import { FC } from 'react';

interface SelectableItemCardProps {
  id: number | 'none';
  name: string;
  icon: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const SelectableItemCard: FC<SelectableItemCardProps> = ({
  name,
  icon,
  isSelected,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-4 border-2 rounded-lg transition-all ${
        isSelected
          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium">{name}</div>
      {isSelected && (
        <div className="mt-2 text-purple-600 dark:text-purple-400">✓</div>
      )}
    </button>
  );
};
