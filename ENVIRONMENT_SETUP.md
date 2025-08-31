# Настройка переменных окружения для Supabase

## 🔐 Создание .env файла

Создайте файл `.env` в корне проекта со следующим содержимым:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Environment
NODE_ENV=development

# App Configuration
APP_NAME=Flow Max
APP_VERSION=1.0.0

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Sync Configuration
SYNC_BATCH_SIZE=50
SYNC_INTERVAL=300000
MAX_OFFLINE_QUEUE_SIZE=1000

# Feature Flags
ENABLE_VK_OAUTH=false
ENABLE_TELEGRAM_OAUTH=false
ENABLE_YANDEX_OAUTH=false
```

## 📍 Получение Supabase ключей

### 1. Перейдите в [Supabase Dashboard](https://app.supabase.com)
### 2. Выберите ваш проект
### 3. Перейдите в Settings → API
### 4. Скопируйте:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 🛡️ Безопасность

### Важно:
- ✅ **НЕ коммитьте** `.env` файл в Git
- ✅ **Добавьте** `.env` в `.gitignore`
- ✅ **Используйте** `.env.example` для документации
- ✅ **Храните** ключи в безопасном месте

### .gitignore обновление:
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.staging

# Но оставьте пример
!.env.example
```

## 🔄 Окружения

### Development (.env.development)
```bash
NODE_ENV=development
SUPABASE_URL=https://dev-project.supabase.co
ENABLE_VK_OAUTH=false
```

### Production (.env.production)
```bash
NODE_ENV=production
SUPABASE_URL=https://prod-project.supabase.co
ENABLE_VK_OAUTH=true
```

### Staging (.env.staging)
```bash
NODE_ENV=staging
SUPABASE_URL=https://staging-project.supabase.co
ENABLE_VK_OAUTH=false
```

## 📱 React Native специфика

### Для React Native используйте:
```bash
# Установите react-native-dotenv
npm install react-native-dotenv

# Добавьте в babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
};
```

### Импорт в коде:
```typescript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
```

## 🚀 Автоматизация

### Скрипт для создания .env:
```bash
#!/bin/bash
# create-env.sh

echo "Создание .env файла..."

cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Environment
NODE_ENV=development

# App Configuration
APP_NAME=Flow Max
APP_VERSION=1.0.0

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Sync Configuration
SYNC_BATCH_SIZE=50
SYNC_INTERVAL=300000
MAX_OFFLINE_QUEUE_SIZE=1000

# Feature Flags
ENABLE_VK_OAUTH=false
ENABLE_TELEGRAM_OAUTH=false
ENABLE_YANDEX_OAUTH=false
EOF

echo ".env файл создан!"
echo "Не забудьте заполнить реальные значения!"
```

## ✅ Проверка настройки

### Тест подключения:
```typescript
import { createClient } from '@supabase/supabase-js';
import config from './src/shared/lib/config';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// Тест подключения
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase подключение успешно!');
  } catch (error) {
    console.error('❌ Ошибка подключения к Supabase:', error);
  }
};

testConnection();
```

## 🔧 Troubleshooting

### Частые проблемы:

1. **"Invalid API key"**
   - Проверьте правильность `SUPABASE_ANON_KEY`
   - Убедитесь, что ключ не содержит лишних символов

2. **"Invalid URL"**
   - Проверьте формат `SUPABASE_URL`
   - Должен быть: `https://project-id.supabase.co`

3. **"Environment variables not loaded"**
   - Убедитесь, что `.env` файл в корне проекта
   - Перезапустите Metro bundler

4. **"Permission denied"**
   - Проверьте RLS политики в Supabase
   - Убедитесь, что пользователь аутентифицирован

## 📚 Дополнительные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Environment Variables](https://github.com/goatandsheep/react-native-dotenv)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)

---

**Автор:** AI Assistant  
**Дата создания:** 2024-12-19  
**Версия:** 1.0  
**Статус:** Готово к использованию
