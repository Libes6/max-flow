# Настройка переменных окружения

## Создание .env файла

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Заполните переменные в `.env` файле:

### Sentry
```env
SENTRY_DSN=https://your-sentry-dsn-here
```

### Firebase (опционально, основная конфигурация в google-services.json)
```env
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
FIREBASE_APP_ID=your_firebase_app_id_here
```

### Firebase Server Key (для отправки пушей)
```env
FCM_SERVER_KEY=your_fcm_server_key_here
```

## Получение FCM Server Key

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в Project Settings (шестеренка)
4. Во вкладке "Cloud Messaging" найдите "Server key"

## Важно

- **НЕ** коммитьте `.env` файл в git
- `.env` уже добавлен в `.gitignore`
- Используйте `.env.example` как шаблон для других разработчиков
- Все чувствительные данные теперь вынесены в переменные окружения

## Проверка

При запуске приложения проверьте консоль на предупреждения о недостающих переменных окружения.
