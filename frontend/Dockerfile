# Стадия 1: Сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы с зависимостями
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем проект (появится папка dist)
RUN npm run build

# Стадия 2: Раздача статики через Nginx
FROM nginx:alpine

# Копируем собранные файлы из первой стадии
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx (если нужно)
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]