import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../shared/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { LoginFormData, RegisterFormData } from './auth-schemas';
import { authCache, type CachedUserProfile } from './auth-cache';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Функция для принудительной инициализации состояния
  const initializeAuth = async () => {
    console.log('🚀 Initializing auth state...');
    try {
      // Получаем сессию от Supabase (теперь использует MMKV)
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error during auth initialization:', error);
        setIsLoading(false);
        return;
      }
      
      console.log('✅ Auth initialized, session:', session ? 'exists' : 'null');
      
      // Обновляем React Query
      queryClient.setQueryData(['auth', 'session'], session);
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      setIsLoading(false);
    }
  };

  const { data: session } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      console.log('🔄 Fetching session...');
      
      // Получаем сессию от Supabase (теперь использует MMKV)
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error fetching session:', error);
        throw error;
      }
      
      console.log('✅ Session fetched from Supabase:', session ? 'exists' : 'null');
      
      return session;
    },
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: false, // Не повторяем запрос при ошибке
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<AuthUser | null> => {
      if (!session?.user) {
        console.log('🔍 No session user found');
        return null;
      }
      
      console.log('🔍 Fetching user profile for:', session.user.id);
      
      // Получаем профиль от Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }
      
      console.log('✅ User profile data from Supabase:', data);
      
      if (data) {
        return {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          avatarUrl: data.avatar_url,
        };
      }
      
      return null;
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: false, // Не повторяем запрос при ошибке
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      console.log('🔐 Attempting login for:', credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error('❌ Login error from Supabase:', error);
        
        // Обрабатываем случай с неподтвержденным email
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Пожалуйста, подтвердите ваш email перед входом. Проверьте почту и перейдите по ссылке подтверждения.');
        }
        
        throw error;
      }
      
      console.log('✅ Login successful from Supabase:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Login mutation success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterFormData) => {
      console.log('📝 Starting registration for:', userData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });
      if (error) {
        console.error('❌ Registration error:', error);
        throw error;
      }
      
      console.log('✅ Registration successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Registration mutation success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const resendConfirmationMutation = useMutation({
    mutationFn: async (email: string) => {
      console.log('📧 Resending confirmation email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        console.error('❌ Resend confirmation error:', error);
        throw error;
      }
      
      console.log('✅ Confirmation email resent successfully');
    },
  });

  useEffect(() => {
    console.log('🚀 Setting up auth state listener...');
    
    // Инициализируем состояние при первом запуске
    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session ? 'session exists' : 'no session');
        
        // Обновляем состояние загрузки
        setIsLoading(false);
        
        // Обновляем React Query
        queryClient.setQueryData(['auth', 'session'], session);
        
        if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          queryClient.setQueryData(['auth', 'user'], null);
        }
        
        // Обрабатываем события регистрации и входа
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('✅ User signed in or token refreshed');
          queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        }
        
        // Обрабатываем инициализацию приложения
        if (event === 'INITIAL_SESSION') {
          console.log('🎯 Initial session loaded');
          if (session) {
            console.log('👤 User is already authenticated');
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
          } else {
            console.log('👤 No authenticated user found');
          }
        }
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Определяем общее состояние загрузки
  const isOverallLoading = isLoading || (!!session?.user && isUserLoading);

  return {
    user,
    session,
    isLoading: isOverallLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoginLoading: loginMutation.isPending,
    register: registerMutation.mutate,
    registerError: registerMutation.error,
    isRegisterLoading: registerMutation.isPending,
    logout: logoutMutation.mutate,
    logoutError: logoutMutation.error,
    isLogoutLoading: logoutMutation.isPending,
    resendConfirmation: resendConfirmationMutation.mutate,
    resendConfirmationError: resendConfirmationMutation.error,
    isResendConfirmationLoading: resendConfirmationMutation.isPending,
    refreshAuth: initializeAuth, // Функция для принудительного обновления
  };
};
