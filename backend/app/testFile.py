from config import settings
import binascii

print(f"DB_USER: {settings.DB_USER}")
print(f"DB_PASSWORD: {settings.DB_PASSWORD}")
print(f"DB_HOST: {settings.DB_HOST}")
print(f"DB_PORT: {settings.DB_PORT}")
print(f"DB_NAME: {settings.DB_NAME}")
print(f"DB_URL: {settings.get_db_url()}")

# Проверим байты пароля
pwd_bytes = settings.DB_PASSWORD.encode('utf-8')
print(f"Пароль в байтах: {binascii.hexlify(pwd_bytes)}")