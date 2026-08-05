import { Topbar } from "@/components/layout/topbar";
import { CommandMenu } from "@/components/layout/command-menu";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-full overflow-hidden p-3 sm:p-5 lg:p-6">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-1 shadow-2xl">
          {/* Head Bar Menu */}
          <Topbar />

          {/* Main Workspace Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1080px] px-6 py-8 lg:px-12 lg:py-10">
              {children}
            </div>
          </main>
        </div>
        <CommandMenu />
      </div>
    </AuthProvider>
  );
}
