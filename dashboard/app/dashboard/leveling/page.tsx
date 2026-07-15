"use client";

import { useState } from "react";
import { TrendingUp, Crown, Zap, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Toggle } from "@/components/ui/Toggle";

const LEADERBOARD = [
  { rank: 1,  name: "ElitePlayer",  av: "E", level: 42, xp: 8820, msgs: 1240, dailyXp: 120 },
  { rank: 2,  name: "ProGamer99",   av: "P", level: 35, xp: 6300, msgs: 892,  dailyXp: 88  },
  { rank: 3,  name: "CoolDude",     av: "C", level: 28, xp: 4200, msgs: 567,  dailyXp: 45  },
  { rank: 4,  name: "xXDarkXx",     av: "X", level: 21, xp: 2800, msgs: 341,  dailyXp: 30  },
  { rank: 5,  name: "Sunshine",     av: "S", level: 19, xp: 2280, msgs: 290,  dailyXp: 22  },
  { rank: 6,  name: "NightOwl",     av: "N", level: 15, xp: 1500, msgs: 201,  dailyXp: 14  },
  { rank: 7,  name: "FastRunner",   av: "F", level: 12, xp: 960,  msgs: 143,  dailyXp: 9   },
  { rank: 8,  name: "NewMember",    av: "N", level: 4,  xp: 120,  msgs: 89,   dailyXp: 5   },
];

const REWARDS = [
  { level: 5,  reward: "Member role",      type: "role"    },
  { level: 10, reward: "Access to #vip",   type: "channel" },
  { level: 20, reward: "Active role",      type: "role"    },
  { level: 30, reward: "VIP role",         type: "role"    },
  { level: 50, reward: "Legend role",      type: "role"    },
];

const rankColor = (r: number) =>
  r === 1 ? "text-[#f0b232]" : r === 2 ? "text-[#949ba4]" : r === 3 ? "text-[#cd7f32]" : "text-[#60646c]";

function XpBar({ xp, level }: { xp: number; level: number }) {
  const needed = (level + 1) * 200;
  const pct = Math.min((xp % needed) / needed * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#1e1f23] rounded-full overflow-hidden">
        <div className="h-full bg-[#5865f2] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-[#60646c]">{xp}</span>
    </div>
  );
}

export default function LevelingPage() {
  const [xpEnabled, setXpEnabled] = useState(true);
  const [xpPerMsg, setXpPerMsg] = useState("15");
  const [xpCooldown, setXpCooldown] = useState("60");
  const [lvlUpMsg, setLvlUpMsg] = useState(true);

  return (
    <div>
      <PageHeader title="Leveling" description="Configure the XP and leveling system." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Users"  value={LEADERBOARD.length} icon={Users}      color="blue"   />
        <StatCard label="Top Level"     value={42}                 icon={Crown}      color="yellow" />
        <StatCard label="Total XP Given" value="26.9k"            icon={Zap}        color="purple" />
        <StatCard label="XP Today"      value="333"               icon={TrendingUp} color="green"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[#e3e5e8] mb-4">XP Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e3e5e8]">XP System</p>
                  <p className="text-xs text-[#60646c]">Enable or disable leveling</p>
                </div>
                <Toggle checked={xpEnabled} onChange={setXpEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e3e5e8]">Level-up Message</p>
                  <p className="text-xs text-[#60646c]">Announce level ups in chat</p>
                </div>
                <Toggle checked={lvlUpMsg} onChange={setLvlUpMsg} />
              </div>
              <div>
                <label className="text-xs font-medium text-[#949ba4] block mb-1.5">XP Per Message</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={xpPerMsg}
                    onChange={(e) => setXpPerMsg(e.target.value)}
                    className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                  />
                  <span className="text-xs text-[#60646c] shrink-0">XP</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#949ba4] block mb-1.5">XP Cooldown</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={xpCooldown}
                    onChange={(e) => setXpCooldown(e.target.value)}
                    className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                  />
                  <span className="text-xs text-[#60646c] shrink-0">sec</span>
                </div>
              </div>
              <button className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium py-2 rounded-lg transition-colors">
                Save Settings
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#e3e5e8]">Level Rewards</h2>
              <button className="text-xs text-[#5865f2] hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {REWARDS.map((r) => (
                <div key={r.level} className="flex items-center gap-2.5 py-1.5">
                  <span className="text-xs font-bold text-[#5865f2] w-12">Lv.{r.level}</span>
                  <span className="flex-1 text-sm text-[#e3e5e8]">{r.reward}</span>
                  <Badge variant={r.type === "role" ? "default" : "info"}>{r.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2b2d31]">
            <h2 className="text-sm font-semibold text-[#e3e5e8]">Leaderboard</h2>
          </div>
          <div className="divide-y divide-[#1e1f23]">
            {LEADERBOARD.map((u) => (
              <div key={u.rank} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                <span className={`text-sm font-bold w-5 text-center ${rankColor(u.rank)}`}>
                  {u.rank <= 3 ? ["🥇","🥈","🥉"][u.rank-1] : u.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#5865f2]/20 text-[#5865f2] text-xs font-bold flex items-center justify-center shrink-0">
                  {u.av}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-[#e3e5e8] truncate">{u.name}</p>
                    <span className="text-xs font-bold text-[#5865f2] shrink-0 ml-2">Lv.{u.level}</span>
                  </div>
                  <XpBar xp={u.xp} level={u.level} />
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[#60646c]">{u.msgs.toLocaleString()} msgs</p>
                  <p className="text-[10px] text-[#23a55a]">+{u.dailyXp} today</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
