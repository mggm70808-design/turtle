"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Filter, RotateCcw } from "lucide-react";

interface ModLog {
  id: string;
  action: string;
  target_user: string;
  moderator: string;
  reason: string;
  created_at: string;
}

type ActionFilter = "all" | "warn" | "kick" | "ban" | "timeout";

export default function ModerationPage() {
  const [logs, setLogs] = useState<ModLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActionFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(filter !== "all" && { action: filter }),
      });

      const response = await fetch(`/api/moderation/logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("[v0] Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "warn":
        return "bg-yellow-500/20 text-yellow-400";
      case "kick":
        return "bg-orange-500/20 text-orange-400";
      case "ban":
        return "bg-red-500/20 text-red-400";
      case "timeout":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Moderation Logs
        </h1>
        <p className="text-gray-400">
          View and manage moderation actions
        </p>
      </div>

      <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                Filter by action:
              </span>
            </div>
            {(
              ["all", "warn", "kick", "ban", "timeout"] as ActionFilter[]
            ).map((action) => (
              <button
                key={action}
                onClick={() => {
                  setFilter(action);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === action
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400">
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No moderation logs found</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action.toUpperCase()}
                    </span>
                    <span className="text-white font-medium">
                      {log.target_user}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Moderator</p>
                    <p className="text-white font-medium">{log.moderator}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Reason</p>
                    <p className="text-white">{log.reason || "No reason provided"}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600 flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Reverse Action
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {logs.length} logs
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
