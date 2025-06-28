import { Text, View, ActivityIndicator, ScrollView, Alert, Image, Pressable, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App';
import { Book, bookService } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreens({ route, navigation }: Props) {
  const { bookId, title, imageUrl, search } = route.params;
  const { t } = useLanguage();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      loadBookDetail();
    }
  }, [bookId]);

  const loadBookDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookData = await bookService.getBookById(bookId);
      // console.log("📚 Alınan kitap:", bookData);
      setBook(bookData);
    } catch (error: any) {
      console.error('Kitap detay yükleme hatası:', error);
      setError(error.message || 'Kitap detayları alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <Layout search={search}>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#dc2626" />
          <Text className="mt-2 text-gray-600">{t('bookDetail.loading')}</Text>
        </View>
      </Layout>
    );
  }

  if (!book || !book.stok) {
    return (
      <Layout search={search}>
        <View className="flex-1 justify-center items-center bg-white p-4">
          <Text className="text-gray-500 mb-4 text-center">{t('bookDetail.notFound')}</Text>
          <Pressable
            onPress={handleGoBack}
            className="bg-gray-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">{t('bookDetail.goBack')}</Text>
          </Pressable>
        </View>
      </Layout>
    );
  }

  const stok = book.stok;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${stok.barkod || '-'}`;
  const barcodeUrl = (stok.barkod || '').length >= 12
    ? `https://barcode.tec-it.com/barcode.ashx?data=${stok.barkod}&code=EAN13`
    : '';

  const screenWidth = Dimensions.get('window').width;

  return (
    <Layout search={search}>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          <View className="items-center mb-6">
            <Image
              source={{ uri: stok.resfile || imageUrl }}
              className="w-3/5 h-96 bg-gray-100 rounded-lg"
              style={{ 
                width: screenWidth * 0.6, 
                height: screenWidth * 0.8, 
              }}
              resizeMode="cover"
            />
          </View>

          <View className="mb-4">
            <Text className="text-2xl font-bold mb-2 text-gray-800">{stok.stokcins || '-'}</Text>
          </View>

          <View className="mb-6">
            <View className="border-2 border-red-500 rounded-lg p-4 mb-2 items-center">
              <View className="flex-row items-end justify-center mb-1">
                <Text className="text-lg text-red-500 font-bold mr-2">TRY</Text>
                <Text className="text-5xl text-red-600 font-bold">{stok.kfiyat?.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) || '-'}</Text>
              </View>
              
            </View>
            <View className="flex-row justify-center items-center mt-2">
                <Text className="text-base font-bold text-black mr-4">({t('bookDetail.kdvIncluded')})</Text>
                <Text className="text-base font-bold text-red-500">%{stok.kkdv !== undefined ? stok.kkdv : '0'} {t('bookDetail.point')}</Text>
            </View>
            <Text className="text-gray-700 text-base text-center mt-3">
              {t('bookDetail.listPrice')}: {stok.pfiyat1?.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) || '-'}
            </Text>
          </View>

          <View className="flex-row justify-center gap-4 mb-6">
            <View className="bg-green-100 px-4 py-2 rounded-lg flex-row items-center">
              <MaterialIcons name="discount" size={18} color="green" />
              <Text className="text-green-700 font-semibold text-base ml-2">
                {stok.kisk !== undefined ? `%${stok.kisk}` : '-'} {t('bookDetail.discount')}
              </Text>
            </View>
            <View className="bg-blue-100 px-4 py-2 rounded-lg flex-row items-center">
            <MaterialCommunityIcons name="cart-heart" size={18} color="blue" />
              <Text className="text-blue-700 font-semibold text-base ml-2">
                {stok.smiktar !== undefined ? Math.abs(stok.smiktar) : '-'} {t('bookDetail.stock')}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-center items-center gap-6 mb-6">
            <View className="items-center">
              {barcodeUrl ? (
                <Image 
                  source={{ uri: barcodeUrl }} 
                  style={{ height: 80, width: 150 }}
                  resizeMode="contain"
                />
              ) : (
                <View className="h-16 w-24 bg-gray-200 rounded items-center justify-center">
                  <Text className="text-xs text-red-500">{t('bookDetail.invalidBarcode')}</Text>
                </View>
              )}
            </View>
            
            <View className="items-center">
              <Image 
                source={{ uri: qrUrl }} 
                className='h-24 w-24'
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-4">
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm">{t('bookDetail.origin')}:</Text>
                <Text className="text-gray-800 font-semibold text-sm">{stok.uretici?.ureticiad || '-'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm">{t('bookDetail.priceUpdateDate')}:</Text>
                <Text className="text-gray-800 font-semibold text-sm">
                  {stok.stk_date_update
                    ? new Date(stok.stk_date_update).toLocaleDateString('tr-TR')
                    : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
