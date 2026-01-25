-- Добавление поля баланса для владельцев
ALTER TABLE owners ADD COLUMN IF NOT EXISTS balance DECIMAL(10, 2) DEFAULT 0.00;

-- Добавление поля для отслеживания выданных бонусов
ALTER TABLE owners ADD COLUMN IF NOT EXISTS bonus_awarded BOOLEAN DEFAULT FALSE;

-- Комментарии для полей
COMMENT ON COLUMN owners.balance IS 'Бонусный баланс владельца в рублях';
COMMENT ON COLUMN owners.bonus_awarded IS 'Флаг выдачи приветственного бонуса 5000 рублей';