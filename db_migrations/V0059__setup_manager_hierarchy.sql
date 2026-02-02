-- Создаем иерархию: Менеджер (14) -> ОМ (15) -> УМ (16)

-- Привязываем менеджера к ОМ
INSERT INTO manager_hierarchy (manager_id, operational_manager_id, chief_manager_id)
VALUES (14, 15, 16);

-- Создаем еще двух тестовых менеджеров для команды ОМ
INSERT INTO admins (
    email, 
    password_hash, 
    name, 
    role, 
    manager_level, 
    object_limit, 
    subscription_days_limit, 
    commission_percent, 
    balance,
    is_active
)
VALUES 
    (
        'manager2@120min.ru', 
        'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae', 
        'Мария Менеджерова', 
        'manager', 
        'silver', 
        50, 
        5, 
        8.0, 
        5000,
        true
    ),
    (
        'manager3@120min.ru', 
        'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae', 
        'Алексей Менеджеров', 
        'manager', 
        'bronze', 
        50, 
        3, 
        7.0, 
        2500,
        true
    );

-- Привязываем новых менеджеров к ОМ
INSERT INTO manager_hierarchy (manager_id, operational_manager_id, chief_manager_id)
SELECT id, 15, 16 
FROM admins 
WHERE email IN ('manager2@120min.ru', 'manager3@120min.ru');

-- Добавляем объекты второму менеджеру
INSERT INTO manager_listings (manager_id, listing_id, created_at)
SELECT 
    (SELECT id FROM admins WHERE email = 'manager2@120min.ru'),
    id,
    NOW()
FROM listings 
WHERE status = 'active' 
AND id NOT IN (SELECT listing_id FROM manager_listings)
LIMIT 3;

-- Добавляем объекты третьему менеджеру
INSERT INTO manager_listings (manager_id, listing_id, created_at)
SELECT 
    (SELECT id FROM admins WHERE email = 'manager3@120min.ru'),
    id,
    NOW()
FROM listings 
WHERE status = 'active' 
AND id NOT IN (SELECT listing_id FROM manager_listings)
LIMIT 2;