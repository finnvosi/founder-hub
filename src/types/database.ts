/**
 * Placeholder for Supabase-generated database types.
 * Generate with: npx supabase gen types typescript --linked > src/types/database.ts
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T];
