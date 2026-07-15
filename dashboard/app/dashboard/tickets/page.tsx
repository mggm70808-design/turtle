"use client";

import { useState } from "react";
import { Ticket, Clock, CheckCircle, XCircle, Search, MessageSquare, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Toggle } from "@/components/ui/Toggle";

const TICKETS = [
  { id: "T-088", user: "CoolDude",    av: "C", subject: "Can't access #vip channel",       status: "open",   priority: "high",   assigned: "Mod_Sara", created: "Jul 15, 2026", msgs: 4  },
  { id: "T-087", user: "NightOwl",    av: "N", subject: "Report: spammer in general",       status: "open",   priority: "medium", assigned: "Mod_Ali",  created: "Jul 15, 2026", msgs: 2  },
  { id: "T-086", user: "FastRunner",  av: "F", subject: "Appealing my warning",             status: "pending",priority: "low",    assigned: "Unassigned",created: "Jul 14, 2026", msgs: 1  },
  { id: "T-085", user: "ProGamer99",  av: "P", subject: "Bot not responding to commands",   status: "closed", priority: "medium", assigned: "AdminX",   created: "Jul 13, 2026", msgs: 7  },
  { id: "T-084", user: "Sunshine",    av: "S", subject: "Request: Custom role color",       status: "closed", priority: "low",    assigned: "Mod_Sara", created: "Jul 12, 2026", msgs: 3  },
];

const CATEGORIES = [
  { name: "Support",      emoji: "🎫", count: 12 },
  { name: "Reports",      emoji: "⚠️",  count: 5  },
  { name: "Appeals",      emoji: "📝",  count: 3  },
  { name: "Suggestions",  emoji: "💡",  count: 8  },
];

const statusV: Record<string, "success" | "warning" | "muted"> = {
  open: "success", pending: "warning", closed: "muted",
};
const priorityV: Record<string, "danger" | "warning" | "muted"> = {
  high: "danger", medium: "warning", low: "muted",
};

export default function TicketsPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [systemEnabled, setSystem]  = useState(true);

  const filtered = TICKETS.filter((t) => {
    const ms = t.user.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || t.status === statusFilter;
    return ms && mf;
  });

  const open    = TICKETS.filter((t) => t.status === "open").length;
  const pending = TICKETS.filter((t) => t.status === "pending").length;
  const closed  = TICKETS.filter((t) => t.status === "closed").length;

  return (
    <div>
      <PageHeader title="Tickets" description="Manage support tickets and categories." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Tickets"   value={TICKETS.length} icon={Ticket}       color="blue"   />
        <StatCard label="Open"            value={open}           icon={MessageSquare} color="green"  />
        <StatCard label="Pending"         value={pending}        icon={Clock}         color="yellow" />
        <StatCard label="Closed"          value={closed}         icon={CheckCircle}   color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* System settings */}
        <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-[#60646c] uppercase tracking-wider">System Settings</p>
          {[
            { label: "Ticket System",         sub: "Enable/disable ticket creation",    val: systemEnabled, set: setSystem },
            { label: "Auto-close Inactive",   sub: "Close after 72h of inactivity",     val: true,  set: () => {} },
            { label: "Transcript Logging",    sub: "Save transcripts on close",         val: true,  set: () => {} },
            { label: "Claim System",          sub: "Staff can claim tickets",           val: false, set: () => {} },
          ].map(({ label, sub, val, set }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-[#e3e5e8]">{label}</p>
                <p className="text-[11px] text-[#60646c]">{sub}</p>
              </div>
              <Toggle enabled={val} onChange={set} />
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="lg:col-span-2 bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#60646c] uppercase tracking-wider mb-3">Ticket Categories</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm font-medium text-[#e3e5e8]">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#60646c]">{cat.count} tickets</span>
                  <button className="text-[10px] text-[#949ba4] hover:text-[#e3e5e8] transition-colors">Edit</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-2 w-full border border-dashed border-[#2b2d31] rounded-lg py-2 text-xs text-[#60646c] hover:text-[#e3e5e8] hover:border-[#5865f2] transition-colors">
            + Add Category
          </button>
        </div>
      </div>

      {/* Tickets table */}
      <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2b2d31]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#60646c]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets…"
              className="bg-[#1e1f23] border border-[#2b2d31] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#e3e5e8] placeholder:text-[#60646c] focus:outline-none focus:border-[#5865f2] w-44"
            />
          </div>
          <div className="flex gap-1">
            {["all", "open", "pending", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s ? "bg-[#5865f2] text-white" : "bg-[#1e1f23] text-[#949ba4] hover:text-[#e3e5e8]"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#1e1f23]">
          {["ID", "Subject", "Status", "Priority", "Assigned", "Actions"].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-[#1e1f23]">
          {filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
              <span className="text-xs font-mono text-[#60646c]">{t.id}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#e3e5e8] truncate">{t.subject}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3 text-[#60646c]" />
                  <span className="text-[11px] text-[#60646c]">{t.user}</span>
                  <span className="text-[11px] text-[#60646c]">· {t.msgs} messages · {t.created}</span>
                </div>
              </div>
              <Badge variant={statusV[t.status]}>{t.status}</Badge>
              <Badge variant={priorityV[t.priority]}>{t.priority}</Badge>
              <span className="text-xs text-[#949ba4] truncate">{t.assigned}</span>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 rounded-lg border border-[#2b2d31] text-xs text-[#949ba4] hover:bg-[#1e1f23] transition-colors">Open</button>
                {t.status !== "closed" && (
                  <button className="px-2.5 py-1 rounded-lg border border-[#f23f42]/20 text-xs text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors">Close</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
