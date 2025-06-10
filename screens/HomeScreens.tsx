import { View, Text } from 'react-native'
import React from 'react'
import Layout from '../components/layout/Layout'
import BookContainer from '../components/BookContainer'

const HomeScreens = () => {
  return (
    <Layout>
      <View className="flex-1 bg-white">
        <BookContainer />
      </View>
    </Layout>
  )
}

export default HomeScreens