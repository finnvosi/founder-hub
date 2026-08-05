import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandMenu } from "@/components/layout/command-menu";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-full overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="flex h-full w-full overflow-hidden rounded-xl border border-border bg-surface-1 shadow-2xl">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[960px] px-8 py-8 lg:px-12 lg:py-12">
              <Topbar />
              {children}
            </div>
          </main>
        </div>
        <CommandMenu />
      </div>
    </AuthProvider>
  );
}
