"use client";

import { useState } from "react";
import { Star, LogIn, LogOut } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Toggle";

export default function WelcomePage() {
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [goodbyeEnabled, setGoodbyeEnabled] = useState(false);
  const [dmEnabled, setDmEnabled]           = useState(false);
  const [welcomeMsg, setWelcomeMsg]         = useState("Welcome to the server, {user}! You are member #{count}. Please read the rules in #rules.");
  const [goodbyeMsg, setGoodbyeMsg]         = useState("Goodbye, {user}. We hope to see you again!");
  const [dmMsg, setDmMsg]                   = useState("Welcome to **{server}**! Check out #rules and #info to get started.");
  const [welcomeCh, setWelcomeCh]           = useState("#welcome");
  const [goodbyeCh, setGoodbyeCh]           = useState("#general");
  const [saved, setSaved]                   = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const VARS = ["{user}", "{server}", "{count}", "{id}"];

  return (
    <div>
      <PageHeader title="Welcome & Goodbye" description="Configure join and leave messages." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Welcome */}
        <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-[#23a55a]" />
              <span className="text-sm font-semibold text-[#e3e5e8]">Welcome Message</span>
            </div>
            <Toggle enabled={welcomeEnabled} onChange={setWelcomeEnabled} />
          </div>

          <div className={welcomeEnabled ? "" : "opacity-40 pointer-events-none"}>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#60646c] mb-1 block">Channel</label>
                <input
                  value={welcomeCh}
                  onChange={(e) => setWelcomeCh(e.target.value)}
                  className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                />
              </div>
              <div>
                <label className="text-xs text-[#60646c] mb-1 block">Message</label>
                <textarea
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] placeholder:text-[#60646c] focus:outline-none focus:border-[#5865f2] resize-none"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-3 bg-[#1e1f23] rounded-lg p-3 border-l-2 border-[#5865f2]">
              <p className="text-[10px] text-[#60646c] mb-1">Preview</p>
              <p className="text-xs text-[#e3e5e8] leading-relaxed">
                {welcomeMsg.replace("{user}", "@NewMember").replace("{server}", "My Server").replace("{count}", "1,234").replace("{id}", "123456789")}
              </p>
            </div>
          </div>
        </div>

        {/* Goodbye */}
        <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-[#f23f42]" />
              <span className="text-sm font-semibold text-[#e3e5e8]">Goodbye Message</span>
            </div>
            <Toggle enabled={goodbyeEnabled} onChange={setGoodbyeEnabled} />
          </div>

          <div className={goodbyeEnabled ? "" : "opacity-40 pointer-events-none"}>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#60646c] mb-1 block">Channel</label>
                <input
                  value={goodbyeCh}
                  onChange={(e) => setGoodbyeCh(e.target.value)}
                  className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2]"
                />
              </div>
              <div>
                <label className="text-xs text-[#60646c] mb-1 block">Message</label>
                <textarea
                  value={goodbyeMsg}
                  onChange={(e) => setGoodbyeMsg(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2] resize-none"
                />
              </div>
            </div>
            <div className="mt-3 bg-[#1e1f23] rounded-lg p-3 border-l-2 border-[#f23f42]">
              <p className="text-[10px] text-[#60646c] mb-1">Preview</p>
              <p className="text-xs text-[#e3e5e8] leading-relaxed">
                {goodbyeMsg.replace("{user}", "LeavingUser#0001").replace("{server}", "My Server")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DM welcome */}
      <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#f0b232]" />
            <span className="text-sm font-semibold text-[#e3e5e8]">DM Welcome Message</span>
          </div>
          <Toggle enabled={dmEnabled} onChange={setDmEnabled} />
        </div>
        <div className={dmEnabled ? "" : "opacity-40 pointer-events-none"}>
          <textarea
            value={dmMsg}
            onChange={(e) => setDmMsg(e.target.value)}
            rows={2}
            className="w-full bg-[#1e1f23] border border-[#2b2d31] rounded-lg px-3 py-2 text-sm text-[#e3e5e8] focus:outline-none focus:border-[#5865f2] resize-none"
          />
        </div>
      </div>

      {/* Variables + save */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#60646c]">Variables:</span>
          {VARS.map((v) => (
            <code key={v} className="text-xs bg-[#1e1f23] border border-[#2b2d31] text-[#5865f2] px-1.5 py-0.5 rounded">{v}</code>
          ))}
        </div>
        <button
          onClick={save}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? "bg-[#23a55a] text-white" : "bg-[#5865f2] hover:bg-[#4752c4] text-white"
          }`}
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
