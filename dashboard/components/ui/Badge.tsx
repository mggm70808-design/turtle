interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
}

const variants = {
  default: "bg-[#5865f2]/15 text-[#5865f2]",
  success: "bg-[#23a55a]/15 text-[#23a55a]",
  warning: "bg-[#f0b232]/15 text-[#f0b232]",
  danger:  "bg-[#f23f42]/15 text-[#f23f42]",
  info:    "bg-[#00aff4]/12 text-[#00aff4]",
  muted:   "bg-[#1e1f23] text-[#949ba4]",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
