-- View: All RSVP responses with guest and invitation details
CREATE OR REPLACE VIEW rsvp_details AS
SELECT
    r.id AS response_id,
    r.attending,
    r.party_size,
    r.dietary_restrictions,
    r.message,
    r.notes,
    r.responded_at,
    g.id AS guest_id,
    g.name AS guest_name,
    g.email AS guest_email,
    g.phone AS guest_phone,
    g.group_name,
    g.expected_attendees,
    g.user_id,
    i.id AS invitation_id,
    i.token,
    i.status AS invitation_status,
    i.sent_at,
    i.opened_at
FROM rsvp_responses r
JOIN invitations i ON i.id = r.invitation_id
JOIN guests g ON g.id = i.guest_id;

-- View: Summary statistics per user
CREATE OR REPLACE VIEW rsvp_summary AS
SELECT
    g.user_id,
    COUNT(DISTINCT g.id) AS total_guests,
    COUNT(DISTINCT CASE WHEN i.status != 'pending' THEN i.id END) AS invitations_sent,
    COUNT(DISTINCT CASE WHEN r.id IS NOT NULL AND r.attending = true THEN r.id END) AS confirmed_attending,
    COUNT(DISTINCT CASE WHEN r.id IS NOT NULL AND r.attending = false THEN r.id END) AS declined,
    COUNT(DISTINCT CASE WHEN i.status = 'sent' AND r.id IS NULL THEN i.id END) AS awaiting_response,
    COALESCE(SUM(CASE WHEN r.attending = true THEN r.party_size ELSE 0 END), 0) AS total_attendees,
    COALESCE(SUM(g.expected_attendees), 0) AS total_expected
FROM guests g
LEFT JOIN invitations i ON i.guest_id = g.id
LEFT JOIN rsvp_responses r ON r.invitation_id = i.id
GROUP BY g.user_id;

-- View: Guests with dietary restrictions (for catering)
CREATE OR REPLACE VIEW dietary_requirements AS
SELECT
    g.user_id,
    g.name AS guest_name,
    g.email AS guest_email,
    g.group_name,
    r.party_size,
    r.dietary_restrictions,
    r.notes
FROM rsvp_responses r
JOIN invitations i ON i.id = r.invitation_id
JOIN guests g ON g.id = i.guest_id
WHERE r.attending = true
AND (r.dietary_restrictions IS NOT NULL AND r.dietary_restrictions != '');

-- Enable RLS on the views (views inherit RLS from underlying tables, but we add policies for direct access)
-- Note: These views will automatically respect the RLS policies on the underlying tables

-- Grant select on views to authenticated users
GRANT SELECT ON rsvp_details TO authenticated;
GRANT SELECT ON rsvp_summary TO authenticated;
GRANT SELECT ON dietary_requirements TO authenticated;
