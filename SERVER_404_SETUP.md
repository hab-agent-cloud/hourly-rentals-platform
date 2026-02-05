# Настройка корректного HTTP 404 для Яндекса

## Проблема
Single Page Application (SPA) на React всегда возвращает код 200, даже для несуществующих страниц. Это мешает корректной индексации Яндексом.

## Решение

### 1. Создана статическая страница 404
- Файл: `public/404.html`
- Содержит красивый дизайн с логотипом 120 МИНУТ
- Добавлен мета-тег `<meta name="robots" content="noindex, nofollow">`

### 2. Настройка для разных хостингов

#### Для Nginx (рекомендуется)
Добавить в конфигурацию nginx:

```nginx
server {
    listen 80;
    server_name 120minut.ru;
    root /var/www/120minut;
    index index.html;

    # Обработка 404 для несуществующих файлов
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Для API/backend - прямой проброс
    location /api/ {
        proxy_pass http://backend;
    }

    # Статические файлы с кэшированием
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|json)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Обработка несуществующих маршрутов SPA
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

#### Для Apache (.htaccess)
Создать файл `public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Если файл существует - отдаём его
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Если директория существует - отдаём её
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Все остальные запросы - на index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Обработка 404
ErrorDocument 404 /404.html

# Кэширование
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

#### Для Netlify
Файлы уже созданы:
- `public/_redirects` - правила маршрутизации
- `public/_headers` - заголовки для кэширования

Netlify автоматически использует эти файлы.

#### Для Vercel
Создать `vercel.json` в корне проекта:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|svg|ico|json|woff|woff2|ttf))",
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*\\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. Проверка корректности настройки

После деплоя проверьте:

1. **Тест существующей страницы:**
   ```bash
   curl -I https://120minut.ru/
   # Должен вернуть: HTTP/1.1 200 OK
   ```

2. **Тест несуществующей страницы:**
   ```bash
   curl -I https://120minut.ru/nesushchestvuyushchaya-stranica
   # Должен вернуть: HTTP/1.1 404 Not Found
   ```

3. **Проверка в браузере:**
   - Откройте https://120minut.ru/test-404
   - Откройте DevTools (F12) → вкладка Network
   - Должен показать статус: `404 Not Found`

### 4. Проверка в Яндекс.Вебмастер

1. Зайдите в Яндекс.Вебмастер → Диагностика сайта
2. Через 1-2 дня рекомендация о 404 должна исчезнуть
3. Проверьте раздел "Проверка ответа сервера":
   - Введите несуществующий URL
   - Должен показать статус 404

## Дополнительные файлы

Созданные файлы для корректной работы:

1. ✅ `public/404.html` - красивая страница 404 с дизайном бренда
2. ✅ `public/_redirects` - правила для Netlify/Cloudflare Pages
3. ✅ `public/_headers` - заголовки для кэширования

## Важно для SPA

В React-приложении страница 404 (`src/pages/NotFound.tsx`) показывается только для клиентского роутинга. Для правильной работы с поисковыми ботами нужна серверная конфигурация выше.

## Что дальше?

После настройки сервера:

1. Задеплойте изменения
2. Проверьте curl-запросами (см. раздел "Проверка")
3. Подождите 1-2 дня
4. Проверьте Яндекс.Вебмастер → Диагностика
5. Отправьте главную на переобход (если нужно)
