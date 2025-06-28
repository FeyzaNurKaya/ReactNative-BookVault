import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.onsocloud.com';
const TOKEN_KEY = 'access_token';

interface ApiResponse<T> {
  KiboApp?: {
    Response: {
      data: T;
      access_token?: string;
      message?: string;
      errorCode?: string;
      kiboCode?: number;
      kiboMessage?: string;
      kiboType?: string;
      pageError?: string;
      pageStatus?: number;
      path?: string;
      timestamp?: string;
    };
  };
}

export interface LoginResponse {
  KiboApp?: {
    Response?: {
      kiboType?: string;
      kiboMessage?: string;
      data?: any;
    }
  }
}

export interface Book {
  stok: {
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
  };
}

export interface Settings {
  stokSatisFiyatId?: number;
}

const getStoredToken = (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY)
    .then(token => {
      console.log('Stored token:', token ? `${token.substring(0, 20)}...` : 'null');
      return token;
    })
    .catch(error => {
      console.error('Token alınırken hata:', error);
      return null;
    });
};

const setStoredToken = (token: string): Promise<boolean> => {
  return AsyncStorage.setItem(TOKEN_KEY, token)
    .then(() => {
      console.log('Token kaydedildi');
      console.log(TOKEN_KEY, token);
      return getStoredToken();
    })
    .then(savedToken => {
      if (savedToken !== token) {
        throw new Error('Token doğrulama hatası');
      }
      return true;
    })
    .catch(error => {
      console.error('Token kaydedilirken hata:', error);
      return false;
    });
};

const removeStoredToken = (): Promise<void> => {
  return AsyncStorage.removeItem(TOKEN_KEY)
    .then(() => {
      console.log('Token silindi');
    })
    .catch(error => {
      console.error('Token silinirken hata:', error);
    });
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(
  (config: any) => {
    if (config.url === '/api/auth/login') {
      return config;
    }

    return getStoredToken()
      .then(token => {
        if (!token) {
          throw new Error('Token bulunamadı');
        }

        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token eklendi:', token.substring(0, 20) + '...');
        console.log('Request headers:', JSON.stringify(config.headers, null, 2));
        
        return config;
      })
      .catch(error => {
        console.error('Request error:', error);
        return Promise.reject(error);
      });
  },
  (error: any) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Yanıt: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: any) => {
    console.error('API Hata:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        removeStoredToken();
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: { email: string; password: string }) => {
    console.log('Login isteği gönderiliyor...');
    return api.post<ApiResponse<any>>('/api/auth/login', credentials)
      .then(response => {
        const token = response.data?.KiboApp?.Response?.data?.authorization?.access_token;
        if (!token) {
          throw new Error('Token alınamadı');
        }

        return setStoredToken(token)
          .then(saved => {
            if (!saved) {
              throw new Error('Token kaydedilemedi');
            }
            return response.data;
          });
      });
  },

  logout: () => {
    return removeStoredToken()
  },

  isAuthenticated: (): Promise<boolean> => {
    return getStoredToken()
      .then(token => token !== null);
  }
};

export const settingsService = {
  getGlobalSettings: () => {
    return getStoredToken()
      .then(token => {
        if (!token) {
          throw new Error('Token bulunamadı');
        }

        return api.get<ApiResponse<Settings>>('/api/settings/global', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(response => response.data);
  }
};

interface BookListResponse {
  page: number;
  pageIn: number;
  rowCount: number;
  stok: Array<{
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
  }>;
}

export const bookService = {
  getBookList: (searchText: string = '', page: number = 1, limit: number = 10) => {
    return getStoredToken()
      .then(token => {
        if (!token) throw new Error('Token bulunamadı');

        const params: any = {
          searchType: 0,
          page,
          limit,
          tags: 1,
          tmiktar: 1,
        };

        params["search_text"] = searchText || "kitap";

        return api.get<ApiResponse<BookListResponse>>('/api/reader/stok/list', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params
        });
      })
      .then(response => response.data);
  },

  getBookById: (id: string): Promise<Book> => {
    console.log('Kitap detayı isteği başlatılıyor...', id);
    
    return getStoredToken()
      .then(token => {
        if (!token) {
          throw new Error('Token bulunamadı');
        }

        if (!id) {
          throw new Error('Geçersiz kitap ID');
        }

        return settingsService.getGlobalSettings()
          .then(() => {
            return api.get<ApiResponse<Book>>(`/api/stok/takeByBarkod/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              },
              params: {
                cari_id: 2,
                belgekod: 30
              }
            });
          });
      })
      .then(response => {
        const bookData = response.data?.KiboApp?.Response?.data;
        if (!bookData || Object.keys(bookData).length === 0) {
          throw new Error('Kitap detayları alınamadı');
        }

        return bookData; 
      });
  },

  getBookByBarcode: (barcode: string): Promise<ApiResponse<Book>> => {
    return getStoredToken()
      .then(token => {
        if (!token) {
          throw new Error('Token bulunamadı');
        }

        return api.get<ApiResponse<Book>>(`/api/stok/takeByBarkod/${barcode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            cari_id: 2,
            belgekod: 30
          }
        });
      })
      .then(response => response.data);
  }
};

export default api; 