import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import { mmkv } from '../../../shared/lib/mmkv';

export interface ProfileData {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setProfile: (profile: ProfileData | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  loadProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    email?: string;
    avatar?: string;
  }) => Promise<void>;
  clearProfile: () => void;
}

const PROFILE_CACHE_KEY = 'cached_profile';

export const useProfileStore = create<ProfileState>((set, get) => {
  // Инициализация из кэша при создании store
  const initializeFromCache = () => {
    const cachedProfile = mmkv.getString(PROFILE_CACHE_KEY);
    if (cachedProfile) {
      try {
        const parsedProfile = JSON.parse(cachedProfile);
        console.log('📋 Инициализация профиля из кэша при запуске');
        return {
          profile: parsedProfile,
          loading: false,
          initialized: true,
        };
      } catch (error) {
        console.error('Ошибка парсинга кэшированного профиля:', error);
        mmkv.delete(PROFILE_CACHE_KEY);
      }
    }
    return {
      profile: null,
      loading: false,
      initialized: false,
    };
  };

  return {
    ...initializeFromCache(),

  setProfile: (profile) => {
    set({ profile });
    // Кэшируем профиль в MMKV
    if (profile) {
      mmkv.set(PROFILE_CACHE_KEY, JSON.stringify(profile));
    } else {
      mmkv.delete(PROFILE_CACHE_KEY);
    }
  },

  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  loadProfile: async (userId: string) => {
    const { profile, initialized } = get();
    
    // Если профиль уже загружен для этого пользователя, не загружаем повторно
    if (profile && profile.userId === userId && initialized) {
      console.log('📋 Профиль уже загружен, используем кэш');
      return;
    }

    set({ loading: true });

    try {
      // Сначала пробуем загрузить из кэша
      const cachedProfile = mmkv.getString(PROFILE_CACHE_KEY);
      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile);
        if (parsedProfile.userId === userId) {
          console.log('📋 Загружаем профиль из кэша');
          set({ profile: parsedProfile, loading: false, initialized: true });
          return;
        }
      }

      console.log('📋 Загружаем профиль с сервера');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const profileData: ProfileData = {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set({ profile: profileData, initialized: true });
        mmkv.set(PROFILE_CACHE_KEY, JSON.stringify(profileData));
      } else {
        // Создаем профиль если его нет
        await get().createProfile(userId);
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      set({ loading: false });
    }
  },

  createProfile: async (userId: string) => {
    try {
      console.log('📋 Создаем новый профиль');
      
      const profileData = {
        user_id: userId,
        name: 'Пользователь',
        email: '',
        avatar: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;

      const newProfile: ProfileData = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      set({ profile: newProfile, initialized: true });
      mmkv.set(PROFILE_CACHE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Ошибка создания профиля:', error);
    }
  },

  updateProfile: async (updates: {
    name?: string;
    email?: string;
    avatar?: string;
  }) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const updatedProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      set({ profile: updatedProfile });

      // Обновляем в базе данных
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedProfile.name,
          email: updatedProfile.email,
          avatar: updatedProfile.avatar,
          updated_at: updatedProfile.updatedAt,
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Обновляем кэш
      mmkv.set(PROFILE_CACHE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  },

  clearProfile: () => {
    set({ profile: null, initialized: false });
    mmkv.delete(PROFILE_CACHE_KEY);
  },
  };
});
