-- Освобождаем все зависшие виртуальные номера (where assigned_until истёк или is_busy=TRUE без срока)
UPDATE virtual_numbers
SET is_busy = FALSE,
    assigned_listing_id = NULL,
    assigned_at = NULL,
    assigned_until = NULL
WHERE is_busy = TRUE
  AND (assigned_until IS NULL OR assigned_until < NOW());

-- Активируем тестовый задизейбленный номер +79991234567 (id=6) - оставляем is_active=false, он там правильно
-- Убеждаемся что все 10 рабочих номеров активны
UPDATE virtual_numbers
SET is_active = TRUE
WHERE phone IN (
    '+79346621457',
    '+79346650631',
    '+79846696782',
    '+79346613384',
    '+79346627190',
    '+79587579160',
    '+79587589276',
    '+79587623955',
    '+79587610865',
    '+79862293061'
);
