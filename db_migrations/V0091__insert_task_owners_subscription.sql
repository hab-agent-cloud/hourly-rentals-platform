
INSERT INTO t_p39732784_hourly_rentals_platf.manager_tasks 
(manager_id, om_id, title, description, deadline, completed, created_at)
SELECT 
    a.id,
    1,
    'Добавить владельцев и привязать к ним объекты',
    'Добавить владельцев и привязать к ним объекты, отредактировать объект. Каждый владелец должен нажать кнопку "Подписка 14 дней бесплатно" у себя в личном кабинете экстранета — 20 шт. Добиться пополнения баланса владельцами на сумму 25 000 рублей.',
    NOW() + INTERVAL '7 days',
    false,
    NOW()
FROM t_p39732784_hourly_rentals_platf.admins a
WHERE a.role = 'manager' AND a.is_active = true;
