import { Image, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Octicons } from '@expo/vector-icons'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/api';
import { ParamListBase } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

interface LoginNavigationParams extends ParamListBase {
  Login: undefined;
  Home: undefined;
}

type NavigationProp = NativeStackNavigationProp<LoginNavigationParams, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre gereklidir');
      return;
    }

    try {
      setLoading(true);      
      const response = await authService.login({
        email,
        password
      });
      
      console.log('Login yanıtı:', JSON.stringify(response, null, 2));

      if (response.KiboApp?.Response?.kiboType === 'success') {
        const token = response.KiboApp?.Response?.data?.authorization?.access_token;
        if (token) {
          console.log('Token alındı, kaydediliyor...');
          await AsyncStorage.setItem('access_token', token);
          
          const savedToken = await AsyncStorage.getItem('access_token');
          if (savedToken) {
            console.log('Token başarıyla kaydedildi ve doğrulandı');
            navigation.replace('Home');
          } else {
            throw new Error('Token kaydedilemedi');
          }
        } else {
          throw new Error('Token alınamadı');
        }
      } else {
        const errorMessage = response.KiboApp?.Response?.kiboMessage || 'Giriş yapılamadı';
        Alert.alert('Hata', errorMessage);
      }
    } catch (error: any) {
      console.error('Login hatası:', error);
      const errorMessage = error.response?.data?.KiboApp?.Response?.kiboMessage 
       'Giriş yapılırken bir hata oluştu';
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='bg-gray-200 flex-1 justify-center items-center'>
      <View className='flex justify-center items-center m-4 p-4 bg-white rounded-lg'>
        <Image source={require('../assets/onso.png')} className='w-80 h-20 mb-4 mt-4' />
        <View className='flex-row justify-center items-center border-gray-200 border-2 rounded-lg p-2 w-full mb-4 mt-4'>
          <Octicons name="person" size={24} color="black" />
          <TextInput 
            placeholder={t('username')}
            className='flex-1 p-2 text-black text-lg ml-5'
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>
        <View className='flex-row justify-center items-center border-gray-200 border-2 rounded-lg p-2 w-full mb-4 mt-4'>
          <EvilIcons name="lock" size={32} color="black" />
          <TextInput 
            placeholder={t('password')}
            className='flex-1 p-2 text-black text-lg'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={24} 
              color="black" 
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row w-full mt-4">
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            className={`flex-1 py-3 rounded-l-lg items-center ${loading ? 'bg-red-400 opacity-70' : 'bg-red-600'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className='text-white text-center text-lg font-semibold'>
                {t('login')}
              </Text>
            )}
          </TouchableOpacity>
          <View className="bg-red-600 rounded-r-lg justify-center items-center px-5">
            <LanguageSelector />
          </View>
        </View>
      </View>
    </View>
  )
}
