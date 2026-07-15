"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Zap, BarChart3, Music, Coins, Users } from "lucide-react";

const features = [
  { icon: Shield, label: "Moderation", desc: "Ban, kick, warn, timeout" },
  { icon: BarChart3, label: "Leveling", desc: "XP system & leaderboards" },
  { icon: Coins, label: "Economy", desc: "Shop, balance, games" },
  { icon: Music, label: "Music", desc: "Queue & playback control" },
  { icon: Users, label: "Members", desc: "Roles & permissions" },
  { icon: Zap, label: "Automation", desc: "Logging, tickets, welcome" },
];

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#0b0c0e] px-4 py-12">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#5865f2 1px,transparent 1px),linear-gradient(to right,#5865f2 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#5865f2]/10 border border-[#5865f2]/30 text-[#5865f2] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#23a55a] animate-pulse" />
            TitanBot v2.1.0 — Online
          </div>
          <h1 className="text-5xl font-bold text-[#e3e5e8] tracking-tight mb-3">
            Titan<span className="text-[#5865f2]">Bot</span> Dashboard
          </h1>
          <p className="text-[#949ba4] text-lg max-w-md mx-auto leading-relaxed">
            Full control over your Discord server. Manage, configure, and monitor everything from one place.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-[#111214] border border-[#2b2d31] rounded-xl p-4"
            >
              <div className="w-8 h-8 rounded-lg bg-[#5865f2]/15 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#5865f2]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e3e5e8]">{label}</div>
                <div className="text-xs text-[#60646c]">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm bg-[#111214] border border-[#2b2d31] rounded-2xl p-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#e3e5e8] mb-1">Sign in to continue</h2>
            <p className="text-sm text-[#60646c]">Connect your Discord account to access the dashboard</p>
          </div>

          <button
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a5] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-150"
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.367a19.807 19.807 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.367-.444.847-.607 1.225a18.285 18.285 0 00-5.487 0c-.163-.378-.396-.858-.607-1.225a.077.077 0 00-.079-.037 19.746 19.746 0 00-4.885 1.515.07.07 0 00-.033.028C.533 9.046.332 13.58.997 18.057a.082.082 0 00.033.056c2.7 1.928 5.3 3.096 7.865 3.869a.08.08 0 00.087-.033c.462-.612.873-1.256 1.226-1.933a.079.079 0 00-.044-.11 13.228 13.228 0 01-1.885-.892.081.081 0 01-.008-.135c.126-.094.252-.192.372-.291a.077.077 0 01.08-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 01.083.01c.12.1.246.198.372.292a.081.081 0 01-.005.135c-.603.39-1.233.645-1.885.89a.08.08 0 00-.041.11c.36.677.77 1.322 1.226 1.933a.08.08 0 00.088.028c2.567-.868 5.266-1.99 7.965-3.869a.083.083 0 00.033-.056c.73-4.604.076-8.602-.704-12.042a.074.074 0 00-.031-.03zM8.02 15.331c-1.182 0-2.157-.965-2.157-2.156 0-1.193.964-2.157 2.157-2.157 1.192 0 2.157.964 2.157 2.157 0 1.19-.965 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.964-2.157 2.157-2.157 1.192 0 2.157.964 2.157 2.157 0 1.19-.965 2.156-2.157 2.156z" />
            </svg>
            Sign in with Discord
          </button>

          <p className="text-xs text-[#60646c] text-center">
            You need admin permissions on a server to manage it.
          </p>
        </div>
      </div>
    </div>
  );
}
