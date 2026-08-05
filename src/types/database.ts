/**
 * Database types for Supabase.
 * In production, generate with: npx supabase gen types typescript --linked > src/types/database.ts
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          executive_role: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          executive_role?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          executive_role?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          role?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          team_id: string;
          title: string;
          content: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          title?: string;
          content?: string | null;
          author_id?: string | null;
        };
        Update: {
          title?: string;
          content?: string | null;
          updated_at?: string;
        };
      };
      files: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          size: number;
          type: string;
          url: string | null;
          folder_id: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          size?: number;
          type?: string;
          url?: string | null;
          folder_id?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          name?: string;
          url?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          team_id: string;
          title: string;
          description: string | null;
          status: string;
          assignee_id: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          title: string;
          description?: string | null;
          status?: string;
          assignee_id?: string | null;
          due_date?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: string;
          assignee_id?: string | null;
          due_date?: string | null;
          updated_at?: string;
        };
      };
      meetings: {
        Row: {
          id: string;
          team_id: string;
          title: string;
          start_time: string;
          end_time: string;
          agenda_doc_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          title: string;
          start_time: string;
          end_time: string;
          agenda_doc_id?: string | null;
        };
        Update: {
          title?: string;
          start_time?: string;
          end_time?: string;
          agenda_doc_id?: string | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          team_id: string;
          type: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          team_id: string;
          type: string;
          content: string;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
      };
      channels: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          description: string | null;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          description?: string | null;
          is_private?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_private?: boolean;
        };
      };
      messages: {
        Row: {
          id: string;
          channel_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          channel_id: string;
          user_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
