-- Allow public (unauthenticated) users to update their RSVP responses
-- This is needed so guests can modify their response after initial submission
CREATE POLICY "Anyone can update RSVP response" ON rsvp_responses
    FOR UPDATE
    USING (true);
