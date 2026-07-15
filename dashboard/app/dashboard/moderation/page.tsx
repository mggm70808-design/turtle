"use client";

import { useState } from "react";
import { Search, UserX, Clock, AlertTriangle, Gavel, FileText, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

type TabKey = "cases" | "warnings" | "bans";

const CASES = [
  { id: "C-041", user: "toxic_user#1234", av: "T", action: "ban",     reason: "Hate speech, repeated offenses",     mod: "AdminX",   date: "Jul 15, 2026", active: true  },
  { id: "C-040", user: "spammer#5678",    av: "S", action: "warn",    reason: "Posting invite links",               mod: "Mod_Sara", date: "Jul 15, 2026", active: true  },
  { id: "C-039", user: "rulebreak#9999",  av: "R", action: "kick",    reason: "Breaking server rules #3",           mod: "AdminX",   date: "Jul 14, 2026", active: false },
  { id: "C-038", user: "louduser#4321",   av: "L", action: "timeout", reason: "Disruptive voice channel behavior",  mod: "Mod_Ali",  date: "Jul 14, 2026", active: false },
  { id: "C-037", user: "reformed#0001",   av: "R", action: "unban",   reason: "Appeal accepted",                   mod: "AdminX",   date: "Jul 13, 2026", active: false },
  { id: "C-036", user: "baduser#1111",    av: "B", action: "warn",    reason: "Inappropriate profile picture",      mod: "Mod_Sara", date: "Jul 12, 2026", active: false },
];
const WARNINGS = [
  { user: "spammer#5678",  av: "S", count: 3, lastReason: "Posting invite links",  lastDate: "Jul 15", mod: "Mod_Sara" },
  { user: "baduser#1111",  av: "B", count: 2, lastReason: "Inappropriate profile", lastDate: "Jul 12", mod: "Mod_Sara" },
  { user: "annoying#3333", av: "A", count: 1, lastReason: "Caps lock abuse",        lastDate: "Jul 10", mod: "Mod_Ali"  },
];
const BANS = [
  { user: "toxic_user#1234", av: "T", reason: "Hate speech",         date: "Jul 15", mod: "AdminX", permanent: true  },
  { user: "troll#2222",      av: "T", reason: "Trolling/harassment", date: "Jul 11", mod: "AdminX", permanent: false },
];

const actionV: Record<string, "danger"|"warning"|"success"|"muted"> = {
  ban: "danger", kick: "danger", warn: "warning", timeout: "warning", unban: "success",
};

function Av({ l }: { l: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-[#5865f2]/20 text-[#5865f2] text-xs font-bold flex items-center justify-center shrink-0">
      {l}
    </div>
  );
}

export default function ModerationPage() {
  const [tab, setTab] = useState<TabKey>("cases");
  const [search, setSearch] = useState("");
  const [filterAct, setFilterAct] = useState("all");

  const filtered = CASES.filter((c) => {
    const ms = c.user.toLowerCase().includes(search.toLowerCase()) || c.reason.toLowerCase().includes(search.toLowerCase());
    const mf = filterAct === "all" || c.action === filterAct;
    return ms && mf;
  });

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "cases",    label: "All Cases",   count: CASES.length    },
    { key: "warnings", label: "Warnings",    count: WARNINGS.length },
    { key: "bans",     label: "Active Bans", count: BANS.length     },
  ];

  return (
    <div>
      <PageHeader title="Moderation" description="Manage server cases, warnings, and bans." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Cases"  value={CASES.length}                                    icon={FileText}      color="blue"   />
        <StatCard label="Active Bans"  value={BANS.length}                                     icon={UserX}         color="red"    />
        <StatCard label="Warnings"     value={WARNINGS.reduce((a, w) => a + w.count, 0)}       icon={AlertTriangle} color="yellow" />
        <StatCard label="Active Cases" value={CASES.filter((c) => c.active).length}            icon={Gavel}         color="purple" />
      </div>

      <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center justify-between border-b border-[#2b2d31] px-4">
          <div className="flex">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key ? "border-[#5865f2] text-[#5865f2]" : "border-transparent text-[#949ba4] hover:text-[#e3e5e8]"
                }`}
              >
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded ${tab === t.key ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#1e1f23] text-[#60646c]"}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#60646c]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="bg-[#1e1f23] border border-[#2b2d31] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#e3e5e8] placeholder:text-[#60646c] focus:outline-none focus:border-[#5865f2] w-40"
              />
            </div>
            {tab === "cases" && (
              <div className="relative">
                <select
                  value={filterAct}
                  onChange={(e) => setFilterAct(e.target.value)}
                  className="appearance-none bg-[#1e1f23] border border-[#2b2d31] rounded-lg pl-3 pr-7 py-1.5 text-xs text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                >
                  <option value="all">All Actions</option>
                  <option value="ban">Ban</option>
                  <option value="kick">Kick</option>
                  <option value="warn">Warn</option>
                  <option value="timeout">Timeout</option>
                  <option value="unban">Unban</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#60646c] pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Cases */}
        {tab === "cases" && (
          <>
            <div className="grid grid-cols-[2fr_3fr_1.2fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#1e1f23]">
              {["User", "Reason", "Moderator", "Date", "Actions"].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-[#1e1f23]">
              {filtered.map((c) => (
                <div key={c.id} className="grid grid-cols-[2fr_3fr_1.2fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Av l={c.av} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#e3e5e8] truncate">{c.user}</p>
                      <p className="text-[10px] text-[#60646c]">{c.id}</p>
                    </div>
                  </div>
                  <div className="min-w-0 flex flex-col gap-1">
                    <p className="text-xs text-[#949ba4] truncate">{c.reason}</p>
                    <Badge variant={actionV[c.action] ?? "muted"}>{c.action}</Badge>
                  </div>
                  <span className="text-sm text-[#949ba4]">{c.mod}</span>
                  <span className="text-xs text-[#60646c]">{c.date}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-lg border border-[#2b2d31] text-xs text-[#949ba4] hover:bg-[#1e1f23] transition-colors">View</button>
                    {c.action === "ban" && <button className="px-2.5 py-1 rounded-lg border border-[#f23f42]/20 text-xs text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors">Unban</button>}
                    {c.action === "warn" && <button className="px-2.5 py-1 rounded-lg border border-[#f0b232]/20 text-xs text-[#f0b232] hover:bg-[#f0b232]/10 transition-colors">Remove</button>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-[#60646c]">No cases found.</div>
              )}
            </div>
          </>
        )}

        {/* Warnings */}
        {tab === "warnings" && (
          <>
            <div className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#1e1f23]">
              {["User", "Last Reason", "Count", "Date", "Actions"].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-[#1e1f23]">
              {WARNINGS.filter((w) => w.user.toLowerCase().includes(search.toLowerCase())).map((w, i) => (
                <div key={i} className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Av l={w.av} />
                    <p className="text-sm font-medium text-[#e3e5e8] truncate">{w.user}</p>
                  </div>
                  <p className="text-sm text-[#949ba4] truncate">{w.lastReason}</p>
                  <Badge variant={w.count >= 3 ? "danger" : w.count >= 2 ? "warning" : "muted"}>{w.count}x</Badge>
                  <span className="text-xs text-[#60646c]">{w.lastDate}</span>
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1 rounded-lg border border-[#f0b232]/20 text-xs text-[#f0b232] hover:bg-[#f0b232]/10 transition-colors">Clear</button>
                    <button className="px-2.5 py-1 rounded-lg border border-[#f23f42]/20 text-xs text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors">Ban</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bans */}
        {tab === "bans" && (
          <>
            <div className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#1e1f23]">
              {["User", "Reason", "Type", "Date", "Actions"].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-[#1e1f23]">
              {BANS.filter((b) => b.user.toLowerCase().includes(search.toLowerCase())).map((b, i) => (
                <div key={i} className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Av l={b.av} />
                    <p className="text-sm font-medium text-[#e3e5e8] truncate">{b.user}</p>
                  </div>
                  <p className="text-sm text-[#949ba4] truncate">{b.reason}</p>
                  <Badge variant={b.permanent ? "danger" : "warning"}>{b.permanent ? "Permanent" : "Temporary"}</Badge>
                  <span className="text-xs text-[#60646c]">{b.date}</span>
                  <button className="px-2.5 py-1 rounded-lg border border-[#f23f42]/20 text-xs text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors">Unban</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-4 bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
        <p className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Ban User",      icon: UserX,         cls: "text-[#f23f42] border-[#f23f42]/20 hover:bg-[#f23f42]/10" },
            { label: "Kick User",     icon: UserX,         cls: "text-[#f23f42] border-[#f23f42]/20 hover:bg-[#f23f42]/10" },
            { label: "Timeout User",  icon: Clock,         cls: "text-[#f0b232] border-[#f0b232]/20 hover:bg-[#f0b232]/10" },
            { label: "Warn User",     icon: AlertTriangle, cls: "text-[#f0b232] border-[#f0b232]/20 hover:bg-[#f0b232]/10" },
            { label: "View All Logs", icon: FileText,      cls: "text-[#949ba4] border-[#2b2d31] hover:bg-[#1e1f23]"       },
          ].map(({ label, icon: Icon, cls }) => (
            <button key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${cls}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
