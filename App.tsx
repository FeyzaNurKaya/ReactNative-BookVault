import React, { useEffect, useState } from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreens from './screens/HomeScreens';
import BookDetailScreens from './screens/BookDetailScreens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLanguage } from './hooks/useLanguage';
import './i18n';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BookDetail: {
    bookId: string;
    title: string;
    imageUrl?: string;
    search?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t, initializeLanguage } = useLanguage();

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await initializeLanguage();
        await AsyncStorage.clear();
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Başlatma hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreens}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: t('home'),
            headerTintColor: '#dc2626',
            headerRight: () => (
              <View className="ml-2.5">
                <Text
                  className="text-white bg-red-600 font-bold text-base border border-red-600 rounded-md p-2"
                  onPress={async () => {
                    await AsyncStorage.removeItem('access_token');
                    navigation.replace('Login');
                  }}
                >{t('logout')}</Text>
              </View>
            ),
          })}
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetailScreens}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: t('bookDetail.title'),
            headerTintColor: '#dc2626',
            headerRight: () => (
              <View className="ml-2.5">
                <Text
                  className="text-red-600 font-bold text-base"
                  onPress={async () => {
                    await AsyncStorage.removeItem('access_token');
                    navigation.replace('Login');
                  }}
                >{t('logout')}</Text>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
