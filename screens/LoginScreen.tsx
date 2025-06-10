import { Button, Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Octicons } from '@expo/vector-icons'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Home');
  };

  return (
    <View className='bg-gray-200 flex-1'>
      <View className='flex justify-center items-center m-4 p-4 bg-white rounded-lg'>
      <Image source={require('../assets/onso.png')} className='w-20 h-20 mb-4' />
        <View className='flex-row justify-center items-center border-gray-200 border-2 rounded-lg p-2 w-full mb-4 mt-4'>
        <Octicons name="person" size={24} color="black" />
        <TextInput 
            placeholder='Kullanıcı İsim' 
            className='flex-1 p-2 text-black text-lg ml-5'
          />
        </View>
        <View className='flex-row justify-center items-center border-gray-200 border-2 rounded-lg p-2 w-full mb-4 mt-4'>
        <EvilIcons name="lock" size={32} color="black" />
        <TextInput 
            placeholder='Kullanıcı Şifre' 
            className='flex-1 p-2 text-black text-lg'
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={24} 
              color="black" 
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={handleLogin}
          style={{
            backgroundColor: '#dc2626',
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            width: '100%',
            alignItems: 'center',
            marginTop: 16
          }}
        >
          <Text className='text-white text-center text-lg font-semibold'>Giriş</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
