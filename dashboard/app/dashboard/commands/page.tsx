"use client";

import { useEffect, useState } from "react";
import { Search, Zap, Settings } from "lucide-react";

interface Command {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  cooldown: number;
}

export default function CommandsPage() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCommands();
  }, [search, category]);

  const fetchCommands = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(category !== "all" && { category }),
      });

      const response = await fetch(`/api/commands?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCommands(data.commands || []);
        if (data.categories && categories.length === 0) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error("[v0] Failed to fetch commands:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCommand = async (commandId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/commands/${commandId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (response.ok) {
        setCommands(
          commands.map((cmd) =>
            cmd.id === commandId ? { ...cmd, enabled: !cmd.enabled } : cmd
          )
        );
      }
    } catch (error) {
      console.error("[v0] Failed to toggle command:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Command Management
        </h1>
        <p className="text-gray-400">
          Enable, disable, and configure bot commands
        </p>
      </div>

      <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400">
              Loading commands...
            </div>
          ) : commands.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400">
              No commands found
            </div>
          ) : (
            commands.map((cmd) => (
              <div
                key={cmd.id}
                className="p-6 flex items-start justify-between hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <h3 className="text-white font-bold text-lg">
                      /{cmd.name}
                    </h3>
                    <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
                      {cmd.category}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">{cmd.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Cooldown: {cmd.cooldown}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => toggleCommand(cmd.id, cmd.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cmd.enabled ? "bg-green-600" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cmd.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>

                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
