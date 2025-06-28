import { Text, View, Pressable, ScrollView, Dimensions, ActivityIndicator, Alert, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { bookService } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BookContainerProps {
  search?: string;
  page?: number;
  onPageChange?: (page: number) => void;
}

export interface BookItem {
  id: number;
  barkod: string;
  kod: string;
  stokcins: string;
  resfile: string;
  kfiyat: number;
  pfiyat1: number;
  kisk: number;
  kkdv: number;
  smiktar: number;
  uretici: {
    ureticiad: string;
  };
  stk_date_update: string;
  authors?: Array<{
    id: number;
    at_name: string;
    at_who: number;
  }>;
  kategori?: {
    kategoriad: string;
  };
  sayfasayisi?: number;
  basimyeri?: string;
  yayin_dili?: {
    ln_name: string;
  };
  ozet?: string;
  resurl?: string;
  sm_resurl?: string;
}

export default function BookContainer({ search = '', page = 1 }: BookContainerProps) {
  const navigation = useNavigation<NavigationProp>();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, [search, page]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const booksResponse = await bookService.getBookList(search, page, 50);
      const booksData = booksResponse?.KiboApp?.Response?.data?.stok;
      if (!booksData) {
        setError('Kitap verileri alınamadı');
        setBooks([]);
        return;
      }
      setBooks(booksData);
    } catch (error) {
      setError('Kitaplar yüklenirken bir hata oluştu');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: BookItem) => {
    if (!book.barkod) {
      Alert.alert('Hata', 'Kitap detayları alınamadı');
      return;
    }
    
    navigation.navigate('BookDetail', {
      bookId: book.barkod,
      title: book.stokcins,
      imageUrl: book.resfile || book.resurl || book.sm_resurl,
      search: book.barkod
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#dc2626" />
        <Text className="mt-2 text-gray-600">Kitaplar yükleniyor...</Text>
      </View>
    );
  }

 /* if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 mb-4">{error}</Text>
        <Pressable
          onPress={loadBooks}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }*/

  return (
    <View className="flex-1">
      <ScrollView 
        contentContainerStyle={{ 
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: 16,
          gap: 16
        }}
      >
        {books.map((book) => {
          const imageUrl = book.resfile && book.resfile.trim() !== '' 
            ? book.resfile 
            : book.resurl && book.resurl.trim() !== ''
            ? book.resurl
            : book.sm_resurl && book.sm_resurl.trim() !== ''
            ? book.sm_resurl
            : '';

          return (
            <Pressable 
              key={book.id}
              onPress={() => handleBookPress(book)}
              style={{
                width: (Dimensions.get('window').width - 48) / 2,
                height: 280,
              }}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <Image 
                source={{ uri: imageUrl }}
                style={{ 
                  width: '100%', 
                  height: 220,
                  backgroundColor: '#eee' 
                }}
                resizeMode="contain"
              />
              <View className="p-2 flex-1 justify-center">
                <Text 
                  numberOfLines={3}
                  className="text-sm font-medium text-gray-800"
                >
                  {book.stokcins}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

