"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import type { ExecutiveRole } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("full_name, executive_role")
        .eq("id", user.id)
        .single();

      if (profile?.executive_role) {
        const store = useAppStore.getState();
        const role = profile.executive_role as ExecutiveRole;
        const name = profile.full_name || user.email || "User";
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        // Title mapping
        const titleMap: Record<ExecutiveRole, string> = {
          ceo: "Chief Executive Officer",
          cfo: "Chief Financial Officer",
          cmo: "Chief Marketing Officer",
          cto: "Chief Technology Officer",
          "tech-lead": "Technical Team Lead",
        };

        // Silently hydrate the store — the UI adapts without explanation
        useAppStore.setState({
          userRole: role,
          userName: name,
          userInitials: initials,
          userTitle: titleMap[role],
        });
      }
    }

    loadProfile();
  }, []);

  return <>{children}</>;
}
