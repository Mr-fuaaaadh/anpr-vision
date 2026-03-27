interface KPICardProps {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  progress: number;
  progressColor: string;
  ocid: string;
}

export function KPICard({
  title,
  value,
  delta,
  deltaPositive,
  icon,
  iconBg,
  progress,
  progressColor,
  ocid,
}: KPICardProps) {
  return (
    <div
      data-ocid={ocid}
      className="glass-card-solid rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            deltaPositive
              ? "bg-green-500/15 text-green-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {deltaPositive ? "▲" : "▼"} {delta}
        </span>
        <span className="text-xs text-muted-foreground">vs last 24h</span>
      </div>
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{ background: "oklch(var(--muted))" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%`, background: progressColor }}
        />
      </div>
    </div>
  );
}
