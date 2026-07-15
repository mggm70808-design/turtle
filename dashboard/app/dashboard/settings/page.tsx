"use client";

import { useEffect, useState } from "react";
import { Save, AlertCircle } from "lucide-react";

interface GuildSettings {
  prefix: string;
  welcome_enabled: boolean;
  welcome_message: string;
  welcome_channel: string;
  moderation_channel: string;
  logging_enabled: boolean;
  music_enabled: boolean;
  economy_enabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GuildSettings>({
    prefix: "!",
    welcome_enabled: true,
    welcome_message: "Welcome to our server!",
    welcome_channel: "",
    moderation_channel: "",
    logging_enabled: true,
    music_enabled: true,
    economy_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("[v0] Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch (error) {
      console.error("[v0] Failed to save settings:", error);
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Server Settings
        </h1>
        <p className="text-gray-400">
          Configure bot behavior for your server
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-500/20 border border-green-500/50"
              : "bg-red-500/20 border border-red-500/50"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          />
          <p
            className={
              message.type === "success" ? "text-green-400" : "text-red-400"
            }
          >
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-secondary rounded-lg border border-gray-700 p-6 space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">
              Command Prefix
            </label>
            <input
              type="text"
              maxLength={3}
              value={settings.prefix}
              onChange={(e) =>
                setSettings({ ...settings, prefix: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <p className="text-gray-400 text-sm mt-1">
              The prefix used for bot commands
            </p>
          </div>

          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Welcome Settings
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.welcome_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcome_enabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 accent-primary"
                />
                <span className="text-white font-medium">
                  Enable Welcome Messages
                </span>
              </label>

              {settings.welcome_enabled && (
                <>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Welcome Channel ID
                    </label>
                    <input
                      type="text"
                      value={settings.welcome_channel}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          welcome_channel: e.target.value,
                        })
                      }
                      placeholder="123456789..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Welcome Message
                    </label>
                    <textarea
                      value={settings.welcome_message}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          welcome_message: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Feature Toggle
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.logging_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      logging_enabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 accent-primary"
                />
                <span className="text-white font-medium">
                  Enable Logging
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.music_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      music_enabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 accent-primary"
                />
                <span className="text-white font-medium">
                  Enable Music
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.economy_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      economy_enabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 accent-primary"
                />
                <span className="text-white font-medium">
                  Enable Economy
                </span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
