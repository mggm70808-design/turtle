"use client";

import { useState } from "react";
import { Gift, Clock, Users, Trophy, Plus, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const GIVEAWAYS = [
  { id: "G-12", prize: "Discord Nitro 1 Month",  channel: "#giveaways",  entries: 142, winners: 1, ends: "Jul 20, 2026", status: "active",  host: "AdminX",   duration: "7d"  },
  { id: "G-11", prize: "Steam Gift Card $25",     channel: "#giveaways",  entries: 89,  winners: 2, ends: "Jul 18, 2026", status: "active",  host: "Mod_Sara", duration: "3d"  },
  { id: "G-10", prize: "Custom Discord Role",     channel: "#events",     entries: 201, winners: 3, ends: "Jul 15, 2026", status: "ended",   host: "AdminX",   duration: "14d" },
  { id: "G-09", prize: "Minecraft Java Edition",  channel: "#giveaways",  entries: 310, winners: 1, ends: "Jul 10, 2026", status: "ended",   host: "AdminX",   duration: "7d"  },
  { id: "G-08", prize: "Spotify Premium 3 Month", channel: "#premium",    entries: 176, winners: 1, ends: "Jul 1, 2026",  status: "ended",   host: "Mod_Ali",  duration: "5d"  },
];

export default function GiveawaysPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [prize, setPrize]           = useState("");
  const [duration, setDuration]     = useState("7d");
  const [winnersN, setWinnersN]     = useState("1");
  const [channel, setChannel]       = useState("#giveaways");

  const active = GIVEAWAYS.filter((g) => g.status === "active");
  const ended  = GIVEAWAYS.filter((g) => g.status === "ended");

  return (
    <div>
      <PageHeader
        title="Giveaways"
        description="Create and manage server giveaways."
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> New Giveaway
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Giveaways"  value={GIVEAWAYS.length}   icon={Gift}   color="purple" />
        <StatCard label="Active Now"        value={active.length}      icon={Clock}  color="green"  />
        <StatCard label="Total Entries"     value={GIVEAWAYS.reduce((a,g) => a + g.entries, 0)} icon={Users} color="blue" />
        <StatCard label="Prizes Awarded"    value={ended.reduce((a,g) => a + g.winners, 0)}     icon={Trophy} color="yellow" />
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-[#111214] border border-[#5865f2]/30 rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#e3e5e8]">Create Giveaway</p>
            <button onClick={() => setShowCreate(false)} className="text-xs text-[#60646c] hover:text-[#e3e5e8]">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-[#60646c] mb-1 block">Prize</label>
              <input
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="e.g. Discord Nitro"
                className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] placeholder:text-[#60646c] focus:outline-none focus:border-[#5865f2]"
              />
            </div>
            <div>
              <label className="text-xs text-[#60646c] mb-1 block">Channel</label>
              <input
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="#giveaways"
                className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] placeholder:text-[#60646c] focus:outline-none focus:border-[#5865f2]"
              />
            </div>
            <div>
              <label className="text-xs text-[#60646c] mb-1 block">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
              >
                {["1d","3d","7d","14d","30d"].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#60646c] mb-1 block">Winners</label>
              <input
                type="number"
                min="1"
                max="20"
                value={winnersN}
                onChange={(e) => setWinnersN(e.target.value)}
                className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
              />
            </div>
          </div>
          <button className="px-5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium rounded-lg transition-colors">
            Start Giveaway
          </button>
        </div>
      )}

      {/* Active */}
      {active.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-[#60646c] uppercase tracking-wider mb-2">Active</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {active.map((g) => (
              <div key={g.id} className="bg-[#111214] border border-[#5865f2]/20 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#e3e5e8]">{g.prize}</p>
                    <p className="text-xs text-[#60646c] mt-0.5">{g.channel} · hosted by {g.host}</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { l: "Entries",  v: g.entries },
                    { l: "Winners",  v: g.winners },
                    { l: "Ends",     v: g.ends.replace(", 2026","") },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-[#1e1f23] rounded-lg px-2 py-1.5 text-center">
                      <p className="text-xs font-semibold text-[#e3e5e8]">{v}</p>
                      <p className="text-[10px] text-[#60646c]">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-[#1e1f23] border border-[#2b2d31] hover:bg-[#2b2d31] rounded-lg text-xs text-[#949ba4] transition-colors">Edit</button>
                  <button className="flex-1 py-1.5 bg-[#f23f42]/10 border border-[#f23f42]/20 hover:bg-[#f23f42]/20 rounded-lg text-xs text-[#f23f42] transition-colors">End Early</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      <div>
        <p className="text-[11px] font-semibold text-[#60646c] uppercase tracking-wider mb-2">Past Giveaways</p>
        <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#1e1f23]">
            {["Prize", "Entries", "Winners", "Ended", "Actions"].map((h) => (
              <span key={h} className="text-[10px] font-semibold text-[#60646c] uppercase tracking-wider">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-[#1e1f23]">
            {ended.map((g) => (
              <div key={g.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                <div>
                  <p className="text-sm text-[#e3e5e8]">{g.prize}</p>
                  <p className="text-[11px] text-[#60646c]">{g.channel}</p>
                </div>
                <span className="text-sm text-[#949ba4]">{g.entries}</span>
                <span className="text-sm text-[#949ba4]">{g.winners}</span>
                <span className="text-xs text-[#60646c]">{g.ends}</span>
                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#2b2d31] text-xs text-[#949ba4] hover:bg-[#1e1f23] transition-colors">
                  <RotateCcw className="w-3 h-3" /> Reroll
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
