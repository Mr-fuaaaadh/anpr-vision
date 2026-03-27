import {
  BarChart3,
  Bell,
  Camera,
  FileText,
  LayoutDashboard,
  Monitor,
} from "lucide-react";
import type { Page } from "../App";

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "cameras" as Page, label: "Cameras", icon: Camera },
  { id: "monitoring" as Page, label: "Monitor", icon: Monitor },
  { id: "logs" as Page, label: "Logs", icon: FileText },
  { id: "alerts" as Page, label: "Alerts", icon: Bell },
  { id: "reports" as Page, label: "Reports", icon: BarChart3 },
];

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-1 pb-safe"
      style={{
        height: 60,
        background: "oklch(var(--sidebar) / 95%)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid oklch(var(--sidebar-border))",
        boxShadow: "0 -4px 24px oklch(0 0 0 / 30%)",
      }}
    >
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = activePage === id;
        return (
          <button
            type="button"
            key={id}
            data-ocid={`bottom_nav.${id}.link`}
            onClick={() => onNavigate(id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 transition-colors"
            style={{
              color: isActive
                ? "oklch(var(--primary))"
                : "oklch(var(--muted-foreground))",
            }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-medium">{label}</span>
            {isActive && (
              <span
                className="absolute top-0 rounded-full"
                style={{
                  width: 32,
                  height: 2,
                  background: "oklch(var(--primary))",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
