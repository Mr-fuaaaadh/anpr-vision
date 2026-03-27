import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, LayoutGrid, List, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { cameras as initialCameras } from "../mockData";
import type { Camera, CameraType } from "../types";

type ViewMode = "table" | "grid";
type SortField = "name" | "location" | "status" | "latency" | "fps";

const emptyForm = {
  name: "",
  location: "",
  type: "RTSP" as CameraType,
  ip: "",
  port: "554",
  username: "",
  password: "",
};

export function CameraManagement() {
  const [cameras, setCameras] = useState<Camera[]>(initialCameras);
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = cameras
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const av = a[sortField as keyof Camera];
      const bv = b[sortField as keyof Camera];
      const cmp =
        String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });

  const handleSort = (field: SortField) => {
    if (field === sortField) setSortAsc((v) => !v);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleAdd = () => {
    const newCam: Camera = {
      id: `cam-${Date.now()}`,
      name: form.name || "New Camera",
      location: form.location || "Unknown",
      type: form.type,
      status: "online",
      ip: form.ip || "0.0.0.0",
      port: Number.parseInt(form.port) || 554,
      latency: 12,
      fps: 25,
      bitrate: 2.0,
      lat: 25.2,
      lng: 55.3,
      streamUrl: `rtsp://${form.ip}:${form.port}/stream`,
      groupColor: "from-blue-900 to-blue-700",
    };
    setCameras((prev) => [newCam, ...prev]);
    setShowAddModal(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    setCameras((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  };

  const sortArrow = (f: SortField) =>
    sortField === f ? (sortAsc ? " ↑" : " ↓") : "";

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-48"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="cameras.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cameras…"
            className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground"
          />
        </div>
        <Button
          data-ocid="cameras.add.open_modal_button"
          onClick={() => setShowAddModal(true)}
          className="rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" /> Add Camera
        </Button>
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: "1px solid oklch(var(--border))" }}
        >
          {(["table", "grid"] as const).map((v) => (
            <button
              type="button"
              key={v}
              data-ocid={`cameras.view_${v}.toggle`}
              onClick={() => setView(v)}
              className={`px-3 py-2 transition-colors ${
                view === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {v === "table" ? (
                <List className="w-4 h-4" />
              ) : (
                <LayoutGrid className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <div className="glass-card-solid rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-ocid="cameras.table">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(var(--border))" }}>
                  {(
                    [
                      "name",
                      "location",
                      "status",
                      "latency",
                      "fps",
                    ] as SortField[]
                  ).map((f) => (
                    <th
                      key={f}
                      onClick={() => handleSort(f)}
                      onKeyDown={(e) => e.key === "Enter" && handleSort(f)}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      {sortArrow(f)}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bitrate
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((cam, i) => (
                  <tr
                    key={cam.id}
                    data-ocid={`cameras.table.row.${i + 1}`}
                    className="hover:bg-accent/30 transition-colors"
                    style={{ borderBottom: "1px solid oklch(var(--border))" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cam.groupColor} flex items-center justify-center`}
                        >
                          <span className="text-[9px] font-bold text-white">
                            {cam.name.slice(-3)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {cam.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {cam.ip}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {cam.location}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={cam.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-mono ${
                          cam.latency < 20
                            ? "text-green-400"
                            : cam.latency < 50
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {cam.latency}ms
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground font-mono">
                        {cam.fps}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: "oklch(var(--muted))",
                          color: "oklch(var(--muted-foreground))",
                        }}
                      >
                        {cam.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">
                      {cam.bitrate.toFixed(1)} Mb/s
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          data-ocid={`cameras.edit.button.${i + 1}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          data-ocid={`cameras.delete_button.${i + 1}`}
                          onClick={() => setDeleteId(cam.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cam, i) => (
            <div
              key={cam.id}
              data-ocid={`cameras.grid.item.${i + 1}`}
              className="glass-card-solid rounded-2xl p-4 hover:ring-1 ring-primary/30 transition-all"
            >
              <div
                className={`rounded-xl aspect-video bg-gradient-to-br ${cam.groupColor} mb-3 relative overflow-hidden`}
              >
                <div className="camera-tile-overlay absolute inset-0" />
                <div className="absolute top-2 left-2">
                  <div
                    className={`${
                      cam.status === "online"
                        ? "status-dot-online"
                        : cam.status === "recording"
                          ? "status-dot-recording"
                          : "status-dot-offline"
                    }`}
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[9px] text-white/60 truncate">
                    {cam.location}
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-foreground">{cam.name}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {cam.location}
              </p>
              <div className="flex items-center justify-between mt-3">
                <StatusBadge status={cam.status} />
                <span className="text-[10px] font-mono text-muted-foreground">
                  {cam.latency}ms · {cam.fps}fps
                </span>
              </div>
              {/* Health bars */}
              <div className="space-y-1.5 mt-3">
                {[
                  {
                    label: "FPS",
                    value: (cam.fps / 30) * 100,
                    color: "oklch(0.73 0.19 145)",
                  },
                  {
                    label: "BW",
                    value: (cam.bitrate / 5) * 100,
                    color: "oklch(0.62 0.19 260)",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[9px] text-muted-foreground w-6">
                      {label}
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full"
                      style={{ background: "oklch(var(--muted))" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(value, 100)}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Camera Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent
          className="sm:max-w-md rounded-2xl"
          data-ocid="cameras.add.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add New Camera</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { id: "name", label: "Camera Name", placeholder: "CAM-021" },
              { id: "location", label: "Location", placeholder: "North Gate" },
              { id: "ip", label: "IP Address", placeholder: "192.168.1.100" },
              { id: "port", label: "Port", placeholder: "554" },
              { id: "username", label: "Username", placeholder: "admin" },
              { id: "password", label: "Password", placeholder: "••••••••" },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  data-ocid={`cameras.add.${id}.input`}
                  id={id}
                  type={id === "password" ? "password" : "text"}
                  placeholder={placeholder}
                  value={form[id as keyof typeof form]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [id]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Camera Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, type: v as CameraType }))
                }
              >
                <SelectTrigger data-ocid="cameras.add.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["RTSP", "ONVIF", "Hikvision"] as CameraType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="cameras.add.cancel_button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button data-ocid="cameras.add.submit_button" onClick={handleAdd}>
              Add Camera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          className="sm:max-w-sm rounded-2xl"
          data-ocid="cameras.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Camera</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to remove this camera? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              data-ocid="cameras.delete.cancel_button"
              variant="outline"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="cameras.delete.confirm_button"
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              <X className="w-4 h-4 mr-1" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
