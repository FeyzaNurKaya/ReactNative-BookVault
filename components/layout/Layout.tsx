import { View } from 'react-native'
import React, { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <View className="flex-1">
      <Header />
      <View className="flex-1">
        {children}
      </View>
      <Footer />
    </View>
  )
}

export default Layout 