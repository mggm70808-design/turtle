import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  sub?: string;
}

const colorMap = {
  blue:   { bg: "bg-[#5865f2]/15",  text: "text-[#5865f2]"  },
  green:  { bg: "bg-[#23a55a]/15",  text: "text-[#23a55a]"  },
  yellow: { bg: "bg-[#f0b232]/15",  text: "text-[#f0b232]"  },
  red:    { bg: "bg-[#f23f42]/15",  text: "text-[#f23f42]"  },
  purple: { bg: "bg-[#9b59b6]/15",  text: "text-[#9b59b6]"  },
};

export function StatCard({ label, value, icon: Icon, color = "blue", sub }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-[#111214] border border-[#2b2d31] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#949ba4] uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.text}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-[#e3e5e8]">{value}</div>
      {sub && <div className="text-xs text-[#60646c] mt-1">{sub}</div>}
    </div>
  );
}
