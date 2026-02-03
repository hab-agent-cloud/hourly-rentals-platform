-- Обновление тестовых задач: добавление om_id для проверки уведомлений
-- Предполагаем, что admin с id=1 это ОМ (можно изменить на реального ОМ)
UPDATE t_p39732784_hourly_rentals_platf.manager_tasks
SET om_id = 1
WHERE om_id IS NULL AND manager_id = 14;