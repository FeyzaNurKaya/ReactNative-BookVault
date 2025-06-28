import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('userLanguage', language);
    } catch (error) {
      console.error('Dil değiştirme hatası:', error);
    }
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const initializeLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Dil başlatma hatası:', error);
    }
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    initializeLanguage,
    currentLanguage: i18n.language,
  };
}; 