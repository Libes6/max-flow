import React, { useEffect } from 'react';
import { useAuth } from '../../features/auth/model/useAuth';
import { useProfileStore } from '../../features/profile/model/useProfileStore';

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { loadProfile, initialized } = useProfileStore();

  useEffect(() => {
    if (user && !initialized) {
      console.log('🚀 Инициализация профиля при запуске приложения');
      loadProfile(user.id);
    } else if (user && initialized) {
      console.log('📋 Профиль уже инициализирован из кэша');
    }
  }, [user, initialized, loadProfile]);

  return <>{children}</>;
};
