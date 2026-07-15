"use client";

import { useState } from "react";
import { Search, Shield, UserX, AlertTriangle, Crown, MessageSquare, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const MEMBERS = [
  { id: "1", name: "ElitePlayer",  av: "E", role: "admin",     level: 42, xp: 8820, msgs: 1240, joined: "Jan 3, 2025",  warnings: 0, status: "online"  },
  { id: "2", name: "ProGamer99",   av: "P", role: "moderator", level: 35, xp: 6300, msgs: 892,  joined: "Feb 11, 2025", warnings: 0, status: "online"  },
  { id: "3", name: "CoolDude",     av: "C", role: "member",    level: 28, xp: 4200, msgs: 567,  joined: "Mar 5, 2025",  warnings: 1, status: "idle"    },
  { id: "4", name: "xXDarkXx",     av: "X", role: "member",    level: 21, xp: 2800, msgs: 341,  joined: "Apr 19, 2025", warnings: 2, status: "offline" },
  { id: "5", name: "Sunshine",     av: "S", role: "member",    level: 19, xp: 2280, msgs: 290,  joined: "May 7, 2025",  warnings: 0, status: "online"  },
  { id: "6", name: "NightOwl",     av: "N", role: "member",    level: 15, xp: 1500, msgs: 201,  joined: "Jun 1, 2025",  warnings: 1, status: "offline" },
  { id: "7", name: "FastRunner",   av: "F", role: "member",    level: 12, xp: 960,  msgs: 143,  joined: "Jun 20, 2025", warnings: 0, status: "idle"    },
  { id: "8", name: "spammer#5678", av: "S", role: "member",    level: 4,  xp: 120,  msgs: 89,   joined: "Jul 1, 2025",  warnings: 3, status: "offline" },
];

const roleV: Record<string, "danger"|"warning"|"info"|"muted"> = {
  admin: "danger", moderator: "warning", member: "muted",
};
const statusDot: Record<string, string> = {
  online: "bg-[#23a55a]", idle: "bg-[#f0b232]", offline: "bg-[#60646c]",
};

function XpBar({ xp, level }: { xp: number; level: number }) {
  const needed = (level + 1) * 200;
  const pct = Math.min((xp % needed) / needed * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#1e1f23] rounded-full overflow-hidden">
        <div className="h-full bg-[#5865f2] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-[#60646c] shrink-0">{xp} XP</span>
    </div>
  );
}

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = MEMBERS.filter((m) => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === "all" || m.role === roleFilter;
    return ms && mr;
  });

  return (
    <div>
      <PageHeader title="Members" description="View and manage all server members." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Members"  value={MEMBERS.length}                           icon={Shield}       color="blue"   />
        <StatCard label="Admins"         value={MEMBERS.filter(m=>m.role==="admin").length}     icon={Crown}        color="yellow" />
        <StatCard label="Warned"         value={MEMBERS.filter(m=>m.warnings>0).length}   icon={AlertTriangle} color="red"   />
        <StatCard label="Online Now"     value={MEMBERS.filter(m=>m.status==="online").length} icon={MessageSquare} color="green" />
      </div>

      <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
        {/* Search + filter */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2b2d31]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#60646c]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members…"
              className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#e3e5e8] placeholder:text-[#60646c] focus:outline-none focus:border-[#5865f2]"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "admin", "moderator", "member"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  roleFilter === r
                    ? "bg-[#5865f2] text-white"
                    : "bg-[#1e1f23] text-[#949ba4] hover:text-[#e3e5e8]"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-[#60646c]">{filtered.length} members</span>
        </div>

        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#1e1f23]">
          {["Member", "Role", "XP / Level", "Messages", "Warnings", "Actions"].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#1e1f23]">
          {filtered.map((m) => (
            <div key={m.id} className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#5865f2]/20 text-[#5865f2] text-xs font-bold flex items-center justify-center">
                    {m.av}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#111214] ${statusDot[m.status]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#e3e5e8] truncate">{m.name}</p>
                  <p className="text-[10px] text-[#60646c]">Joined {m.joined}</p>
                </div>
              </div>
              <div>
                <Badge variant={roleV[m.role] ?? "muted"}>{m.role}</Badge>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-semibold text-[#5865f2]">Lv.{m.level}</span>
                </div>
                <XpBar xp={m.xp} level={m.level} />
              </div>
              <span className="text-sm text-[#949ba4]">{m.msgs.toLocaleString()}</span>
              <div>
                {m.warnings > 0 ? (
                  <Badge variant={m.warnings >= 3 ? "danger" : "warning"}>{m.warnings} warn{m.warnings > 1 ? "s" : ""}</Badge>
                ) : (
                  <span className="text-xs text-[#60646c]">None</span>
                )}
              </div>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 rounded-lg border border-[#2b2d31] text-xs text-[#949ba4] hover:bg-[#1e1f23] transition-colors">View</button>
                {m.role !== "admin" && (
                  <button className="px-2.5 py-1 rounded-lg border border-[#f23f42]/20 text-xs text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors">Kick</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
