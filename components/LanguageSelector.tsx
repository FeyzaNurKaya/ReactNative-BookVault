import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';

const languages = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
];

export default function LanguageSelector() {
  const { t, changeLanguage, currentLanguage } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        className="bg-red-600 p-3 rounded-r-lg items-center justify-center min-w-[60px]"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-xl cursor-pointer">{currentLanguage.toUpperCase()}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View className="absolute right-0 bottom-24 mr-5">
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View className="bg-white rounded-lg p-2.5 shadow-lg min-w-[150px]">
                  {languages.map(lang => (
                    <TouchableOpacity
                      key={lang.code}
                      className={`py-2.5 px-4 rounded ${
                        currentLanguage === lang.code ? 'bg-red-600' : ''
                      }`}
                      onPress={() => handleLanguageChange(lang.code)}
                    >
                      <Text className={`text-lg ${
                        currentLanguage === lang.code ? 'text-white' : 'text-gray-700'
                      }`}>
                        {t(`languages.${lang.code}`)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
} 