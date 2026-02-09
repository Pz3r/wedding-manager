-- Add updated_at field to track when a guest updates their RSVP response
ALTER TABLE rsvp_responses ADD COLUMN updated_at TIMESTAMPTZ;

COMMENT ON COLUMN rsvp_responses.updated_at IS 'Timestamp of the most recent update to this RSVP response (null if never updated)';
