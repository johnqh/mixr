import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreferencesSelector } from '../components/onboarding/PreferencesSelector';
import SEOHead from '../components/SEOHead';
import { CONSTANTS } from '../config/constants';

const OnboardingPage: FC = () => {
  const navigate = useNavigate();
  const [equipmentIds, setEquipmentIds] = useState<number[]>([]);
  const [ingredientIds, setIngredientIds] = useState<number[]>([]);

  const handleComplete = () => {
    // Navigate to home after onboarding
    navigate('/recipes');
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`Set Up Your Bar - ${CONSTANTS.APP_NAME}`}
        description="Configure your equipment and ingredient preferences to get personalized cocktail recommendations."
        noIndex
      />
      <PreferencesSelector
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
