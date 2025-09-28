-- Add anon inbox support
ALTER TABLE letter ADD COLUMN IF NOT EXISTS anon_user_id VARCHAR(64);
ALTER TABLE letter ADD COLUMN IF NOT EXISTS has_unread BOOLEAN DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_letter_anon_user_id ON letter(anon_user_id);

