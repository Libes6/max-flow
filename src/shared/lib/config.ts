import { 
  PUBLIC_SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  SUPABASE_SERVICE_ROLE_KEY 
} from '@env';

export const config = {
  supabase: {
    url: PUBLIC_SUPABASE_URL || 'your_supabase_project_url_here',
    anonKey: SUPABASE_ANON_KEY || 'your_anon_key_here',
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here',
  },

  // Environment
  env: 'development',
  isDevelopment: false,
  isProduction: true,

  // App Configuration
  app: {
    name: 'Flow Max',
    version: '1.0.0',
  },

  // API Configuration
  api: {
    timeout: 30000,
    retryAttempts: 3,
  },

  // Sync Configuration
  sync: {
    batchSize: 50,
    interval: 300000, // 5 minutes
    maxOfflineQueueSize: 1000,
  },

  // Feature Flags
  features: {
    vkOAuth: false,
    telegramOAuth: false,
    yandexOAuth: false,
  },
};

// Проверка обязательных переменных в продакшене
if (config.isProduction) {
  if (!config.supabase.url || config.supabase.url === 'your_supabase_project_url_here') {
    throw new Error('PUBLIC_SUPABASE_URL is required in production');
  }
  if (!config.supabase.anonKey || config.supabase.anonKey === 'your_anon_key_here') {
    throw new Error('SUPABASE_ANON_KEY is required in production');
  }
}

export default config;
