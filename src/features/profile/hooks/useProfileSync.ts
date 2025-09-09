import { useEffect } from 'react';
import { useAuth } from '../../auth/model/useAuth';
import { useProfileStore } from '../model/useProfileStore';

export const useProfileSync = () => {
  const { user } = useAuth();
  const { 
    profile, 
    loading, 
    initialized,
    loadProfile, 
    updateProfile, 
    clearProfile 
  } = useProfileStore();

  // Инициализация профиля при изменении пользователя
  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    } else {
      clearProfile();
    }
  }, [user, loadProfile, clearProfile]);

  return {
    profile,
    loading,
    initialized,
    updateProfile,
    refreshProfile: () => user ? loadProfile(user.id) : Promise.resolve(),
  };
};