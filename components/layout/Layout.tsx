import { View, ScrollView } from 'react-native'
import React, { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode;
  search?: string;
}

const Layout = ({ children, search }: LayoutProps) => {
  return (
    <View className="flex-1">
      <Header search={search} />
      <View className="flex-1">
        {children}
        <Footer />
      </View>
      {/* ScrollView ile sararsan footer sabit kalmaz. */}
    </View>
  )
}

export default Layout 