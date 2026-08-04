import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArchitecturalPreloader } from "@/components/shared/preloader";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextureOverlay } from "@/components/shared/texture-overlay";
import { ImperfectGrid } from "@/components/shared/imperfect-grid";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-titanium-black text-text-primary">
      <ImperfectGrid />
      <TextureOverlay />
      
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="mb-12 flex items-center justify-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-deep-purple text-titanium-black font-semibold text-xs rounded-sm">
            F
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
            {APP_NAME}
          </span>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="mono-label">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@startup.com"
              required
              className="border-white/5 bg-white/5 h-12 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:ring-deep-purple"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="mono-label">
                Password
              </label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="border-white/5 bg-white/5 h-12 text-sm text-text-primary focus-visible:ring-deep-purple"
            />
          </div>

          <Button
            formAction={async () => {
              "use server";
              // Server action placeholder
            }}
            className="h-12 w-full bg-text-primary text-titanium-black hover:bg-text-secondary"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
            System restricted. Authorized access only.
          </p>
        </div>
      </div>
    </div>
  );
}
