-- Убираем лимиты объектов и дней подписки для ОМ и УМ
-- Они руководители, не работают с объектами напрямую

UPDATE admins 
SET 
    object_limit = NULL,
    subscription_days_limit = NULL
WHERE role IN ('operational_manager', 'chief_manager');

-- Добавляем новые поля для руководителей
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS team_limit INTEGER DEFAULT NULL;

-- Устанавливаем лимиты команды для руководителей
UPDATE admins 
SET team_limit = 10
WHERE role = 'operational_manager';

UPDATE admins 
SET team_limit = 5
WHERE role = 'chief_manager';

-- Добавляем комментарии к полям
COMMENT ON COLUMN admins.object_limit IS 'Лимит объектов для менеджера (только для role=manager)';
COMMENT ON COLUMN admins.subscription_days_limit IS 'Лимит дней подписки для менеджера (только для role=manager)';
COMMENT ON COLUMN admins.team_limit IS 'Лимит подчиненных: для ОМ - количество менеджеров, для УМ - количество ОМ';