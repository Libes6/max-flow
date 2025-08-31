#!/usr/bin/env python3
"""
Скрипт для генерации иконок приложения Flow Max
Создает PNG иконки разных размеров для Android и iOS
"""

from PIL import Image, ImageDraw
import os

def create_icon(size, output_path):
    """Создает иконку заданного размера"""
    # Создаем новое изображение с прозрачным фоном
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Вычисляем масштаб
    scale = size / 1024
    offset = int(size * 0.2)
    
    # Рисуем фон с закругленными углами
    draw.rounded_rectangle([0, 0, size, size], radius=int(size * 0.2), 
                          fill=(52, 152, 219, 255))  # #3498DB
    
    # Рисуем котика (упрощенная версия)
    cat_center_x = int(312 * scale) + offset
    cat_center_y = int(280 * scale) + offset
    cat_radius = int(120 * scale)
    
    # Тело котика
    body_width = int(180 * scale)
    body_height = int(200 * scale)
    draw.ellipse([cat_center_x - body_width//2, cat_center_y + cat_radius - body_height//2,
                   cat_center_x + body_width//2, cat_center_y + cat_radius + body_height//2],
                  fill=(74, 144, 226, 255))  # #4A90E2
    
    # Голова
    draw.ellipse([cat_center_x - cat_radius, cat_center_y - cat_radius,
                   cat_center_x + cat_radius, cat_center_y + cat_radius],
                  fill=(74, 144, 226, 255))  # #4A90E2
    
    # Глаза
    eye_radius = int(25 * scale)
    left_eye_x = cat_center_x - int(32 * scale)
    right_eye_x = cat_center_x + int(32 * scale)
    eye_y = cat_center_y - int(20 * scale)
    
    # Белки глаз
    draw.ellipse([left_eye_x - eye_radius, eye_y - eye_radius,
                   left_eye_x + eye_radius, eye_y + eye_radius],
                  fill=(255, 255, 255, 255))
    draw.ellipse([right_eye_x - eye_radius, eye_y - eye_radius,
                   right_eye_x + eye_radius, eye_y + eye_radius],
                  fill=(255, 255, 255, 255))
    
    # Зрачки
    pupil_radius = int(15 * scale)
    draw.ellipse([left_eye_x - pupil_radius, eye_y - pupil_radius,
                   left_eye_x + pupil_radius, eye_y + pupil_radius],
                  fill=(44, 62, 80, 255))  # #2C3E50
    draw.ellipse([right_eye_x - pupil_radius, eye_y - pupil_radius,
                   right_eye_x + pupil_radius, eye_y + pupil_radius],
                  fill=(44, 62, 80, 255))  # #2C3E50
    
    # Нос
    nose_size = int(12 * scale)
    nose_points = [
        (cat_center_x, cat_center_y + int(10 * scale)),
        (cat_center_x - nose_size, cat_center_y + int(20 * scale)),
        (cat_center_x + nose_size, cat_center_y + int(20 * scale))
    ]
    draw.polygon(nose_points, fill=(231, 76, 60, 255))  # #E74C3C
    
    # Сохраняем изображение
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG')
    print(f"Создана иконка: {output_path}")

def main():
    """Основная функция"""
    print("Генерация иконок для Flow Max...")
    
    # Размеры для Android
    android_sizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    }
    
    # Создаем иконки для Android
    for folder, size in android_sizes.items():
        output_path = f"android/app/src/main/res/{folder}/ic_launcher.png"
        create_icon(size, output_path)
    
    # Создаем иконку для iOS (1024x1024)
    ios_path = "ios/Flow_Max/Images.xcassets/AppIcon.appiconset/Icon-1024.png"
    create_icon(1024, ios_path)
    
    print("Все иконки созданы успешно!")
    print("\nДля использования:")
    print("1. Скопируйте сгенерированные PNG файлы в соответствующие папки")
    print("2. Для Android: android/app/src/main/res/mipmap-*/")
    print("3. Для iOS: ios/Flow_Max/Images.xcassets/AppIcon.appiconset/")

if __name__ == "__main__":
    main()
