import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BookDetail: { bookId: string; title: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Book {
  id: string;
  title: string;
}

export default function BookContainer() {
  const navigation = useNavigation<NavigationProp>();
  const [hoveredItems, setHoveredItems] = useState<{[key: string]: boolean}>({});
  const [isPrevPressed, setIsPrevPressed] = useState(false);
  const [isNextPressed, setIsNextPressed] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const BOOK_WIDTH = Dimensions.get('window').width / 2; 

  useEffect(() => {
    const mockData: Book[] = [
      { id: '1', title: 'Book 1' },
      { id: '2', title: 'Book 2' },
      { id: '3', title: 'Book 3' },
      { id: '4', title: 'Book 4' },
      { id: '5', title: 'Book 5' },
    ];
    setBooks(mockData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < books.length - 1) {
        setCurrentIndex(prev => prev + 1);
        scrollViewRef.current?.scrollTo({
          x: BOOK_WIDTH * (currentIndex + 1),
          animated: true
        });
      } else {
        setCurrentIndex(0);
        scrollViewRef.current?.scrollTo({
          x: 0,
          animated: true
        });
      }
    }, 4000); 

    return () => clearInterval(interval);
  }, [currentIndex, books.length]);

  const handlePressIn = (id: string) => {
    setHoveredItems(prev => ({ ...prev, [id]: true }));
  };

  const handlePressOut = (id: string) => {
    setHoveredItems(prev => ({ ...prev, [id]: false }));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      scrollViewRef.current?.scrollTo({
        x: BOOK_WIDTH * (currentIndex - 1),
        animated: true
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < books.length - 1) {
      setCurrentIndex(prev => prev + 1);
      scrollViewRef.current?.scrollTo({
        x: BOOK_WIDTH * (currentIndex + 1),
        animated: true
      });
    }
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', {
      bookId: book.id,
      title: book.title
    });
  };

  return (
    <View style={{ width: '100%' }}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} 
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {books.map((book) => (
          <Pressable 
            key={book.id}
            onPress={() => handleBookPress(book)}
            onPressIn={() => handlePressIn(book.id)}
            onPressOut={() => handlePressOut(book.id)}
            style={{
              width: BOOK_WIDTH - 18,
              marginRight: 16,
            }}
            className={`bg-white rounded-lg p-4 ${hoveredItems[book.id] ? 'border-2 border-red-500' : 'border-2 border-transparent'}`}
          >
            <Text className='text-lg font-semibold text-gray-500'>{book.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
      
      <View className="flex-row justify-center items-center mt-4">
        <View className="flex-row items-center border border-gray-200 rounded-lg overflow-hidden">
          <Pressable
            onPress={handlePrevious}
            onPressIn={() => setIsPrevPressed(true)}
            onPressOut={() => setIsPrevPressed(false)}
            className={`px-6 py-3 ${isPrevPressed ? 'bg-gray-200' : ''}`}
            disabled={currentIndex === 0}
          >
            <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? "#999" : "black"} />
          </Pressable>
          
          <View className="w-[1px] h-8 bg-gray-200" />
          
          <Pressable
            onPress={handleNext}
            onPressIn={() => setIsNextPressed(true)}
            onPressOut={() => setIsNextPressed(false)}
            className={`px-6 py-3 ${isNextPressed ? 'bg-gray-200' : ''}`}
            disabled={currentIndex === books.length - 1}
          >
            <Ionicons name="arrow-forward" size={24} color={currentIndex === books.length - 1 ? "#999" : "black"} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

