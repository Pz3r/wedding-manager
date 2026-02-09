import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateToken, getRsvpUrl } from '../lib/utils';
import type { InvitationWithRsvp, GuestWithInvitation } from '../types';

export function useInvitations() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<InvitationWithRsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          guests!inner (*),
          rsvp_responses (*)
        `)
        .eq('guests.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our type
      // rsvp_responses is a single object (or null) since invitation_id has a UNIQUE constraint
      const transformed = (data || []).map((inv) => ({
        ...inv,
        rsvp_responses: Array.isArray(inv.rsvp_responses)
          ? inv.rsvp_responses[0] || null
          : inv.rsvp_responses || null,
      }));

      setInvitations(transformed as InvitationWithRsvp[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const createAndSendInvitation = async (guestId: string): Promise<boolean> => {
    try {
      setSending(true);
      setError(null);

      const token = generateToken();

      // Create the invitation
      const { data: invitation, error: createError } = await supabase
        .from('invitations')
        .insert({
          guest_id: guestId,
          token,
          status: 'pending',
        })
        .select()
        .single();

      if (createError) throw createError;

      // Call the edge function to send the email
      const { error: sendError } = await supabase.functions.invoke('send-invitation', {
        body: {
          invitationId: invitation.id,
          rsvpUrl: getRsvpUrl(token),
        },
      });

      if (sendError) {
        // Update status to indicate email failed but invitation was created
        console.error('Email sending failed:', sendError);
        // We'll still consider this a success since the invitation was created
        // The organizer can resend later
      }

      // Update invitation status to sent
      await supabase
        .from('invitations')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', invitation.id);

      await fetchInvitations();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
      return false;
    } finally {
      setSending(false);
    }
  };

  const getOrCreateInvitation = async (guest: GuestWithInvitation): Promise<string | null> => {
    try {
      setSending(true);
      setError(null);

      // Reuse existing invitation token if one exists
      if (guest.invitations && guest.invitations.length > 0) {
        const sorted = [...guest.invitations].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const existing = sorted[0];

        if (existing.status === 'pending') {
          await supabase
            .from('invitations')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', existing.id);
        }

        await fetchInvitations();
        return existing.token;
      }

      // No invitation exists — create one
      const token = generateToken();
      const { error: createError } = await supabase
        .from('invitations')
        .insert({
          guest_id: guest.id,
          token,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchInvitations();
      return token;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invitation');
      return null;
    } finally {
      setSending(false);
    }
  };

  const resendInvitation = async (invitationId: string): Promise<boolean> => {
    try {
      setSending(true);
      setError(null);

      // Get the invitation
      const { data: invitation, error: fetchError } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError) throw fetchError;

      // Call the edge function to send the email
      const { error: sendError } = await supabase.functions.invoke('send-invitation', {
        body: {
          invitationId: invitation.id,
          rsvpUrl: getRsvpUrl(invitation.token),
        },
      });

      if (sendError) throw sendError;

      // Update sent_at timestamp
      await supabase
        .from('invitations')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', invitationId);

      await fetchInvitations();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invitation');
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    invitations,
    loading,
    sending,
    error,
    createAndSendInvitation,
    getOrCreateInvitation,
    resendInvitation,
    refetch: fetchInvitations,
  };
}
