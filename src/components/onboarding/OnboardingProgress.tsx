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
        <span className="text-sm font-medium text-muted-foreground">
          {reviewedCount} of {totalCount} categories reviewed
        </span>
        <span className="text-sm text-muted-foreground">{percentage}% Complete</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
