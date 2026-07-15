"use client";

import { useState } from "react";
import { Hash, Shield, Users, MessageSquare, Settings, Music } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Toggle";

const LOG_GROUPS = [
  {
    group: "Moderation",
    icon: Shield,
    color: "text-[#f23f42]",
    channel: "#mod-logs",
    events: [
      { id: "ban",     label: "Member Banned",      enabled: true  },
      { id: "kick",    label: "Member Kicked",       enabled: true  },
      { id: "warn",    label: "Member Warned",       enabled: true  },
      { id: "timeout", label: "Member Timed Out",    enabled: true  },
      { id: "unban",   label: "Member Unbanned",     enabled: false },
    ],
  },
  {
    group: "Members",
    icon: Users,
    color: "text-[#23a55a]",
    channel: "#member-logs",
    events: [
      { id: "join",         label: "Member Joined",        enabled: true  },
      { id: "leave",        label: "Member Left",          enabled: true  },
      { id: "role_add",     label: "Role Added",           enabled: false },
      { id: "role_remove",  label: "Role Removed",         enabled: false },
      { id: "nickname",     label: "Nickname Changed",     enabled: false },
    ],
  },
  {
    group: "Messages",
    icon: MessageSquare,
    color: "text-[#5865f2]",
    channel: "#message-logs",
    events: [
      { id: "msg_delete",   label: "Message Deleted",      enabled: true  },
      { id: "msg_edit",     label: "Message Edited",       enabled: true  },
      { id: "bulk_delete",  label: "Bulk Delete",          enabled: true  },
    ],
  },
  {
    group: "Server",
    icon: Settings,
    color: "text-[#f0b232]",
    channel: "#server-logs",
    events: [
      { id: "channel_create", label: "Channel Created",    enabled: false },
      { id: "channel_delete", label: "Channel Deleted",    enabled: false },
      { id: "role_create",    label: "Role Created",       enabled: false },
      { id: "role_delete",    label: "Role Deleted",       enabled: false },
    ],
  },
  {
    group: "Voice",
    icon: Music,
    color: "text-[#00aff4]",
    channel: "#voice-logs",
    events: [
      { id: "vc_join",   label: "Joined Voice Channel",   enabled: false },
      { id: "vc_leave",  label: "Left Voice Channel",     enabled: false },
      { id: "vc_move",   label: "Moved Voice Channel",    enabled: false },
    ],
  },
];

export default function LoggingPage() {
  const [groups, setGroups] = useState(LOG_GROUPS);
  const [saved, setSaved]   = useState(false);

  const toggleEvent = (gi: number, ei: number) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gi
          ? { ...g, events: g.events.map((e, j) => (j === ei ? { ...e, enabled: !e.enabled } : e)) }
          : g
      )
    );
  };

  const updateChannel = (gi: number, val: string) => {
    setGroups((prev) => prev.map((g, i) => (i === gi ? { ...g, channel: val } : g)));
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <PageHeader title="Logging" description="Configure which events are logged and where." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {groups.map((g, gi) => {
          const Icon = g.icon;
          const enabled = g.events.filter((e) => e.enabled).length;
          return (
            <div key={g.group} className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
              {/* Group header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${g.color}`} />
                  <span className="text-sm font-semibold text-[#e3e5e8]">{g.group}</span>
                  <span className="text-xs text-[#60646c]">({enabled}/{g.events.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3 text-[#60646c]" />
                  <input
                    value={g.channel}
                    onChange={(e) => updateChannel(gi, e.target.value)}
                    className="bg-[#1e1f23] border border-[#2b2d31] rounded px-2 py-1 text-xs text-[#e3e5e8] focus:outline-none focus:border-[#5865f2] w-32"
                  />
                </div>
              </div>

              {/* Events */}
              <div className="space-y-2">
                {g.events.map((ev, ei) => (
                  <div key={ev.id} className="flex items-center justify-between py-1">
                    <span className="text-sm text-[#949ba4]">{ev.label}</span>
                    <Toggle enabled={ev.enabled} onChange={() => toggleEvent(gi, ei)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? "bg-[#23a55a] text-white" : "bg-[#5865f2] hover:bg-[#4752c4] text-white"
          }`}
        >
          {saved ? "Saved!" : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
