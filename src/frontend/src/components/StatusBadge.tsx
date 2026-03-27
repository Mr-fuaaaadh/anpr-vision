import type { AlertSeverity, CameraStatus } from "../types";

interface StatusBadgeProps {
  status: CameraStatus | AlertSeverity | string;
  variant?: "camera" | "alert" | "log" | "plan";
}

export function StatusBadge({ status, variant = "camera" }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    online: "bg-green-500/15 text-green-400 border border-green-500/20",
    offline: "bg-red-500/15 text-red-400 border border-red-500/20",
    recording: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    critical: "bg-red-500/15 text-red-400 border border-red-500/20",
    high: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    low: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    normal: "bg-green-500/15 text-green-400 border border-green-500/20",
    blacklisted: "bg-red-500/15 text-red-400 border border-red-500/20",
    whitelisted: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    overspeed: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    Admin: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    Operator: "bg-green-500/15 text-green-400 border border-green-500/20",
    Viewer: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
    Free: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
    Pro: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    Enterprise: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
    active: "bg-green-500/15 text-green-400 border border-green-500/20",
    inactive: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
  };

  void variant;
  const cls =
    styles[status] ??
    "bg-slate-500/15 text-slate-400 border border-slate-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {["online", "recording", "critical", "high"].includes(status) && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "online"
              ? "bg-green-400 animate-pulse"
              : status === "recording"
                ? "bg-orange-400 animate-pulse"
                : "bg-red-400 animate-pulse"
          }`}
        />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
