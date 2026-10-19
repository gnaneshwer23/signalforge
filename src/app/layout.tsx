import type { Metadata } from "next";
import { Source_Serif_4, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { RootProviders } from "@/components/layout/providers";
import "./globals.css";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SignalForge — Pharma Intelligence Workbench",
  description:
    "Evidence-grounded pharmaceutical competitive intelligence workbench for moderate-to-severe atopic dermatitis. Independent portfolio prototype.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full font-sans text-foreground">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
