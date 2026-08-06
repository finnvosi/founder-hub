import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TextureOverlay } from "@/components/shared/texture-overlay";
import { ImperfectGrid } from "@/components/shared/imperfect-grid";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { ArchitecturalPreloader } from "@/components/shared/preloader";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ThemeScript } from "@/components/shared/theme-script";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "FOUNDER HUB // SYS", template: "%s // FOUNDER HUB" },
  description: "Precision architectural software and telemetry for modern startups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ArchitecturalPreloader />
          <CustomCursor />
          <ImperfectGrid />
          <TextureOverlay />
          <TooltipProvider>
            <div className="relative z-10">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
