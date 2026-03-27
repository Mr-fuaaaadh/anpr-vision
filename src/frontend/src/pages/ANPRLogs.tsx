import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { anprLogs } from "../mockData";
import type { ANPRLog, VehicleType } from "../types";

const ITEMS_PER_PAGE = 15;

function ConfidenceBadge({ value }: { value: number }) {
  const color =
    value >= 90
      ? "bg-green-500/15 text-green-400"
      : value >= 80
        ? "bg-yellow-500/15 text-yellow-400"
        : "bg-red-500/15 text-red-400";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {value}%
    </span>
  );
}

function ExpandedRow({ log }: { log: ANPRLog }) {
  return (
    <tr>
      <td colSpan={8} className="px-4 pb-4">
        <div
          className="rounded-xl p-4 flex items-start gap-4"
          style={{ background: "oklch(var(--muted) / 40%)" }}
        >
          <div
            className={`w-32 h-20 rounded-lg bg-gradient-to-br ${log.thumbnailColor} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
          >
            <Car className="w-8 h-8 text-white/40" />
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-bold text-black"
              style={{ background: "oklch(0.75 0.18 70 / 90%)" }}
            >
              {log.plate}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {[
              { label: "Plate", value: log.plate },
              { label: "Vehicle Type", value: log.vehicleType },
              { label: "Camera", value: log.cameraName },
              { label: "Location", value: log.location },
              { label: "Confidence", value: `${log.confidence}%` },
              { label: "Status", value: log.status },
              { label: "Timestamp", value: log.timestamp.toLocaleString() },
              { label: "Camera ID", value: log.cameraId },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}

export function ANPRLogs() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(anprLogs.map((l) => l.location))),
    [],
  );

  const filtered = useMemo(() => {
    return anprLogs.filter((l) => {
      const matchSearch =
        !search ||
        l.plate.toLowerCase().includes(search.toLowerCase()) ||
        l.cameraName.toLowerCase().includes(search.toLowerCase());
      const matchLoc =
        locationFilter === "all" || l.location === locationFilter;
      const matchVeh =
        vehicleFilter === "all" || l.vehicleType === vehicleFilter;
      return matchSearch && matchLoc && matchVeh;
    });
  }, [search, locationFilter, vehicleFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const hasFilters =
    search || locationFilter !== "all" || vehicleFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("all");
    setVehicleFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div
        className="glass-card-solid rounded-2xl p-4 flex flex-wrap items-center gap-3"
        data-ocid="logs.filters.panel"
      >
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 min-w-44"
          style={{
            background: "oklch(var(--muted) / 50%)",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <Input
            data-ocid="logs.search_input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search plate or camera…"
            className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0"
          />
        </div>
        <Select
          value={locationFilter}
          onValueChange={(v) => {
            setLocationFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger
            data-ocid="logs.location.select"
            className="w-48 rounded-lg"
          >
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.slice(0, 10).map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={vehicleFilter}
          onValueChange={(v) => {
            setVehicleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger
            data-ocid="logs.vehicle.select"
            className="w-36 rounded-lg"
          >
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            {(
              ["Car", "Truck", "Motorcycle", "Van", "Bus"] as VehicleType[]
            ).map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            data-ocid="logs.clear_filters.button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 rounded-lg"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} records
        </span>
      </div>

      {/* Mobile card list */}
      {isMobile && (
        <div className="space-y-2" data-ocid="logs.mobile_list">
          {paged.map((log, i) => (
            <div
              key={log.id}
              data-ocid={`logs.mobile.item.${i + 1}`}
              className="glass-card-solid rounded-xl p-3 flex items-center gap-3"
              onClick={() =>
                setExpandedId(expandedId === log.id ? null : log.id)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                setExpandedId(expandedId === log.id ? null : log.id)
              }
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${log.thumbnailColor} flex items-center justify-center flex-shrink-0`}
              >
                <Car className="w-5 h-5 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-foreground tracking-wider">
                    {log.plate}
                  </span>
                  <ConfidenceBadge value={log.confidence} />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {log.cameraName} · {log.location}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {log.timestamp.toLocaleString()}
                </p>
              </div>
              <StatusBadge status={log.status} />
            </div>
          ))}
          {/* Pagination for mobile */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Page {page}/{totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg text-xs text-muted-foreground hover:bg-accent disabled:opacity-40 transition-colors"
                style={{ border: "1px solid oklch(var(--border))" }}
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg text-xs text-muted-foreground hover:bg-accent disabled:opacity-40 transition-colors"
                style={{ border: "1px solid oklch(var(--border))" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table - desktop */}
      {!isMobile && (
        <div className="glass-card-solid rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-ocid="logs.table">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(var(--border))" }}>
                  {[
                    "Image",
                    "Plate",
                    "Timestamp",
                    "Location",
                    "Camera",
                    "Confidence",
                    "Type",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((log, i) => (
                  <>
                    <tr
                      key={log.id}
                      data-ocid={`logs.table.row.${i + 1}`}
                      onClick={() =>
                        setExpandedId(expandedId === log.id ? null : log.id)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setExpandedId(expandedId === log.id ? null : log.id)
                      }
                      className="hover:bg-accent/30 transition-colors cursor-pointer"
                      style={{ borderBottom: "1px solid oklch(var(--border))" }}
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`w-10 h-7 rounded-lg bg-gradient-to-br ${log.thumbnailColor} flex items-center justify-center`}
                        >
                          <Car className="w-4 h-4 text-white/60" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-foreground tracking-wider">
                          {log.plate}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">
                          {log.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-blue-400">
                          {log.cameraName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ConfidenceBadge value={log.confidence} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">
                          {log.vehicleType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={log.status} />
                          {expandedId === log.id ? (
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === log.id && (
                      <ExpandedRow key={`${log.id}-exp`} log={log} />
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid oklch(var(--border))" }}
          >
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {filtered.length} total
            </span>
            <div className="flex items-center gap-1">
              <Button
                data-ocid="logs.pagination_prev"
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg h-8"
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <Button
                    key={p}
                    data-ocid={`logs.page.button.${p}`}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="rounded-lg h-8 w-8 p-0"
                  >
                    {p}
                  </Button>
                );
              })}
              <Button
                data-ocid="logs.pagination_next"
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg h-8"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
