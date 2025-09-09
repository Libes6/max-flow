import { mmkv } from '../../../shared/lib/mmkv';
import type { Session } from '@supabase/supabase-js';

const AUTH_CACHE_KEYS = {
  SESSION: 'auth_session',
  USER_PROFILE: 'auth_user_profile',
  LAST_SYNC: 'auth_last_sync',
} as const;

export interface CachedUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  cachedAt: number;
}

export interface CachedSession {
  session: Session | null;
  cachedAt: number;
}

export const authCache = {
  // Сохранение сессии
  setSession: (session: Session | null) => {
    try {
      const cachedSession: CachedSession = {
        session,
        cachedAt: Date.now(),
      };
      mmkv.set(AUTH_CACHE_KEYS.SESSION, JSON.stringify(cachedSession));
      console.log('💾 Session cached:', session ? 'exists' : 'null');
    } catch (error) {
      console.error('❌ Failed to cache session:', error);
    }
  },

  // Получение сессии
  getSession: (): Session | null => {
    try {
      const cached = mmkv.getString(AUTH_CACHE_KEYS.SESSION);
      if (!cached) {
        console.log('🔍 No cached session found');
        return null;
      }

      const cachedSession: CachedSession = JSON.parse(cached);
      const now = Date.now();
      const cacheAge = now - cachedSession.cachedAt;
      
      // Кэш действителен 24 часа
      if (cacheAge > 24 * 60 * 60 * 1000) {
        console.log('⏰ Cached session expired, removing');
        authCache.clearSession();
        return null;
      }

      console.log('📦 Retrieved cached session:', cachedSession.session ? 'exists' : 'null');
      return cachedSession.session;
    } catch (error) {
      console.error('❌ Failed to retrieve cached session:', error);
      return null;
    }
  },

  // Сохранение профиля пользователя
  setUserProfile: (profile: CachedUserProfile | null) => {
    try {
      if (profile) {
        profile.cachedAt = Date.now();
        mmkv.set(AUTH_CACHE_KEYS.USER_PROFILE, JSON.stringify(profile));
        console.log('💾 User profile cached:', profile.email);
      } else {
        mmkv.delete(AUTH_CACHE_KEYS.USER_PROFILE);
        console.log('🗑️ User profile cache cleared');
      }
    } catch (error) {
      console.error('❌ Failed to cache user profile:', error);
    }
  },

  // Получение профиля пользователя
  getUserProfile: (): CachedUserProfile | null => {
    try {
      const cached = mmkv.getString(AUTH_CACHE_KEYS.USER_PROFILE);
      if (!cached) {
        console.log('🔍 No cached user profile found');
        return null;
      }

      const profile: CachedUserProfile = JSON.parse(cached);
      const now = Date.now();
      const cacheAge = now - profile.cachedAt;
      
      // Кэш профиля действителен 1 час
      if (cacheAge > 60 * 60 * 1000) {
        console.log('⏰ Cached user profile expired, removing');
        authCache.setUserProfile(null);
        return null;
      }

      console.log('📦 Retrieved cached user profile:', profile.email);
      return profile;
    } catch (error) {
      console.error('❌ Failed to retrieve cached user profile:', error);
      return null;
    }
  },

  // Очистка сессии
  clearSession: () => {
    try {
      mmkv.delete(AUTH_CACHE_KEYS.SESSION);
      console.log('🗑️ Session cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear session cache:', error);
    }
  },

  // Очистка профиля пользователя
  clearUserProfile: () => {
    try {
      mmkv.delete(AUTH_CACHE_KEYS.USER_PROFILE);
      console.log('🗑️ User profile cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear user profile cache:', error);
    }
  },

  // Очистка всего кэша авторизации
  clearAll: () => {
    try {
      mmkv.delete(AUTH_CACHE_KEYS.SESSION);
      mmkv.delete(AUTH_CACHE_KEYS.USER_PROFILE);
      mmkv.delete(AUTH_CACHE_KEYS.LAST_SYNC);
      console.log('🗑️ All auth cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear auth cache:', error);
    }
  },

  // Установка времени последней синхронизации
  setLastSync: () => {
    try {
      mmkv.set(AUTH_CACHE_KEYS.LAST_SYNC, Date.now());
    } catch (error) {
      console.error('❌ Failed to set last sync time:', error);
    }
  },

  // Получение времени последней синхронизации
  getLastSync: (): number | null => {
    try {
      const lastSync = mmkv.getNumber(AUTH_CACHE_KEYS.LAST_SYNC);
      return lastSync || null;
    } catch (error) {
      console.error('❌ Failed to get last sync time:', error);
      return null;
    }
  },
};
