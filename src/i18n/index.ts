import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const resources = {
  en: {
    translation: {
      greeting: 'Good morning',
      title: "Let's get it done",
      todaysProgress: "Today's Progress",
      smartInsights: "Smart Insights",
      completed: "completed",
      monthlySpend: "Monthly Spend",
      goalProgress: "Goal Progress",
      todaysHabits: "Today's Habits",
      tasks: "Tasks",
      settings: "Settings",
      language: "Language"
    }
  },
  es: {
    translation: {
      greeting: 'Buenos días',
      title: "Vamos a hacerlo",
      todaysProgress: "Progreso de Hoy",
      smartInsights: "Estadísticas",
      completed: "completado",
      monthlySpend: "Gasto Mensual",
      goalProgress: "Progreso de Meta",
      todaysHabits: "Hábitos de Hoy",
      tasks: "Tareas",
      settings: "Ajustes",
      language: "Idioma"
    }
  }
};

let deviceLanguage = 'en';
try {
  const locales = getLocales();
  if (locales && locales.length > 0 && locales[0]?.languageCode) {
    deviceLanguage = locales[0].languageCode;
  }
} catch (e) {
  deviceLanguage = 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage, // Fallback to device language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
