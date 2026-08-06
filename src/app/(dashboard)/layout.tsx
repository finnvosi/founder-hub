"use client";

import { Topbar } from "@/components/layout/topbar";
import { CommandMenu } from "@/components/layout/command-menu";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AnimatedMeshGradient } from "@/components/layout/animated-mesh-gradient";
import { FilmGrain } from "@/components/layout/film-grain";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        {/* Layer 1: Ambient Mesh Background */}
        <AnimatedMeshGradient />
        
        {/* Layer 2: Fine Grid Texture */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-fine-grid opacity-60" />
        
        {/* Layer 3: Film Grain (Highest Z-index) */}
        <FilmGrain />
        
        {/* Technical Annotations */}
        <div className="pointer-events-none absolute left-4 top-18 hidden md:flex font-mono text-[9px] text-text-tertiary z-10">
          // SYS.CORE.2028
        </div>
        <div className="pointer-events-none absolute right-4 bottom-4 hidden md:flex font-mono text-[9px] text-text-tertiary z-10">
          X:000 Y:000
        </div>
        
        <div className="flex h-full w-full flex-col overflow-hidden relative z-10">
          {/* Head Bar Menu */}
          <Topbar />

          {/* Main Workspace Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1080px] px-6 py-8 lg:px-12 lg:py-12">
              {children}
            </div>
          </main>
        </div>
        <CommandMenu />
      </div>
    </AuthProvider>
  );
}
