import {
  BarChart3,
  Bell,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Monitor,
  Users,
  X,
} from "lucide-react";
import type { Page } from "../App";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePage: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "cameras", label: "Cameras", icon: Camera },
  { id: "monitoring", label: "Live Monitor", icon: Monitor },
  { id: "logs", label: "ANPR Logs", icon: FileText },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

function SidebarContent({
  collapsed,
  activePage,
  onNavigate,
  onToggle,
  showCollapseToggle,
  onClose,
}: {
  collapsed: boolean;
  activePage: Page;
  onNavigate: (page: Page) => void;
  onToggle: () => void;
  showCollapseToggle: boolean;
  onClose?: () => void;
}) {
  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 relative z-20"
      style={{
        width: collapsed ? "64px" : "240px",
        background: "oklch(var(--sidebar))",
        borderRight: "1px solid oklch(var(--sidebar-border))",
        boxShadow: "4px 0 24px oklch(0 0 0 / 20%)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
        style={{ minHeight: 72 }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "oklch(var(--primary))",
            boxShadow: "0 0 16px oklch(var(--primary) / 40%)",
          }}
        >
          <Eye className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-sm tracking-widest text-foreground">
              ANPR VISION
            </p>
            <p className="text-xs text-muted-foreground">
              Intelligence Platform
            </p>
          </div>
        )}
        {/* Close button in mobile drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onNavigate(item.id)}
              className={`nav-item w-full ${isActive ? "active" : ""} ${
                collapsed ? "justify-center px-0" : ""
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "oklch(var(--primary))" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div
        className="px-2 py-4 border-t flex items-center gap-3 flex-shrink-0"
        style={{ borderColor: "oklch(var(--sidebar-border))" }}
      >
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "oklch(var(--primary))" }}
        >
          EC
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                Ethan Clarke
              </p>
              <p className="text-[10px] text-muted-foreground">Administrator</p>
            </div>
            <button
              type="button"
              data-ocid="nav.logout.button"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      {showCollapseToggle && (
        <button
          type="button"
          data-ocid="sidebar.toggle"
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-30"
          style={{
            background: "oklch(var(--sidebar))",
            border: "1px solid oklch(var(--sidebar-border))",
            boxShadow: "0 2px 8px oklch(0 0 0 / 30%)",
          }}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      )}
    </aside>
  );
}

export function Sidebar({
  collapsed,
  onToggle,
  activePage,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden md:block h-full transition-all duration-300"
        style={{ width: collapsed ? 64 : 240, flexShrink: 0 }}
      >
        <SidebarContent
          collapsed={collapsed}
          activePage={activePage}
          onNavigate={onNavigate}
          onToggle={onToggle}
          showCollapseToggle={true}
        />
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={onMobileClose}
          onKeyDown={(e) => e.key === "Escape" && onMobileClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Drawer panel */}
          <div
            className="relative z-10 h-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <SidebarContent
              collapsed={false}
              activePage={activePage}
              onNavigate={onNavigate}
              onToggle={onToggle}
              showCollapseToggle={false}
              onClose={onMobileClose}
            />
          </div>
        </div>
      )}
    </>
  );
}
