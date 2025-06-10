import React from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreens';
import BookDetailScreens from './screens/BookDetailScreens';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BookDetail: { bookId: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='BookDetail' component={BookDetailScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
