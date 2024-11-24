# Указываем базовый образ
FROM node:22.11.0

# Устанавливаем рабочую директорию
WORKDIR /ChatFrontend

# Создаем директории для SSL сертификатов
RUN mkdir -p /etc/ssl/private /etc/ssl/certs

# Копируем package.json и package-lock.json из подкаталога
COPY ./chat/package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все файлы из подкаталога в контейнер
COPY ./chat .

# Собираем приложение
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 3000 3001

# Запускаем приложение
CMD ["npm", "start"]