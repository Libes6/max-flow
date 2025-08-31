#!/usr/bin/env node
/**
 * Скрипт для генерации иконок приложения Flow Max
 * Создает простые PNG иконки разных размеров для Android и iOS
 */

const fs = require('fs');
const path = require('path');

// Простая функция для создания базовой иконки
function createSimpleIcon(size) {
    // Создаем простую иконку как base64 строку
    // Это будет простой синий квадрат с закругленными углами
    const canvas = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3498DB;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2980B9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1F4E79;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Фон -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  
  <!-- Котик (упрощенный) -->
  <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size * 0.6 / 1024})">
    <!-- Тело -->
    <ellipse cx="312" cy="400" rx="180" ry="200" fill="#4A90E2"/>
    
    <!-- Голова -->
    <circle cx="312" cy="280" r="120" fill="#4A90E2"/>
    
    <!-- Глаза -->
    <circle cx="280" cy="260" r="25" fill="white"/>
    <circle cx="344" cy="260" r="25" fill="white"/>
    <circle cx="280" cy="260" r="15" fill="#2C3E50"/>
    <circle cx="344" cy="260" r="15" fill="#2C3E50"/>
    
    <!-- Нос -->
    <path d="M 312 290 L 300 300 L 324 300 Z" fill="#E74C3C"/>
    
    <!-- Лапки -->
    <ellipse cx="250" cy="580" rx="30" ry="40" fill="#357ABD"/>
    <ellipse cx="374" cy="580" rx="30" ry="40" fill="#357ABD"/>
  </g>
</svg>`;

    return canvas;
}

// Функция для создания папок
function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

// Основная функция
function main() {
    console.log('Генерация иконок для Flow Max...');
    
    // Размеры для Android
    const androidSizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    };
    
    // Создаем иконки для Android
    for (const [folder, size] of Object.entries(androidSizes)) {
        const outputPath = path.join('android', 'app', 'src', 'main', 'res', folder, 'ic_launcher.svg');
        ensureDirectoryExists(outputPath);
        
        const iconSvg = createSimpleIcon(size);
        fs.writeFileSync(outputPath, iconSvg);
        console.log(`Создана иконка: ${outputPath}`);
    }
    
    // Создаем иконку для iOS
    const iosPath = path.join('ios', 'Flow_Max', 'Images.xcassets', 'AppIcon.appiconset', 'Icon-1024.svg');
    ensureDirectoryExists(iosPath);
    
    const iosIconSvg = createSimpleIcon(1024);
    fs.writeFileSync(iosPath, iosIconSvg);
    console.log(`Создана иконка: ${iosPath}`);
    
    console.log('\nВсе иконки созданы успешно!');
    console.log('\nДля использования:');
    console.log('1. SVG иконки созданы в соответствующих папках');
    console.log('2. Для Android: android/app/src/main/res/mipmap-*/');
    console.log('3. Для iOS: ios/Flow_Max/Images.xcassets/AppIcon.appiconset/');
    console.log('\nПримечание: Это SVG иконки. Для продакшена нужно конвертировать в PNG.');
}

// Запускаем скрипт
if (require.main === module) {
    main();
}

module.exports = { createSimpleIcon, ensureDirectoryExists };
