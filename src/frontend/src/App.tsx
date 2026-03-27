import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { generateFakeAlert } from "./mockData";
import { ANPRLogs } from "./pages/ANPRLogs";
import { Alerts } from "./pages/Alerts";
import { CameraManagement } from "./pages/CameraManagement";
import { Dashboard } from "./pages/Dashboard";
import { LiveMonitoring } from "./pages/LiveMonitoring";
import { Organization } from "./pages/Organization";
import { Reports } from "./pages/Reports";
import { UserManagement } from "./pages/UserManagement";
import type { Alert as AlertType } from "./types";

export type Page =
  | "dashboard"
  | "cameras"
  | "monitoring"
  | "logs"
  | "alerts"
  | "organization"
  | "users"
  | "reports";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [liveAlert, setLiveAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAlert(generateFakeAlert());
      setTimeout(() => setLiveAlert(null), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (p: Page) => {
    setPage(p);
    setMobileDrawerOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "cameras":
        return <CameraManagement />;
      case "monitoring":
        return <LiveMonitoring />;
      case "logs":
        return <ANPRLogs />;
      case "alerts":
        return <Alerts />;
      case "organization":
        return <Organization />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`}>
      <div
        className="flex h-screen w-full overflow-hidden"
        style={{
          background: darkMode
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.16 0.06 255 / 60%) 0%, oklch(0.11 0.03 245) 70%)"
            : "oklch(0.97 0.01 250)",
        }}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((p) => !p)}
          activePage={page}
          onNavigate={handleNavigate}
          mobileOpen={mobileDrawerOpen}
          onMobileClose={() => setMobileDrawerOpen(false)}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            onMenuClick={() => setMobileDrawerOpen(true)}
          />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <div className="page-enter p-4 md:p-6">{renderPage()}</div>
          </main>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <BottomNav activePage={page} onNavigate={handleNavigate} />

      {/* Live alert popup */}
      {liveAlert && (
        <div
          data-ocid="live_alert.toast"
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] md:w-full glass-card-solid rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300"
          style={{ boxShadow: "0 20px 60px oklch(0 0 0 / 50%)" }}
        >
          <div
            className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
              liveAlert.severity === "critical"
                ? "bg-red-500"
                : liveAlert.severity === "high"
                  ? "bg-orange-400"
                  : "bg-yellow-400"
            } animate-pulse`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
              {liveAlert.severity} alert
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {liveAlert.plate}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {liveAlert.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLiveAlert(null)}
            className="text-muted-foreground hover:text-foreground text-lg leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>
      )}

      <Toaster />
    </div>
  );
}
