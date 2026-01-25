import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Guest, GuestInsert, GuestUpdate, GuestWithInvitation } from '../types';

export function useGuests() {
  const { user } = useAuth();
  const [guests, setGuests] = useState<GuestWithInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          invitations (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data as GuestWithInvitation[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const addGuest = async (guest: Omit<GuestInsert, 'user_id'>): Promise<Guest | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('guests')
        .insert({ ...guest, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      await fetchGuests();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guest');
      return null;
    }
  };

  const updateGuest = async (id: string, updates: GuestUpdate): Promise<Guest | null> => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchGuests();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest');
      return null;
    }
  };

  const deleteGuest = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('guests').delete().eq('id', id);

      if (error) throw error;
      await fetchGuests();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
      return false;
    }
  };

  return {
    guests,
    loading,
    error,
    addGuest,
    updateGuest,
    deleteGuest,
    refetch: fetchGuests,
  };
}
