import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';

const OnboardingPage: FC = () => {
  const navigate = useNavigate();
  const [equipmentIds, setEquipmentIds] = useState<number[]>([]);
  const [ingredientIds, setIngredientIds] = useState<number[]>([]);

  const handleComplete = () => {
    // Navigate to home after onboarding
    navigate('/recipes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <OnboardingWizard
        initialEquipmentIds={equipmentIds}
        initialIngredientIds={ingredientIds}
        onEquipmentChange={setEquipmentIds}
        onIngredientChange={setIngredientIds}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default OnboardingPage;
