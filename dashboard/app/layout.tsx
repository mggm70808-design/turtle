import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "TitanBot Dashboard", template: "%s | TitanBot" },
  description: "Full control panel for TitanBot — manage moderation, economy, leveling, music, and more.",
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#0b0c0e]`}>
      <body className="font-sans bg-[#0b0c0e] text-[#e3e5e8] min-h-dvh">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
