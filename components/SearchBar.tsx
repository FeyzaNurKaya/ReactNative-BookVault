import { Text, TextInput, View, Pressable, FlatList, Image } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { bookService } from '../services/api';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import debounce from 'lodash/debounce';
import { useLanguage } from '../hooks/useLanguage';
import { BookItem } from './BookContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchBar({ search }: { search?: string }) {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const { t } = useLanguage();
  const [searchText, setSearchText] = useState(search || '');
  const [suggestions, setSuggestions] = useState<BookItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setSearchText('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (search) {
      setSearchText(search);
    }
  }, [search]);

  const searchBooks = async (text: string) => {
    try {
      if (text.length >= 4) {
        const response = await bookService.getBookList();
        if (response?.KiboApp?.Response?.data?.stok) {
          const books: BookItem[] = response.KiboApp.Response.data.stok;
          const filteredBooks = books.filter(book => 
            book.stokcins && book.stokcins.toLowerCase().includes(text.toLowerCase())
          );
          setSuggestions(filteredBooks);
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Kitap arama hatası:', error);
      setSuggestions([]);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => searchBooks(text), 300),
    []
  );

  const handleTextChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleSearch = () => {
    if (searchText.length >= 4) {
      searchBooks(searchText);
    }
  };

  const handleBookSelect = (book: BookItem) => {
    setShowSuggestions(false);
    setSearchText(book.stokcins);
    navigation.navigate('BookDetail', {
      bookId: book.barkod,
      title: book.stokcins,
      search: book.barkod
    });
  };

  return (
    <View className='bg-white border-b border-gray-200 px-8 py-2 min-h-[80px]'>
      <View className='flex-row items-center w-full'>
        <View className='flex-1 flex-row items-center space-x-8'>
          <Text className='text-xl font-bold text-black mr-2'>{t('products')}</Text>
          <View className={`flex-1 flex-row items-center bg-gray-50 rounded-lg border-2 px-3 min-h-[40px] transition-colors duration-200 ${isInputFocused ? 'border-red-600' : 'border-gray-100'}`}>
            <TextInput
              placeholder={t('search')}
              placeholderTextColor="#bbb"
              className='flex-1 text-base text-black min-h-[36px] bg-transparent'
              value={searchText}
              onChangeText={handleTextChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <Pressable onPress={handleSearch} className='p-1'>
              <AntDesign name="search1" size={22} color="#222" />
            </Pressable>
          </View>
        </View>
        <View className='flex-row items-center ml-2'>
          <Image source={require('../assets/kibo.png')} style={{ width: 42, height: 18 }} />
        </View>
      </View>
      {showSuggestions && suggestions.length > 0 && (
        <View className='absolute left-8 right-8 top-[66px] bg-white border border-gray-300 rounded-xl z-50 shadow-lg max-h-80'>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleBookSelect(item)}
                className='py-3 px-4 mx-2 my-1 '
              >
                <Text className='text-gray-800 text-base'>{item.stokcins}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => (
              <View className='h-px bg-gray-100' />
            )}
          />
        </View>
      )}
    </View>
  );
}

