"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Users, Shield, Zap, Activity, Clock, Server,
  TrendingUp, Coins, Music, Ticket, Gift, AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

const MOCK_STATS = {
  guilds: 1,
  members: 347,
  uptime: "3d 14h 22m",
  commandsToday: 128,
  warnings: 12,
  activeCases: 3,
  economyUsers: 89,
  musicQueueSize: 0,
  openTickets: 4,
  activeGiveaways: 1,
  topLevel: 42,
  totalMessages: "14.2k",
};

const recentActivity = [
  { action: "ban",     user: "toxic_user#1234",   mod: "AdminX",   time: "2m ago",   color: "danger"  },
  { action: "warn",    user: "spammer#5678",       mod: "Mod_Sara", time: "15m ago",  color: "warning" },
  { action: "kick",    user: "rulebreak#9999",     mod: "AdminX",   time: "1h ago",   color: "danger"  },
  { action: "timeout", user: "louduser#4321",      mod: "Mod_Ali",  time: "2h ago",   color: "warning" },
  { action: "unban",   user: "reformed#0001",      mod: "AdminX",   time: "3h ago",   color: "success" },
] as const;

const actionVariant: Record<string, "danger" | "warning" | "success" | "info"> = {
  ban:     "danger",
  warn:    "warning",
  kick:    "danger",
  timeout: "warning",
  unban:   "success",
  mute:    "warning",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats] = useState(MOCK_STATS);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${session?.user?.name?.split(" ")[0] ?? "Admin"}`}
        description="Here&apos;s what&apos;s happening with your server today."
      />

      {/* Status bar */}
      <div className="flex items-center gap-3 bg-[#111214] border border-[#2b2d31] rounded-xl px-4 py-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse" />
          <span className="text-xs font-medium text-[#23a55a]">Bot Online</span>
        </div>
        <span className="text-[#2b2d31]">|</span>
        <div className="flex items-center gap-1.5 text-xs text-[#949ba4]">
          <Clock className="w-3.5 h-3.5" />
          <span>Uptime: {stats.uptime}</span>
        </div>
        <span className="text-[#2b2d31]">|</span>
        <div className="flex items-center gap-1.5 text-xs text-[#949ba4]">
          <Server className="w-3.5 h-3.5" />
          <span>{stats.guilds} server</span>
        </div>
        <span className="text-[#2b2d31]">|</span>
        <div className="flex items-center gap-1.5 text-xs text-[#949ba4]">
          <Activity className="w-3.5 h-3.5" />
          <span>{stats.commandsToday} commands today</span>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Members"        value={stats.members}       icon={Users}     color="blue"   sub="in this server"        />
        <StatCard label="Active Cases"   value={stats.activeCases}   icon={Shield}    color="red"    sub="open mod cases"        />
        <StatCard label="Open Tickets"   value={stats.openTickets}   icon={Ticket}    color="yellow" sub="awaiting response"     />
        <StatCard label="Economy Users"  value={stats.economyUsers}  icon={Coins}     color="green"  sub="registered users"      />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Warnings"        value={stats.warnings}        icon={AlertTriangle} color="yellow" sub="total issued"     />
        <StatCard label="Top Level"       value={stats.topLevel}        icon={TrendingUp}    color="purple" sub="highest XP"       />
        <StatCard label="Total Messages"  value={stats.totalMessages}   icon={Zap}           color="blue"   sub="all time"         />
        <StatCard label="Giveaways"       value={stats.activeGiveaways} icon={Gift}          color="green"  sub="currently active" />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent activity */}
        <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2b2d31]">
            <h2 className="text-sm font-semibold text-[#e3e5e8]">Recent Moderation</h2>
            <Badge variant="muted">Last 24h</Badge>
          </div>
          <div className="divide-y divide-[#1e1f23]">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Badge variant={actionVariant[item.action] ?? "muted"}>
                  {item.action}
                </Badge>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#e3e5e8] font-medium truncate block">{item.user}</span>
                  <span className="text-xs text-[#60646c]">by {item.mod}</span>
                </div>
                <span className="text-xs text-[#60646c] shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature overview */}
        <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2b2d31]">
            <h2 className="text-sm font-semibold text-[#e3e5e8]">Feature Status</h2>
          </div>
          <div className="divide-y divide-[#1e1f23]">
            {[
              { icon: Shield,    label: "Moderation",     status: "active",   detail: `${stats.activeCases} open cases`          },
              { icon: TrendingUp,label: "Leveling",        status: "active",   detail: `Top level: ${stats.topLevel}`             },
              { icon: Coins,     label: "Economy",         status: "active",   detail: `${stats.economyUsers} users`              },
              { icon: Music,     label: "Music",           status: "idle",     detail: "No queue active"                          },
              { icon: Ticket,    label: "Tickets",         status: "active",   detail: `${stats.openTickets} open`                },
              { icon: Gift,      label: "Giveaways",       status: "active",   detail: `${stats.activeGiveaways} running`         },
            ].map(({ icon: Icon, label, status, detail }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-lg bg-[#1e1f23] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#949ba4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#e3e5e8] font-medium">{label}</span>
                  <span className="text-xs text-[#60646c] block">{detail}</span>
                </div>
                <Badge variant={status === "active" ? "success" : "muted"}>
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
