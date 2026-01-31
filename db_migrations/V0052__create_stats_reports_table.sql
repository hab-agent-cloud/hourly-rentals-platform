CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.stats_reports (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL,
  sent_by_admin_id INTEGER NOT NULL,
  sent_to_email VARCHAR(255) NOT NULL,
  report_period_start TIMESTAMP NOT NULL,
  report_period_end TIMESTAMP NOT NULL,
  stats_data JSONB NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stats_reports_listing ON t_p39732784_hourly_rentals_platf.stats_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_stats_reports_sent_at ON t_p39732784_hourly_rentals_platf.stats_reports(sent_at DESC);

COMMENT ON TABLE t_p39732784_hourly_rentals_platf.stats_reports IS 'История отправленных статистических отчётов владельцам';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.stats_reports.stats_data IS 'JSON с данными: views, clicks, calls, conversionRate и т.д.';