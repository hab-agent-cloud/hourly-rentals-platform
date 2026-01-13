# Система логирования действий сотрудников

## Обзор

Система автоматически логирует все действия сотрудников (админов) в админ-панели, включая добавление, редактирование и удаление объектов.

## Структура базы данных

### Таблица admin_action_logs

```sql
CREATE TABLE t_p39732784_hourly_rentals_platf.admin_action_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    entity_name TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Поля:**
- `admin_id` - ID сотрудника из таблицы admins
- `action_type` - Тип действия: create, update, delete, view
- `entity_type` - Тип сущности: listing, owner, employee, subscription
- `entity_id` - ID сущности
- `entity_name` - Название сущности для отображения
- `description` - Текстовое описание действия
- `metadata` - Дополнительные данные в JSON (цена, город, тип и т.д.)
- `created_at` - Дата и время действия

**Индексы:**
- `idx_admin_action_logs_admin_id` - по ID сотрудника
- `idx_admin_action_logs_created_at` - по дате создания
- `idx_admin_action_logs_action_type` - по типу действия

## API Endpoints

### GET /admin-employees

Получить список всех сотрудников с количеством действий:

```typescript
const employees = await api.getEmployees(token);
```

Ответ:
```json
[
  {
    "id": 3,
    "email": "elizaveta@120min.ru",
    "name": "Елизавета",
    "login": "89636667256",
    "role": "employee",
    "permissions": {"owners": false, "listings": true, "settings": false},
    "is_active": true,
    "created_at": "2026-01-13T15:10:55.658690",
    "last_login": "2026-01-13T19:54:12.610154",
    "action_count": 5
  }
]
```

### GET /admin-employees?employee_id={id}

Получить детали сотрудника с историей действий:

```typescript
const data = await api.getEmployeeDetails(token, employeeId);
```

Ответ:
```json
{
  "employee": {
    "id": 3,
    "email": "elizaveta@120min.ru",
    "name": "Елизавета",
    ...
  },
  "actions": [
    {
      "id": 1,
      "admin_id": 3,
      "action_type": "create",
      "entity_type": "listing",
      "entity_id": 20,
      "entity_name": "Гостиница Премьер",
      "description": "Добавлен новый объект \"Гостиница Премьер\" в городе Москва",
      "metadata": {
        "type": "hotel",
        "city": "Москва",
        "district": "Центральный",
        "price": 5000
      },
      "created_at": "2026-01-13T20:30:15.123456"
    }
  ]
}
```

## Логирование в backend функциях

### backend/admin-listings/index.py

При создании объекта автоматически создается запись в логе:

```python
# После создания listing
cur.execute("""
    INSERT INTO t_p39732784_hourly_rentals_platf.admin_action_logs 
    (admin_id, action_type, entity_type, entity_id, entity_name, description, metadata)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
""", (
    admin.get('admin_id'),
    'create',
    'listing',
    listing_id,
    body['title'],
    f'Добавлен новый объект "{body["title"]}" в городе {body["city"]}',
    json.dumps({
        'type': body['type'],
        'city': body['city'],
        'district': body['district'],
        'price': body['price']
    })
))
```

## UI компонент

### AdminEmployeesTab.tsx

**Основные функции:**

1. **Отображение сотрудников с счетчиком действий:**
   - Карточки всех сотрудников
   - Badge с количеством действий
   - Кнопка "История" для просмотра

2. **Диалог истории действий:**
   - Информация о сотруднике
   - Список всех действий с деталями
   - Иконки по типу действия (create, update, delete)
   - Временные метки в читаемом формате

**Пример использования:**

```tsx
<AdminEmployeesTab token={adminToken} />
```

## Типы действий

### create (Создание)
- **Цвет:** Зеленый
- **Иконка:** Plus
- **Примеры:** Добавление объекта, создание владельца

### update (Обновление)
- **Цвет:** Синий
- **Иконка:** Edit
- **Примеры:** Изменение позиции, обновление данных

### delete (Удаление)
- **Цвет:** Красный
- **Иконка:** Trash2
- **Примеры:** Архивация объекта, удаление сотрудника

## Примеры запросов

### Получить все действия сотрудника

```sql
SELECT 
    l.id, l.action_type, l.entity_type, l.entity_id, 
    l.entity_name, l.description, l.created_at, l.metadata
FROM t_p39732784_hourly_rentals_platf.admin_action_logs l
WHERE l.admin_id = 3
ORDER BY l.created_at DESC
LIMIT 100;
```

### Статистика по типам действий

```sql
SELECT 
    action_type, 
    COUNT(*) as count
FROM t_p39732784_hourly_rentals_platf.admin_action_logs
WHERE admin_id = 3
GROUP BY action_type;
```

### Последние добавленные объекты сотрудником

```sql
SELECT 
    entity_name, 
    created_at,
    metadata->>'city' as city,
    metadata->>'price' as price
FROM t_p39732784_hourly_rentals_platf.admin_action_logs
WHERE admin_id = 3 
  AND action_type = 'create' 
  AND entity_type = 'listing'
ORDER BY created_at DESC
LIMIT 10;
```

## Рекомендации

1. **Регулярная очистка:** Архивируйте старые записи (> 6 месяцев) для оптимизации
2. **Мониторинг:** Отслеживайте подозрительные активности (массовые удаления)
3. **Бэкапы:** Включайте таблицу логов в регулярные бэкапы
4. **Аудит:** Используйте для расследования инцидентов и разбора конфликтов

## Расширение системы

### Добавление логирования в новую функцию

```python
# После выполнения действия
cur.execute("""
    INSERT INTO t_p39732784_hourly_rentals_platf.admin_action_logs 
    (admin_id, action_type, entity_type, entity_id, entity_name, description, metadata)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
""", (
    admin_id,           # ID из JWT токена
    'update',           # Тип действия
    'subscription',     # Тип сущности
    listing_id,         # ID сущности
    listing_title,      # Название для отображения
    f'Продлена подписка на 30 дней',  # Описание
    json.dumps({'days': 30, 'cost': 2000})  # Метаданные
))
```

## Безопасность

- Таблица логов доступна только для чтения обычным сотрудникам
- Только superadmin может просматривать логи всех сотрудников
- JWT токены используются для идентификации действующего лица
- Записи нельзя удалять через API (только через прямой доступ к БД)
