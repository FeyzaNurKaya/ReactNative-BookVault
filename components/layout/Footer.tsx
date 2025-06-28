import { View, Text } from 'react-native'
import React from 'react'

const Footer = () => {
  return (
    <View className="bg-gray-50 p-4 border-t border-gray-200 flex-row justify-between items-between">
     <Text className="text-gray-500">©2023 ONSO</Text>
      <Text className="text-gray-500">© Demo Kitabevi 2023</Text>
    </View>
  )
}

export default Footer 