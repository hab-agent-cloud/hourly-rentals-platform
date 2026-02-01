-- Добавляем новые роли к существующей таблице admins
-- Текущие роли: 'superadmin', 'employee'
-- Добавляем: 'chief_manager', 'operational_manager', 'manager'

-- Баланс для комиссий
ALTER TABLE admins ADD COLUMN IF NOT EXISTS balance DECIMAL DEFAULT 0;

-- Уровень менеджера
ALTER TABLE admins ADD COLUMN IF NOT EXISTS manager_level TEXT DEFAULT 'bronze';
-- 'bronze' | 'silver' | 'gold' | 'platinum'

-- Грейд ОМ
ALTER TABLE admins ADD COLUMN IF NOT EXISTS om_grade TEXT;
-- 'junior' | 'middle' | 'senior' | 'lead'

-- Лимиты менеджера
ALTER TABLE admins ADD COLUMN IF NOT EXISTS object_limit INTEGER DEFAULT 50;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS subscription_days_limit INTEGER DEFAULT 3;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS commission_percent DECIMAL DEFAULT 7.0;

-- Бюджет ОМ
ALTER TABLE admins ADD COLUMN IF NOT EXISTS bonus_budget DECIMAL DEFAULT 30000;

-- Предупреждения
ALTER TABLE admins ADD COLUMN IF NOT EXISTS warnings_count INTEGER DEFAULT 0;

-- Иерархия менеджеров
CREATE TABLE IF NOT EXISTS manager_hierarchy (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES admins(id),
  operational_manager_id INTEGER REFERENCES admins(id),
  chief_manager_id INTEGER REFERENCES admins(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_manager_hierarchy_manager ON manager_hierarchy(manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_hierarchy_om ON manager_hierarchy(operational_manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_hierarchy_um ON manager_hierarchy(chief_manager_id);

-- Сопровождение объектов менеджерами
CREATE TABLE IF NOT EXISTS manager_listings (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES admins(id),
  listing_id INTEGER REFERENCES listings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(listing_id)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_manager_listings_manager ON manager_listings(manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_listings_listing ON manager_listings(listing_id);

-- Статус объектов
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
-- 'active' | 'frozen' | 'archived'
ALTER TABLE listings ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMP;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS archive_reason TEXT;

-- Кто создал подписку
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'owner';
-- 'owner' | 'superadmin' | 'manager'
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES admins(id);

-- История комиссий
CREATE TABLE IF NOT EXISTS commission_history (
  id SERIAL PRIMARY KEY,
  transaction_id TEXT,
  admin_id INTEGER REFERENCES admins(id),
  role TEXT,
  amount DECIMAL,
  percentage DECIMAL,
  listing_id INTEGER REFERENCES listings(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commission_history_admin ON commission_history(admin_id);
CREATE INDEX IF NOT EXISTS idx_commission_history_created ON commission_history(created_at);

-- История действий менеджера
CREATE TABLE IF NOT EXISTS manager_actions_log (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES admins(id),
  action_type TEXT,
  listing_id INTEGER REFERENCES listings(id),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manager_actions_manager ON manager_actions_log(manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_actions_created ON manager_actions_log(created_at);

-- Задачи от ОМ для менеджеров
CREATE TABLE IF NOT EXISTS manager_tasks (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES admins(id),
  om_id INTEGER REFERENCES admins(id),
  title TEXT,
  description TEXT,
  deadline TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manager_tasks_manager ON manager_tasks(manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_tasks_om ON manager_tasks(om_id);

-- Челленджи
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES admins(id),
  title TEXT,
  description TEXT,
  prize TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  target_type TEXT,
  target_team_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Участники челленджей
CREATE TABLE IF NOT EXISTS challenge_participants (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id),
  admin_id INTEGER REFERENCES admins(id),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(challenge_id, admin_id)
);

-- Бонусная система владельцев
ALTER TABLE owners ADD COLUMN IF NOT EXISTS first_payment_date TIMESTAMP;
ALTER TABLE owners ADD COLUMN IF NOT EXISTS total_payments_count INTEGER DEFAULT 0;
ALTER TABLE owners ADD COLUMN IF NOT EXISTS bonus_5000_received BOOLEAN DEFAULT FALSE;