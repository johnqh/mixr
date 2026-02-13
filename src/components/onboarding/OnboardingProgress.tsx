import { FC } from 'react';

interface OnboardingProgressProps {
  reviewedCount: number;
  totalCount: number;
}

export const OnboardingProgress: FC<OnboardingProgressProps> = ({ reviewedCount, totalCount }) => {
  const percentage = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {reviewedCount} of {totalCount} categories reviewed
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {percentage}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
