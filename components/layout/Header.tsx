import { View } from 'react-native'
import React from 'react'
import SearchBar from '../SearchBar'

interface HeaderProps {
  search?: string;
}

const Header = ({ search }: HeaderProps) => {
  return (
    <View className="bg-white">
      <SearchBar search={search} />
    </View>
  )
}

export default Header 