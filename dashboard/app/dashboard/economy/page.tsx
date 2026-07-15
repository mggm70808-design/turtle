"use client";

import { useState } from "react";
import { Coins, TrendingUp, ShoppingBag, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Toggle } from "@/components/ui/Toggle";

const TOP_BALANCES = [
  { rank: 1, name: "ElitePlayer",  av: "E", balance: 48500, daily: "+1200" },
  { rank: 2, name: "ProGamer99",   av: "P", balance: 32100, daily: "+880"  },
  { rank: 3, name: "CoolDude",     av: "C", balance: 21600, daily: "+340"  },
  { rank: 4, name: "Sunshine",     av: "S", balance: 14200, daily: "+210"  },
  { rank: 5, name: "FastRunner",   av: "F", balance: 9800,  daily: "+90"   },
];

const SHOP_ITEMS = [
  { name: "VIP Tag",          price: 5000,  type: "role",  stock: "unlimited", sales: 12 },
  { name: "Color Role",       price: 2000,  type: "role",  stock: "unlimited", sales: 34 },
  { name: "Custom Nickname",  price: 1500,  type: "perk",  stock: "unlimited", sales: 8  },
  { name: "Trophy Badge",     price: 10000, type: "cosmetic", stock: "5",      sales: 2  },
];

const RECENT_TX = [
  { user: "ElitePlayer", av: "E", type: "daily",    amount: +200,  time: "2m ago"  },
  { user: "ProGamer99",  av: "P", type: "shop",     amount: -2000, time: "15m ago" },
  { user: "CoolDude",    av: "C", type: "work",     amount: +350,  time: "1h ago"  },
  { user: "Sunshine",    av: "S", type: "daily",    amount: +200,  time: "2h ago"  },
  { user: "NightOwl",    av: "N", type: "transfer", amount: -500,  time: "3h ago"  },
];

export default function EconomyPage() {
  const [economyEnabled, setEconomyEnabled] = useState(true);
  const [dailyAmount, setDailyAmount] = useState("200");
  const [currencyName, setCurrencyName] = useState("coins");
  const [workEnabled, setWorkEnabled] = useState(true);

  return (
    <div>
      <PageHeader title="Economy" description="Manage the server economy, shop, and balances." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Users"    value={89}          icon={Coins}       color="yellow" />
        <StatCard label="In Circulation" value="284k"        icon={TrendingUp}  color="green"  />
        <StatCard label="Shop Items"     value={SHOP_ITEMS.length} icon={ShoppingBag} color="blue" />
        <StatCard label="Transactions"   value="1.2k"        icon={Zap}         color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings */}
        <div className="space-y-3">
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[#e3e5e8] mb-4">Economy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e3e5e8]">Economy System</p>
                  <p className="text-xs text-[#60646c]">Enable/disable economy</p>
                </div>
                <Toggle checked={economyEnabled} onChange={setEconomyEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e3e5e8]">Work Command</p>
                  <p className="text-xs text-[#60646c]">Allow users to earn via /work</p>
                </div>
                <Toggle checked={workEnabled} onChange={setWorkEnabled} />
              </div>
              <div>
                <label className="text-xs font-medium text-[#949ba4] block mb-1.5">Currency Name</label>
                <input
                  value={currencyName}
                  onChange={(e) => setCurrencyName(e.target.value)}
                  className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#949ba4] block mb-1.5">Daily Reward</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dailyAmount}
                    onChange={(e) => setDailyAmount(e.target.value)}
                    className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                  />
                  <span className="text-xs text-[#60646c] shrink-0">{currencyName}</span>
                </div>
              </div>
              <button className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium py-2 rounded-lg transition-colors">
                Save Settings
              </button>
            </div>
          </div>

          {/* Shop */}
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#e3e5e8]">Shop Items</h2>
              <button className="text-xs text-[#5865f2] hover:underline">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {SHOP_ITEMS.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 py-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#e3e5e8] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#60646c]">{item.sales} sold</p>
                  </div>
                  <Badge variant="muted">{item.type}</Badge>
                  <span className="text-xs font-semibold text-[#f0b232]">{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top balances */}
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2b2d31]">
              <h2 className="text-sm font-semibold text-[#e3e5e8]">Top Balances</h2>
            </div>
            <div className="divide-y divide-[#1e1f23]">
              {TOP_BALANCES.map((u) => (
                <div key={u.rank} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                  <span className="text-xs font-bold text-[#60646c] w-4 text-center">{u.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-[#f0b232]/20 text-[#f0b232] text-xs font-bold flex items-center justify-center shrink-0">
                    {u.av}
                  </div>
                  <p className="flex-1 text-sm font-medium text-[#e3e5e8]">{u.name}</p>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#f0b232]">{u.balance.toLocaleString()}</p>
                    <p className="text-[10px] text-[#23a55a]">{u.daily}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2b2d31]">
              <h2 className="text-sm font-semibold text-[#e3e5e8]">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-[#1e1f23]">
              {RECENT_TX.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1b1e] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#5865f2]/20 text-[#5865f2] text-xs font-bold flex items-center justify-center shrink-0">
                    {tx.av}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#e3e5e8] font-medium">{tx.user}</p>
                    <Badge variant="muted">{tx.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? "text-[#23a55a]" : "text-[#f23f42]"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#60646c]">{tx.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
