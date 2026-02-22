import sys
import os
from alembic.config import Config
from alembic import command

print("Текущая папка:", os.getcwd())
print("Файлы в папке:", os.listdir('.'))

# Проверим наличие alembic.ini
if os.path.exists('alembic.ini'):
    print("✅ alembic.ini найден")
    
    # Прочитаем его
    with open('alembic.ini', 'r', encoding='utf-8') as f:
        content = f.read()
        print("Первые 200 символов alembic.ini:")
        print(content[:200])
else:
    print("❌ alembic.ini НЕ НАЙДЕН!")

# Попробуем создать миграцию программно
try:
    alembic_cfg = Config("alembic.ini")
    command.revision(alembic_cfg, autogenerate=True, message="Test migration")
    print("✅ Миграция создана успешно!")
except Exception as e:
    print(f"❌ Ошибка: {e}")