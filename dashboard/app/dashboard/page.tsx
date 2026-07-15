"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/cards/StatCard";
import {
  Users,
  Shield,
  Radio,
  Zap,
  Activity,
  Clock,
} from "lucide-react";

interface BotStats {
  guildCount: number;
  userCount: number;
  uptime: number;
  commandsUsed: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<BotStats>({
    guildCount: 0,
    userCount: 0,
    uptime: 0,
    commandsUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("[v0] Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {session?.user?.name || "User"}
        </h1>
        <p className="text-gray-400">
          Here&apos;s an overview of your bot&apos;s performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Guilds"
          value={loading ? "..." : stats.guildCount}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Total Users"
          value={loading ? "..." : stats.userCount}
          icon={Shield}
          color="success"
        />
        <StatCard
          title="Bot Uptime"
          value={loading ? "..." : formatUptime(stats.uptime)}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Commands Used"
          value={loading ? "..." : stats.commandsUsed}
          icon={Zap}
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-secondary rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-medium">Bot went online</p>
                <p className="text-gray-400 text-sm">Today at 10:30 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <Users className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-medium">New member joined</p>
                <p className="text-gray-400 text-sm">Today at 9:15 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <Radio className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-medium">System message sent</p>
                <p className="text-gray-400 text-sm">Yesterday at 5:45 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              View Members
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Check Logs
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Manage Commands
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
