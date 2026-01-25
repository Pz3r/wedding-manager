-- Add expected_attendees to guests table (set by organizer)
ALTER TABLE guests ADD COLUMN expected_attendees INTEGER NOT NULL DEFAULT 1 CHECK (expected_attendees >= 1);

-- Add notes to rsvp_responses table (filled by guest during RSVP)
ALTER TABLE rsvp_responses ADD COLUMN notes TEXT;

-- Add comment for clarity
COMMENT ON COLUMN guests.expected_attendees IS 'Number of people expected to attend with this guest (set by organizer)';
COMMENT ON COLUMN rsvp_responses.notes IS 'Additional notes from the guest during RSVP confirmation';

-- Drop and recreate the function with new return type
DROP FUNCTION IF EXISTS get_invitation_by_token(TEXT);

CREATE FUNCTION get_invitation_by_token(invitation_token TEXT)
RETURNS TABLE (
    invitation_id UUID,
    guest_name TEXT,
    guest_email TEXT,
    expected_attendees INTEGER,
    invitation_status invitation_status,
    existing_response JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.id AS invitation_id,
        g.name AS guest_name,
        g.email AS guest_email,
        g.expected_attendees AS expected_attendees,
        i.status AS invitation_status,
        CASE
            WHEN r.id IS NOT NULL THEN
                jsonb_build_object(
                    'attending', r.attending,
                    'party_size', r.party_size,
                    'dietary_restrictions', r.dietary_restrictions,
                    'message', r.message,
                    'notes', r.notes
                )
            ELSE NULL
        END AS existing_response
    FROM invitations i
    JOIN guests g ON g.id = i.guest_id
    LEFT JOIN rsvp_responses r ON r.invitation_id = i.id
    WHERE i.token = invitation_token;
END;
$$;
