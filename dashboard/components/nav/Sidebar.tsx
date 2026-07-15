"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Shield, Users, TrendingUp, Coins,
  Music, Ticket, Gift, Settings, LogOut, ChevronRight,
  Hash, Smile, MessageSquare, Bot, Star,
} from "lucide-react";

const navSections = [
  {
    label: "General",
    items: [
      { href: "/dashboard",             icon: LayoutDashboard, label: "Overview"        },
      { href: "/dashboard/moderation",  icon: Shield,          label: "Moderation"      },
      { href: "/dashboard/members",     icon: Users,           label: "Members"         },
    ],
  },
  {
    label: "Features",
    items: [
      { href: "/dashboard/leveling",    icon: TrendingUp,      label: "Leveling"        },
      { href: "/dashboard/economy",     icon: Coins,           label: "Economy"         },
      { href: "/dashboard/music",       icon: Music,           label: "Music"           },
      { href: "/dashboard/tickets",     icon: Ticket,          label: "Tickets"         },
      { href: "/dashboard/giveaways",   icon: Gift,            label: "Giveaways"       },
    ],
  },
  {
    label: "Config",
    items: [
      { href: "/dashboard/welcome",         icon: Star,           label: "Welcome & Goodbye" },
      { href: "/dashboard/logging",         icon: Hash,           label: "Logging"           },
      { href: "/dashboard/reaction-roles",  icon: Smile,          label: "Reaction Roles"    },
      { href: "/dashboard/commands",        icon: MessageSquare,  label: "Commands"           },
      { href: "/dashboard/settings",        icon: Settings,       label: "Settings"          },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-[#111214] border-r border-[#2b2d31]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#2b2d31]">
        <div className="w-8 h-8 rounded-lg bg-[#5865f2] flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#e3e5e8] leading-none">TitanBot</div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#23a55a]" />
            <span className="text-[10px] text-[#23a55a] font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold text-[#60646c] uppercase tracking-widest px-2 mb-1">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#5865f2]/15 text-[#5865f2]"
                        : "text-[#949ba4] hover:text-[#e3e5e8] hover:bg-[#1e1f23]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {active && <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      {session?.user && (
        <div className="border-t border-[#2b2d31] p-2">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="w-7 h-7 rounded-full shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center text-xs font-bold text-white shrink-0">
                {session.user.name?.[0] ?? "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#e3e5e8] truncate leading-none">
                {session.user.name}
              </p>
              <p className="text-[10px] text-[#60646c] mt-0.5">Admin</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 rounded-lg text-[#60646c] hover:text-[#f23f42] hover:bg-[#f23f42]/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
