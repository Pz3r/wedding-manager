export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InvitationStatus = 'pending' | 'sent' | 'opened' | 'responded';

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string | null;
          group_name: string | null;
          expected_attendees: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone?: string | null;
          group_name?: string | null;
          expected_attendees?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          group_name?: string | null;
          expected_attendees?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guests_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      invitations: {
        Row: {
          id: string;
          guest_id: string;
          token: string;
          status: InvitationStatus;
          sent_at: string | null;
          opened_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          guest_id: string;
          token: string;
          status?: InvitationStatus;
          sent_at?: string | null;
          opened_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          guest_id?: string;
          token?: string;
          status?: InvitationStatus;
          sent_at?: string | null;
          opened_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_guest_id_fkey";
            columns: ["guest_id"];
            referencedRelation: "guests";
            referencedColumns: ["id"];
          }
        ];
      };
      rsvp_responses: {
        Row: {
          id: string;
          invitation_id: string;
          attending: boolean;
          party_size: number;
          dietary_restrictions: string | null;
          message: string | null;
          notes: string | null;
          responded_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          attending: boolean;
          party_size?: number;
          dietary_restrictions?: string | null;
          message?: string | null;
          notes?: string | null;
          responded_at?: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          attending?: boolean;
          party_size?: number;
          dietary_restrictions?: string | null;
          message?: string | null;
          notes?: string | null;
          responded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_invitation_id_fkey";
            columns: ["invitation_id"];
            referencedRelation: "invitations";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_invitation_by_token: {
        Args: {
          invitation_token: string;
        };
        Returns: {
          invitation_id: string;
          guest_name: string;
          guest_email: string;
          expected_attendees: number;
          invitation_status: InvitationStatus;
          existing_response: Json | null;
        }[];
      };
    };
    Enums: {
      invitation_status: InvitationStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
