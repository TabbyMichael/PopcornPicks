-- Example constraint for watchlists domain
-- Replace with actual constraint definitions

-- Check constraint example
ALTER TABLE watchlists.example
ADD CONSTRAINT check_example_name_not_empty
CHECK (length(trim(name)) > 0);

-- Unique constraint example
ALTER TABLE watchlists.example
ADD CONSTRAINT uq_example_name
UNIQUE (name);

-- Foreign key constraint example (when referencing other tables)
-- ALTER TABLE watchlists.example
-- ADD CONSTRAINT fk_example_other_id
-- FOREIGN KEY (other_id) REFERENCES other.table(id) ON DELETE CASCADE;
