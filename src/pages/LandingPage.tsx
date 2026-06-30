import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Section } from '@sudobility/components';
import { SEOHead, buildHowToSchema } from '@sudobility/seo_lib';
import { CONSTANTS } from '../config/constants';

const LandingPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('landingPage');
  const { t: tHowTo } = useTranslation('howto');

  const seoTitle = t('seo.title', { appName: CONSTANTS.APP_NAME });
  const seoDescription = t('seo.description');
  const rawKeywords = t('seo.keywords', { returnObjects: true });
  const seoKeywords = Array.isArray(rawKeywords) ? rawKeywords : undefined;

  const rawSteps = tHowTo('home.steps', { returnObjects: true });
  const howToSchema = Array.isArray(rawSteps)
    ? buildHowToSchema(
        tHowTo('home.name'),
        tHowTo('home.description'),
        rawSteps as { name: string; text: string }[]
      )
    : undefined;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={howToSchema}
      />

      <Section spacing="5xl" variant="hero">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {CONSTANTS.APP_NAME}
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">{t('hero.tagline')}</p>
          <button
            onClick={() => navigate('/recipes')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </button>
        </div>
      </Section>

      <Section spacing="3xl" maxWidth="5xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">😊</div>
            <h3 className="text-xl font-semibold mb-2">{t('features.mood.title')}</h3>
            <p className="text-muted-foreground">{t('features.mood.description')}</p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">{t('features.inventory.title')}</h3>
            <p className="text-muted-foreground">{t('features.inventory.description')}</p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">{t('features.ratings.title')}</h3>
            <p className="text-muted-foreground">{t('features.ratings.description')}</p>
          </div>
        </div>
      </Section>

      <Section spacing="3xl" maxWidth="4xl">
        <h2 className="text-3xl font-bold mb-12 text-center">{t('howItWorks.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600 dark:text-purple-300">
              1
            </div>
            <h4 className="font-semibold mb-2">{t('howItWorks.step1.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('howItWorks.step1.description')}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600 dark:text-purple-300">
              2
            </div>
            <h4 className="font-semibold mb-2">{t('howItWorks.step2.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('howItWorks.step2.description')}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600 dark:text-purple-300">
              3
            </div>
            <h4 className="font-semibold mb-2">{t('howItWorks.step3.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('howItWorks.step3.description')}</p>
          </div>
        </div>
      </Section>

      <Section spacing="3xl" variant="cta">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t('cta.description')}</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
          >
            {t('cta.button')}
          </button>
        </div>
      </Section>
    </>
  );
};

export default LandingPage;
