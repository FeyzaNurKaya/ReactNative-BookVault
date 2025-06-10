import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SearchBar() {
  return (
    <View className='p-2 bg-white rounded-xl border-b border-gray-400'>
      <View className='flex-row items-center gap-2 p-2'>
        <Text className='text-lg font-semibold text-gray-500'>Ürün Gör</Text>
        <View className='flex-1 flex-row items-center border-2 border-gray-300 rounded-lg bg-white'>
          <TextInput 
            placeholder='Ürün Ara..' 
            className='flex-1 p-2 text-black text-lg'
          />
          <View className='bg-gray-100 p-2 rounded-r-lg'>
            <AntDesign 
              name="search1" 
              size={24} 
              color="black" 
            />
          </View>
        </View>
        <Text className='text-lg font-semibold text-blue-300'>kibo</Text>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({})