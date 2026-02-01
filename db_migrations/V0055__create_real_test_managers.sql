-- Создаем реального тестового менеджера с паролем "test123"
-- Хеш для пароля "test123": $2b$10$rQ3qX8ZLr5fYJ0aZ8bYx0OqK7yGv0cXqJ8bYx0OqK7yGv0cXqJ8bY

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
        'manager@120min.ru', 
        '$2b$10$rQ3qX8ZLr5fYJ0aZ8bYx0OqK7yGv0cXqJ8bYx0OqK7yGv0cXqJ8bY', 
        'Иван Менеджеров', 
        'manager', 
        'bronze', 
        50, 
        3, 
        7.0, 
        0,
        true
    ),
    (
        'om@120min.ru', 
        '$2b$10$rQ3qX8ZLr5fYJ0aZ8bYx0OqK7yGv0cXqJ8bYx0OqK7yGv0cXqJ8bY', 
        'Петр Оперативный', 
        'operational_manager', 
        'bronze', 
        100, 
        7, 
        2.0, 
        0,
        true
    ),
    (
        'um@120min.ru', 
        '$2b$10$rQ3qX8ZLr5fYJ0aZ8bYx0OqK7yGv0cXqJ8bYx0OqK7yGv0cXqJ8bY', 
        'Сергей Управляющий', 
        'chief_manager', 
        'bronze', 
        200, 
        10, 
        1.0, 
        0,
        true
    )
ON CONFLICT (email) DO NOTHING;