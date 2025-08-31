import { setupURLPolyfill } from 'react-native-url-polyfill';
import { Platform } from 'react-native';

// Настройка URL полифилла для React Native
if (Platform.OS !== 'web') {
  setupURLPolyfill();
}
import { createClient } from '@supabase/supabase-js';
import config from './config';

// Создание Supabase клиента
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      // Автоматическое обновление токенов
      autoRefreshToken: true,
      // Сохранение сессии
      persistSession: true,
      // Обработка URL для OAuth
      detectSessionInUrl: false,
    },
    // Настройки для React Native
    global: {
      headers: {
        'X-Client-Info': 'flow-max-react-native',
      },
    },
    // Настройки real-time
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Экспорт типов Supabase
export type { User, Session, AuthError } from '@supabase/supabase-js';

// Функция для проверки подключения
export const testSupabaseConnection = async () => {
  try {
    // Сначала проверяем базовое подключение
    console.log('🔍 Тестирование подключения к Supabase...');
    console.log('URL:', config.supabase.url);
    console.log('Anon Key:', config.supabase.anonKey ? '***' + config.supabase.anonKey.slice(-4) : 'не установлен');
    
    // Проверяем, что URL и ключ установлены
    if (!config.supabase.url || config.supabase.url === 'your_supabase_project_url_here') {
      throw new Error('SUPABASE_URL не установлен');
    }
    
    if (!config.supabase.anonKey || config.supabase.anonKey === 'your_anon_key_here') {
      throw new Error('SUPABASE_ANON_KEY не установлен');
    }
    
    // Пробуем простой запрос к базе данных
    const { data, error } = await supabase.from('test').select('count').limit(1);
    
    if (error) {
      // Если таблица profiles не существует, это нормально для нового проекта
      if (error.code === 'PGRST205') {
        console.log('✅ Supabase подключение успешно! (таблица profiles еще не создана)');
        return true;
      }
      throw error;
    }
    
    console.log('✅ Supabase подключение успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к Supabase:', error);
    return false;
  }
};

// Функция для получения текущего пользователя
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    return null;
  }
};

// Функция для получения текущей сессии
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Ошибка получения сессии:', error);
    return null;
  }
};

export default supabase;
