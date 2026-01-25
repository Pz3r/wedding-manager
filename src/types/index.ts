import type { Database, InvitationStatus } from './database';

export type { Database, InvitationStatus };

// Table row types
export type Guest = Database['public']['Tables']['guests']['Row'];
export type GuestInsert = Database['public']['Tables']['guests']['Insert'];
export type GuestUpdate = Database['public']['Tables']['guests']['Update'];

export type Invitation = Database['public']['Tables']['invitations']['Row'];
export type InvitationInsert = Database['public']['Tables']['invitations']['Insert'];
export type InvitationUpdate = Database['public']['Tables']['invitations']['Update'];

export type RsvpResponse = Database['public']['Tables']['rsvp_responses']['Row'];
export type RsvpResponseInsert = Database['public']['Tables']['rsvp_responses']['Insert'];
export type RsvpResponseUpdate = Database['public']['Tables']['rsvp_responses']['Update'];

// Extended types with relations
export interface GuestWithInvitation extends Guest {
  invitations: Invitation[];
}

export interface InvitationWithGuest extends Invitation {
  guests: Guest;
}

export interface InvitationWithRsvp extends Invitation {
  guests: Guest;
  rsvp_responses: RsvpResponse | null;
}

// Form types
export interface GuestFormData {
  name: string;
  email: string;
  phone?: string;
  group_name?: string;
}

export interface RsvpFormData {
  attending: boolean;
  party_size: number;
  dietary_restrictions?: string;
  message?: string;
}

// Stats
export interface DashboardStats {
  totalGuests: number;
  invitationsSent: number;
  confirmed: number;
  declined: number;
  pending: number;
  totalAttendees: number;
}
