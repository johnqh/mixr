import { FC, useState } from 'react';
import { OnboardingProgress } from './OnboardingProgress';
import { EquipmentSelector } from './EquipmentSelector';
import { IngredientSelector } from './IngredientSelector';

interface OnboardingWizardProps {
  initialEquipmentIds: number[];
  initialIngredientIds: number[];
  onEquipmentChange: (ids: number[]) => void;
  onIngredientChange: (ids: number[]) => void;
  onComplete: () => void;
}

export const OnboardingWizard: FC<OnboardingWizardProps> = ({
  initialEquipmentIds,
  initialIngredientIds,
  onEquipmentChange,
  onIngredientChange,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Welcome Step */}
      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to MIXR! 🍹
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Let's set up your home bar so we can recommend the perfect cocktails for you.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">What we'll do:</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold mr-3">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Set up your equipment</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tell us what bar tools you have available
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Choose your ingredients</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select the spirits and mixers you have on hand
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold mr-3">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Start mixing!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get personalized cocktail recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Step */}
      {currentStep === 2 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What equipment do you have?</h2>
          <EquipmentSelector
            selectedIds={initialEquipmentIds}
            onSelectionChange={onEquipmentChange}
          />
        </div>
      )}

      {/* Ingredients Step */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What ingredients do you have?</h2>
          <IngredientSelector
            selectedIds={initialIngredientIds}
            onSelectionChange={onIngredientChange}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center">
        <button
          onClick={handleSkip}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
        >
          Skip for now
        </button>
        <div className="flex gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            {currentStep === totalSteps ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
