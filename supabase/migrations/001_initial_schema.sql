-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum type for invitation status
CREATE TYPE invitation_status AS ENUM ('pending', 'sent', 'opened', 'responded');

-- Create guests table
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    group_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create invitations table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    status invitation_status NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RSVP responses table
CREATE TABLE rsvp_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL UNIQUE REFERENCES invitations(id) ON DELETE CASCADE,
    attending BOOLEAN NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 1 CHECK (party_size >= 1),
    dietary_restrictions TEXT,
    message TEXT,
    responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_guests_user_id ON guests(user_id);
CREATE INDEX idx_invitations_guest_id ON invitations(guest_id);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_rsvp_responses_invitation_id ON rsvp_responses(invitation_id);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guests table
-- Users can only see their own guests
CREATE POLICY "Users can view own guests" ON guests
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guests" ON guests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guests" ON guests
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guests" ON guests
    FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for invitations table
-- Users can manage invitations for their own guests
CREATE POLICY "Users can view invitations for own guests" ON invitations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM guests
            WHERE guests.id = invitations.guest_id
            AND guests.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert invitations for own guests" ON invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM guests
            WHERE guests.id = guest_id
            AND guests.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update invitations for own guests" ON invitations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM guests
            WHERE guests.id = invitations.guest_id
            AND guests.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete invitations for own guests" ON invitations
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM guests
            WHERE guests.id = invitations.guest_id
            AND guests.user_id = auth.uid()
        )
    );

-- Public can view invitation by token (for RSVP page)
CREATE POLICY "Anyone can view invitation by token" ON invitations
    FOR SELECT
    USING (true);

-- Public can update invitation status (for tracking opens)
CREATE POLICY "Anyone can update invitation status" ON invitations
    FOR UPDATE
    USING (true);

-- RLS Policies for rsvp_responses table
-- Users can view RSVP responses for their guests' invitations
CREATE POLICY "Users can view RSVP responses for own guests" ON rsvp_responses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM invitations
            JOIN guests ON guests.id = invitations.guest_id
            WHERE invitations.id = rsvp_responses.invitation_id
            AND guests.user_id = auth.uid()
        )
    );

-- Public can insert RSVP responses (guests responding to invitations)
CREATE POLICY "Anyone can submit RSVP response" ON rsvp_responses
    FOR INSERT
    WITH CHECK (true);

-- Public can view their own RSVP response (for confirmation page)
CREATE POLICY "Anyone can view RSVP by invitation" ON rsvp_responses
    FOR SELECT
    USING (true);

-- Function to get guest info by token (for public RSVP page)
CREATE OR REPLACE FUNCTION get_invitation_by_token(invitation_token TEXT)
RETURNS TABLE (
    invitation_id UUID,
    guest_name TEXT,
    guest_email TEXT,
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
        i.status AS invitation_status,
        CASE
            WHEN r.id IS NOT NULL THEN
                jsonb_build_object(
                    'attending', r.attending,
                    'party_size', r.party_size,
                    'dietary_restrictions', r.dietary_restrictions,
                    'message', r.message
                )
            ELSE NULL
        END AS existing_response
    FROM invitations i
    JOIN guests g ON g.id = i.guest_id
    LEFT JOIN rsvp_responses r ON r.invitation_id = i.id
    WHERE i.token = invitation_token;
END;
$$;
