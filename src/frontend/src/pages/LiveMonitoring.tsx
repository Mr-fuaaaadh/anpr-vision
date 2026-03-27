import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Aperture,
  Camera as CameraIcon,
  Circle,
  Maximize2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cameras } from "../mockData";

type GridLayout = "1x1" | "2x2" | "3x3" | "4x4";

const gridConfig: Record<GridLayout, { cols: number; count: number }> = {
  "1x1": { cols: 1, count: 1 },
  "2x2": { cols: 2, count: 4 },
  "3x3": { cols: 3, count: 9 },
  "4x4": { cols: 4, count: 16 },
};

const plateOverlays = [
  "ABC 1234",
  "XYZ 5678",
  "DEF 9012",
  "GHI 3456",
  "JKL 7890",
  "MNO 2345",
  "PQR 6789",
  "STU 0123",
];

function CameraCell({
  cam,
  index,
  onFullscreen,
}: { cam: (typeof cameras)[0]; index: number; onFullscreen: () => void }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${cam.groupColor} group cursor-pointer`}
      style={{ aspectRatio: "16/9" }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 40%) 2px, oklch(0 0 0 / 40%) 4px)",
        }}
      />
      <div className="camera-tile-overlay absolute inset-0" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 pt-2">
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
          <span className="text-[10px] font-bold text-white/80">
            {cam.name}
          </span>
        </div>
        <span className="text-[9px] font-mono text-white/50">{timeStr}</span>
      </div>

      {/* Plate detection */}
      {index % 3 !== 2 && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none">
          <div
            className="px-3 py-1 rounded border-2 border-yellow-400/80 plate-blink"
            style={{ background: "oklch(0.75 0.18 70 / 20%)" }}
          >
            <span className="text-xs font-bold text-yellow-300 tracking-widest">
              {plateOverlays[index % plateOverlays.length]}
            </span>
          </div>
        </div>
      )}

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
        <p className="text-[9px] text-white/50 truncate">{cam.location}</p>
      </div>

      {/* Controls - appear on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          data-ocid={`monitoring.snapshot.button.${index + 1}`}
          className="w-6 h-6 rounded-md flex items-center justify-center bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
        >
          <Aperture className="w-3 h-3" />
        </button>
        <button
          type="button"
          data-ocid={`monitoring.record.button.${index + 1}`}
          className="w-6 h-6 rounded-md flex items-center justify-center bg-black/50 text-white/80 hover:text-red-400 hover:bg-black/70 transition-colors"
        >
          <Circle className="w-3 h-3" />
        </button>
        <button
          type="button"
          data-ocid={`monitoring.fullscreen.button.${index + 1}`}
          onClick={onFullscreen}
          className="w-6 h-6 rounded-md flex items-center justify-center bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export function LiveMonitoring() {
  const [layout, setLayout] = useState<GridLayout>("2x2");
  const [fullscreenCam, setFullscreenCam] = useState<
    (typeof cameras)[0] | null
  >(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const { cols, count } = gridConfig[layout];
  const effectiveCols = isMobile ? 1 : isTablet ? Math.min(cols, 2) : cols;
  const activeCams = cameras.slice(0, count);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Live Monitoring</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time multi-camera surveillance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Layout:</span>
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: "1px solid oklch(var(--border))" }}
          >
            {(["1x1", "2x2", "3x3", "4x4"] as GridLayout[]).map((l) => (
              <button
                type="button"
                key={l}
                data-ocid={`monitoring.layout_${l.replace("x", "by")}.toggle`}
                onClick={() => setLayout(l)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  layout === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 pl-2">
            <span className="status-dot-online" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${effectiveCols}, 1fr)` }}
        data-ocid="monitoring.camera_grid.panel"
      >
        {activeCams.map((cam, i) => (
          <CameraCell
            key={cam.id}
            cam={cam}
            index={i}
            onFullscreen={() => setFullscreenCam(cam)}
          />
        ))}
      </div>

      {/* Status row */}
      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <CameraIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {count} feeds active
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: Hover over any feed to see controls. Drag hint: feeds can be
          rearranged.
        </p>
      </div>

      {/* Fullscreen modal */}
      <Dialog
        open={!!fullscreenCam}
        onOpenChange={() => setFullscreenCam(null)}
      >
        <DialogContent
          className="max-w-4xl w-full rounded-2xl p-0 overflow-hidden"
          data-ocid="monitoring.fullscreen.dialog"
        >
          {fullscreenCam && (
            <div
              className={`relative bg-gradient-to-br ${fullscreenCam.groupColor} w-full`}
              style={{ aspectRatio: "16/9" }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 40%) 2px, oklch(0 0 0 / 40%) 4px)",
                }}
              />
              <div className="camera-tile-overlay absolute inset-0" />
              <div className="absolute top-4 left-4">
                <p className="text-sm font-bold text-white">
                  {fullscreenCam.name}
                </p>
                <p className="text-xs text-white/60">
                  {fullscreenCam.location}
                </p>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="px-4 py-2 rounded border-2 border-yellow-400/80 plate-blink"
                  style={{ background: "oklch(0.75 0.18 70 / 20%)" }}
                >
                  <span className="text-lg font-bold text-yellow-300 tracking-widest">
                    ABC 1234
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  type="button"
                  data-ocid="monitoring.fullscreen.snapshot.button"
                  className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Aperture className="w-3.5 h-3.5" /> Snapshot
                </button>
                <button
                  type="button"
                  data-ocid="monitoring.fullscreen.record.button"
                  className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium text-white bg-red-500/60 hover:bg-red-500/80 transition-colors"
                >
                  <Circle className="w-3.5 h-3.5" /> Record
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
