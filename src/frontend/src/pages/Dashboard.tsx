import {
  Activity,
  AlertTriangle,
  Camera,
  Car,
  Clock,
  MapPin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KPICard } from "../components/KPICard";
import { alerts, anprLogs, cameras, generateFakeDetection } from "../mockData";
import type { ANPRLog } from "../types";

function CameraMapSVG() {
  return (
    <svg
      role="img"
      aria-label="Camera locations map"
      viewBox="0 0 400 250"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="400" height="250" fill="oklch(0.10 0.03 245)" />
      {/* Road grid */}
      {[50, 120, 200, 280, 350].map((x) => (
        <line
          key={`vr-${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="250"
          stroke="oklch(0.25 0.04 245)"
          strokeWidth="2"
        />
      ))}
      {[40, 90, 140, 180, 220, 260].map((y) => (
        <line
          key={`hr-${y}`}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          stroke="oklch(0.25 0.04 245)"
          strokeWidth="2"
        />
      ))}
      {/* Highway */}
      <line
        x1="0"
        y1="125"
        x2="400"
        y2="125"
        stroke="oklch(0.30 0.05 245)"
        strokeWidth="5"
      />
      <line
        x1="200"
        y1="0"
        x2="200"
        y2="250"
        stroke="oklch(0.30 0.05 245)"
        strokeWidth="5"
      />
      {/* Camera dots */}
      {cameras.slice(0, 12).map((cam, i) => {
        const x = 30 + (i % 6) * 68;
        const y = 40 + Math.floor(i / 6) * 80;
        const color =
          cam.status === "online"
            ? "#22C55E"
            : cam.status === "recording"
              ? "#F59E0B"
              : "#EF4444";
        return (
          <g key={cam.id}>
            <circle cx={x} cy={y} r="10" fill={color} opacity="0.15" />
            <circle cx={x} cy={y} r="5" fill={color} opacity="0.9" />
            <circle
              cx={x}
              cy={y}
              r="14"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.3"
            >
              <animate
                attributeName="r"
                from="5"
                to="18"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
      {/* Labels */}
      <text
        x="10"
        y="246"
        fontSize="8"
        fill="oklch(0.45 0.04 250)"
        fontFamily="monospace"
      >
        ANPR VISION • LIVE MAP
      </text>
    </svg>
  );
}

const timelineEvents = [
  {
    icon: "🚗",
    time: "14:32:08",
    camera: "CAM-001",
    plate: "ABC 1234",
    desc: "Vehicle entered Main Entrance Gate",
    color: "text-green-400",
  },
  {
    icon: "⚠️",
    time: "14:31:55",
    camera: "CAM-007",
    plate: "DEF 9012",
    desc: "Blacklisted vehicle detected",
    color: "text-red-400",
  },
  {
    icon: "📷",
    time: "14:31:20",
    camera: "CAM-012",
    plate: "GHI 3456",
    desc: "Recording started: motion detected",
    color: "text-orange-400",
  },
  {
    icon: "✅",
    time: "14:30:44",
    camera: "CAM-003",
    plate: "JKL 7890",
    desc: "VIP vehicle whitelisted entry",
    color: "text-blue-400",
  },
  {
    icon: "🚗",
    time: "14:29:30",
    camera: "CAM-015",
    plate: "MNO 2345",
    desc: "Vehicle exited Stadium Parking",
    color: "text-green-400",
  },
  {
    icon: "⚡",
    time: "14:29:11",
    camera: "CAM-008",
    plate: "PQR 6789",
    desc: "Speed violation: 115km/h detected",
    color: "text-yellow-400",
  },
  {
    icon: "🔄",
    time: "14:28:02",
    camera: "CAM-014",
    plate: "---",
    desc: "Camera went offline — reconnecting",
    color: "text-muted-foreground",
  },
  {
    icon: "🚗",
    time: "14:27:50",
    camera: "CAM-002",
    plate: "STU 0123",
    desc: "Vehicle entered North Perimeter",
    color: "text-green-400",
  },
];

export function Dashboard() {
  const [detections, setDetections] = useState<ANPRLog[]>(anprLogs.slice(0, 8));
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDetections((prev) => [generateFakeDetection(), ...prev].slice(0, 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlerts = alerts.filter(
    (a) => a.severity === "critical" && !a.acknowledged,
  ).length;

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          ocid="dashboard.cameras.card"
          title="Total Cameras"
          value="247 / 250"
          delta="3 new this week"
          deltaPositive
          icon={<Camera className="w-5 h-5 text-blue-400" />}
          iconBg="oklch(0.60 0.19 260 / 15%)"
          progress={98.8}
          progressColor="oklch(0.62 0.19 260)"
        />
        <KPICard
          ocid="dashboard.streams.card"
          title="Active Streams"
          value="189"
          delta="+12 from avg"
          deltaPositive
          icon={<Activity className="w-5 h-5 text-green-400" />}
          iconBg="oklch(0.73 0.19 145 / 15%)"
          progress={76.5}
          progressColor="oklch(0.73 0.19 145)"
        />
        <KPICard
          ocid="dashboard.vehicles.card"
          title="Vehicles Today"
          value="34,180"
          delta="+8.3% vs yesterday"
          deltaPositive
          icon={<Car className="w-5 h-5 text-purple-400" />}
          iconBg="oklch(0.65 0.18 300 / 15%)"
          progress={68}
          progressColor="oklch(0.65 0.18 300)"
        />
        <KPICard
          ocid="dashboard.alerts.card"
          title="Alerts"
          value={`${criticalAlerts} Critical`}
          delta="-2 since morning"
          deltaPositive
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          iconBg="oklch(0.63 0.22 27 / 15%)"
          progress={criticalAlerts * 5}
          progressColor="oklch(0.63 0.22 27)"
        />
      </div>

      {/* Row 2: Camera Feeds + Side Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        {/* Camera Feed Grid */}
        <div className="glass-card-solid rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Live Camera Feeds
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Auto-refreshing every 5s
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot-online" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            data-ocid="dashboard.camera_feeds.panel"
          >
            {cameras.slice(0, 9).map((cam, i) => (
              <div
                key={cam.id}
                data-ocid={`dashboard.camera_feed.item.${i + 1}`}
                className={`relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br ${cam.groupColor} cursor-pointer hover:ring-2 ring-primary/40 transition-all`}
              >
                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 30%) 2px, oklch(0 0 0 / 30%) 4px)",
                  }}
                />
                {/* Camera overlay */}
                <div className="camera-tile-overlay absolute inset-0" />
                {/* Top row */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`${
                        cam.status === "online"
                          ? "status-dot-online"
                          : cam.status === "recording"
                            ? "status-dot-recording"
                            : "status-dot-offline"
                      }`}
                    />
                    <span className="text-[9px] font-bold text-white/80">
                      {cam.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-white/50">{cam.fps}fps</span>
                </div>
                {/* Plate overlay */}
                {i % 3 !== 1 && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider plate-blink"
                      style={{
                        background: "oklch(0.75 0.18 70 / 90%)",
                        color: "#000",
                      }}
                    >
                      {
                        [
                          "ABC 1234",
                          "XYZ 5678",
                          "DEF 9012",
                          "GHI 3456",
                          "JKL 7890",
                          "MNO 2345",
                        ][i % 6]
                      }
                    </span>
                  </div>
                )}
                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5">
                  <p className="text-[9px] text-white/60 truncate">
                    {cam.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* ANPR Detection Feed */}
          <div className="glass-card-solid rounded-2xl p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Real-time Detections
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="status-dot-online" />
                Live
              </span>
            </div>
            <div
              ref={feedRef}
              className="space-y-2 max-h-52 overflow-y-auto"
              data-ocid="dashboard.detections.panel"
            >
              {detections.map((d, i) => (
                <div
                  key={d.id}
                  data-ocid={`dashboard.detection.item.${i + 1}`}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${d.thumbnailColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Car className="w-3.5 h-3.5 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">
                      {d.plate}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {d.cameraName} · {d.vehicleType}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-semibold ${
                        d.confidence >= 90
                          ? "text-green-400"
                          : d.confidence >= 80
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {d.confidence}%
                    </span>
                    {d.status === "blacklisted" && (
                      <span className="text-[9px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full">
                        BL
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div
            className="glass-card-solid rounded-2xl p-4"
            data-ocid="dashboard.map.panel"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Camera Map
              </h2>
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-video">
              <CameraMapSVG />
            </div>
            <div className="flex items-center gap-4 mt-2">
              {[
                { color: "bg-green-400", label: "Online" },
                { color: "bg-orange-400", label: "Recording" },
                { color: "bg-red-500", label: "Offline" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[10px] text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="glass-card-solid rounded-2xl p-5"
        data-ocid="dashboard.timeline.panel"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            System Activity Timeline
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          {timelineEvents.map((e, i) => (
            <div
              key={e.time + String(i)}
              data-ocid={`dashboard.timeline.item.${i + 1}`}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors"
            >
              <span className="text-base leading-none mt-0.5 flex-shrink-0">
                {e.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {e.time}
                  </span>
                  <span className="text-[10px] font-medium text-blue-400">
                    {e.camera}
                  </span>
                  {e.plate !== "---" && (
                    <span className="text-[10px] font-bold text-foreground">
                      {e.plate}
                    </span>
                  )}
                </div>
                <p className={`text-xs ${e.color}`}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
