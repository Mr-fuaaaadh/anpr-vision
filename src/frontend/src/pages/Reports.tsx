import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Clock, Download, FileText, TrendingUp } from "lucide-react";
import { cameras, peakHoursData, vehicleTrendData } from "../mockData";

function LineChart() {
  const max = Math.max(...vehicleTrendData.map((d) => d.count));
  const min = Math.min(...vehicleTrendData.map((d) => d.count));
  const range = max - min || 1;
  const w = 600;
  const h = 120;
  const pad = 10;
  const points = vehicleTrendData.map((d, i) => {
    const x = pad + (i / (vehicleTrendData.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.count - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M ${pad},${h - pad} L ${points.join(" L ")} L ${w - pad},${h - pad} Z`;

  return (
    <svg
      role="img"
      aria-label="Vehicle trend line chart"
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-32"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(0.62 0.19 260)"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.62 0.19 260)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineGrad)" />
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.62 0.19 260)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {vehicleTrendData.map((d, i) => {
        const x = pad + (i / (vehicleTrendData.length - 1)) * (w - pad * 2);
        const y = h - pad - ((d.count - min) / range) * (h - pad * 2);
        return (
          <g key={d.day}>
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="oklch(0.62 0.19 260)"
              stroke="oklch(0.11 0.03 245)"
              strokeWidth="2"
            />
            <text
              x={x}
              y={h}
              textAnchor="middle"
              fontSize="10"
              fill="oklch(0.58 0.04 250)"
              fontFamily="monospace"
            >
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BarChart() {
  const max = Math.max(...peakHoursData.map((d) => d.count));
  const peakHours = new Set([7, 8, 9, 17, 18, 19]);

  return (
    <div className="flex items-end gap-0.5 h-28 w-full">
      {peakHoursData.map((d) => {
        const isPeak = peakHours.has(d.hour);
        const height = (d.count / max) * 100;
        return (
          <div
            key={d.hour}
            className="flex-1 flex flex-col items-center gap-1 group"
          >
            <div
              className="w-full rounded-t-sm transition-all cursor-pointer"
              style={{
                height: `${height}%`,
                background: isPeak
                  ? "oklch(0.73 0.19 145)"
                  : "oklch(0.62 0.19 260)",
                opacity: 0.85,
              }}
              title={`${d.hour}:00 — ${d.count.toLocaleString()} vehicles`}
            />
            {d.hour % 4 === 0 && (
              <span className="text-[8px] text-muted-foreground">
                {d.hour}h
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1" style={{ minWidth: 600 }}>
        {/* Hour labels */}
        <div className="flex flex-col gap-1 pt-6">
          {days.map((d) => (
            <div key={d} className="h-5 flex items-center">
              <span className="text-[9px] text-muted-foreground w-8">{d}</span>
            </div>
          ))}
        </div>
        <div className="flex-1">
          {/* Hour header */}
          <div className="flex gap-1 mb-1">
            {hours
              .filter((h) => h % 3 === 0)
              .map((h) => (
                <div
                  key={h}
                  className="text-[8px] text-muted-foreground"
                  style={{ width: "calc(100% / 8)" }}
                >
                  {h}h
                </div>
              ))}
          </div>
          {/* Grid */}
          {days.map((day) => (
            <div key={day} className="flex gap-1 mb-1">
              {hours.map((hour) => {
                const isPeak =
                  (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
                const isNight = hour < 6 || hour > 22;
                const intensity = isNight
                  ? 0.1
                  : isPeak
                    ? 0.85
                    : 0.35 + Math.random() * 0.3;
                return (
                  <div
                    key={hour}
                    className="flex-1 h-5 rounded-sm cursor-pointer hover:ring-1 ring-primary/50 transition-all"
                    style={{
                      background: `oklch(${0.35 + intensity * 0.27} ${0.05 + intensity * 0.14} 260)`,
                      opacity: 0.7 + intensity * 0.3,
                    }}
                    title={`${day} ${hour}:00`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const busyCam = cameras.reduce((a, b) => (a.fps > b.fps ? a : b));
  const avgVehicles = Math.round(
    vehicleTrendData.reduce((s, d) => s + d.count, 0) / vehicleTrendData.length,
  );
  const peakHour = peakHoursData.reduce((a, b) =>
    a.count > b.count ? a : b,
  ).hour;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last 7 days performance overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger
              data-ocid="reports.daterange.select"
              className="w-32 rounded-xl"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            data-ocid="reports.export_pdf.button"
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </Button>
          <Button
            data-ocid="reports.export_csv.button"
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
            label: "Avg Vehicles/Day",
            value: avgVehicles.toLocaleString(),
            iconBg: "oklch(0.62 0.19 260 / 15%)",
          },
          {
            icon: <Clock className="w-4 h-4 text-orange-400" />,
            label: "Busiest Hour",
            value: `${peakHour}:00 – ${peakHour + 1}:00`,
            iconBg: "oklch(0.75 0.18 70 / 15%)",
          },
          {
            icon: <Camera className="w-4 h-4 text-green-400" />,
            label: "Busiest Camera",
            value: busyCam.name,
            iconBg: "oklch(0.73 0.19 145 / 15%)",
          },
          {
            icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
            label: "Avg Confidence",
            value: "87.4%",
            iconBg: "oklch(0.65 0.18 300 / 15%)",
          },
        ].map(({ icon, label, value, iconBg }) => (
          <div key={label} className="glass-card-solid rounded-2xl p-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: iconBg }}
            >
              {icon}
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Vehicle trend */}
      <div
        className="glass-card-solid rounded-2xl p-5"
        data-ocid="reports.trend.card"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Vehicle Detections — Last 7 Days
        </h2>
        <LineChart />
      </div>

      {/* Peak hours */}
      <div
        className="glass-card-solid rounded-2xl p-5"
        data-ocid="reports.peak_hours.card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Peak Hours Distribution
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "oklch(0.73 0.19 145)" }}
              />
              <span className="text-[10px] text-muted-foreground">
                Peak hours
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "oklch(0.62 0.19 260)" }}
              />
              <span className="text-[10px] text-muted-foreground">Normal</span>
            </div>
          </div>
        </div>
        <BarChart />
      </div>

      {/* Heatmap */}
      <div
        className="glass-card-solid rounded-2xl p-5"
        data-ocid="reports.heatmap.card"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Activity Heatmap — 7 Day × 24 Hour
        </h2>
        <Heatmap />
        <div className="flex items-center gap-4 mt-3">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <div className="flex gap-1 flex-1">
            {[0.1, 0.25, 0.4, 0.6, 0.8, 1.0].map((v) => (
              <div
                key={v}
                className="flex-1 h-2 rounded-sm"
                style={{
                  background: `oklch(${0.35 + v * 0.27} ${0.05 + v * 0.14} 260)`,
                }}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}
