-- One database can serve all three sites. Outbox reads and acknowledgements are site-scoped.
CREATE TABLE IF NOT EXISTS website_intakes (
  id TEXT PRIMARY KEY,
  site TEXT NOT NULL,
  received_at TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  payload TEXT NOT NULL,
  delivered_at TEXT,
  twenty_id TEXT
);
CREATE INDEX IF NOT EXISTS intake_pending ON website_intakes(site, delivered_at, received_at);
