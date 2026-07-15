"use client";

import { useState } from "react";
import { Music, Volume2, List, Settings2, Play, Pause, SkipForward, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Toggle } from "@/components/ui/Toggle";

const QUEUE = [
  { pos: 1, title: "Blinding Lights",        artist: "The Weeknd",   dur: "3:20", requested: "ElitePlayer" },
  { pos: 2, title: "Stay",                   artist: "The Kid LAROI", dur: "2:21", requested: "ProGamer99"  },
  { pos: 3, title: "Levitating",             artist: "Dua Lipa",     dur: "3:23", requested: "CoolDude"    },
  { pos: 4, title: "Good 4 U",               artist: "Olivia Rodrigo",dur: "2:58", requested: "Sunshine"   },
];

export default function MusicPage() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [djMode, setDjMode] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [queue, setQueue] = useState(QUEUE);

  const removeFromQueue = (pos: number) => setQueue(queue.filter((t) => t.pos !== pos));

  return (
    <div>
      <PageHeader title="Music" description="Control the music player and queue." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Queue Length" value={queue.length}  icon={List}     color="blue"   />
        <StatCard label="Volume"       value={`${volume}%`} icon={Volume2}  color="green"  />
        <StatCard label="Status"       value={playing ? "Playing" : "Paused"} icon={Music} color={playing ? "green" : "yellow"} />
        <StatCard label="Listeners"    value={0}            icon={Settings2} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Player */}
        <div className="space-y-3">
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[#e3e5e8] mb-4">Now Playing</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#5865f2]/20 flex items-center justify-center">
                <Music className="w-8 h-8 text-[#5865f2]" />
              </div>
              {queue.length > 0 ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#e3e5e8]">{queue[0].title}</p>
                  <p className="text-xs text-[#60646c]">{queue[0].artist}</p>
                  <p className="text-[10px] text-[#5865f2] mt-1">Requested by {queue[0].requested}</p>
                </div>
              ) : (
                <p className="text-sm text-[#60646c]">No song playing</p>
              )}

              {/* Progress bar */}
              <div className="w-full">
                <div className="h-1 bg-[#1e1f23] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5865f2] rounded-full w-1/3" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#60646c]">1:06</span>
                  <span className="text-[10px] text-[#60646c]">{queue[0]?.dur ?? "0:00"}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg text-[#949ba4] hover:text-[#e3e5e8] hover:bg-[#1e1f23] transition-colors">
                  <SkipForward className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-10 h-10 rounded-full bg-[#5865f2] hover:bg-[#4752c4] flex items-center justify-center transition-colors"
                >
                  {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                </button>
                <button className="p-2 rounded-lg text-[#949ba4] hover:text-[#e3e5e8] hover:bg-[#1e1f23] transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume */}
              <div className="w-full flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-[#60646c] shrink-0" />
                <input
                  type="range" min={0} max={100} value={volume}
                  onChange={(e) => setVolume(+e.target.value)}
                  className="flex-1 accent-[#5865f2]"
                />
                <span className="text-xs text-[#60646c] w-7 text-right">{volume}%</span>
              </div>
            </div>
          </div>

          {/* Music settings */}
          <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[#e3e5e8] mb-3">Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e3e5e8]">DJ Mode</p>
                  <p className="text-xs text-[#60646c]">Only DJ role can control</p>
                </div>
                <Toggle checked={djMode} onChange={setDjMode} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e3e5e8]">Autoplay</p>
                  <p className="text-xs text-[#60646c]">Play similar songs when empty</p>
                </div>
                <Toggle checked={autoplay} onChange={setAutoplay} />
              </div>
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="lg:col-span-2 bg-[#111214] border border-[#2b2d31] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2b2d31]">
            <h2 className="text-sm font-semibold text-[#e3e5e8]">Queue</h2>
            <Badge variant="muted">{queue.length} tracks</Badge>
          </div>
          {queue.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#60646c]">Queue is empty.</div>
          ) : (
            <div className="divide-y divide-[#1e1f23]">
              {queue.map((track, i) => (
                <div key={track.pos} className={`flex items-center gap-3 px-4 py-3 transition-colors ${i === 0 ? "bg-[#5865f2]/5" : "hover:bg-[#1a1b1e]"}`}>
                  <span className="text-xs font-bold text-[#60646c] w-4 text-center">{track.pos}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${i === 0 ? "bg-[#5865f2]/20" : "bg-[#1e1f23]"}`}>
                    <Music className={`w-3.5 h-3.5 ${i === 0 ? "text-[#5865f2]" : "text-[#60646c]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e3e5e8] truncate">{track.title}</p>
                    <p className="text-xs text-[#60646c]">{track.artist} · req. {track.requested}</p>
                  </div>
                  <span className="text-xs text-[#60646c] shrink-0">{track.dur}</span>
                  {i === 0 ? (
                    <Badge variant="success">Playing</Badge>
                  ) : (
                    <button
                      onClick={() => removeFromQueue(track.pos)}
                      className="p-1 rounded text-[#60646c] hover:text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
