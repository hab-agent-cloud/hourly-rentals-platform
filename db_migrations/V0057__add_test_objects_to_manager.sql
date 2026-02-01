-- Привязываем несколько объектов к тестовому менеджеру (ID=14)
-- Создаем разнообразные кейсы для демонстрации функционала

INSERT INTO manager_listings (manager_id, listing_id, created_at)
VALUES 
    (14, 601, NOW() - INTERVAL '5 days'),
    (14, 820, NOW() - INTERVAL '3 days'),
    (14, 822, NOW() - INTERVAL '2 days'),
    (14, 953, NOW() - INTERVAL '1 day'),
    (14, 1035, NOW())
ON CONFLICT DO NOTHING;

-- Добавляем записи в лог действий менеджера
INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details, created_at)
VALUES 
    (14, 'take_listing', 601, '{"reason": "Первый объект в работу"}', NOW() - INTERVAL '5 days'),
    (14, 'take_listing', 820, '{"reason": "Объект требует внимания"}', NOW() - INTERVAL '3 days'),
    (14, 'take_listing', 822, '{"reason": "Расширение базы"}', NOW() - INTERVAL '2 days'),
    (14, 'take_listing', 953, '{"reason": "Перспективный район"}', NOW() - INTERVAL '1 day'),
    (14, 'take_listing', 1035, '{"reason": "Новый объект"}', NOW());

-- Добавляем задачи от ОМ менеджеру
INSERT INTO manager_tasks (manager_id, om_id, title, description, deadline, completed)
VALUES 
    (14, NULL, 'Связаться с владельцами', 'Прозвонить всех владельцев объектов с истекающей подпиской', NOW() + INTERVAL '2 days', false),
    (14, NULL, 'Продлить подписки', 'Продлить подписку на объекты 601, 820', NOW() + INTERVAL '1 day', false),
    (14, NULL, 'Отчет по работе', 'Подготовить отчет по работе за неделю', NOW() + INTERVAL '3 days', false);