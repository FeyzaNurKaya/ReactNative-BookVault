import { Text, View } from 'react-native'
import React from 'react'
import Layout from '../components/layout/Layout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BookDetail: { bookId: string; title: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreens({ route }: Props) {
  const { bookId, title } = route.params;

  return (
    <Layout>
      <View className='flex-1 justify-start items-center bg-white p-4'>
        <Text className='text-2xl font-bold mb-4'>{title}</Text>
        <Text className='text-gray-600'>Book ID: {bookId}</Text>
      </View>
    </Layout>
  )
}
