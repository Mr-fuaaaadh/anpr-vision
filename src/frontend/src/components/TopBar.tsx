import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { organizations } from "../mockData";

interface TopBarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onMenuClick: () => void;
}

export function TopBar({ darkMode, onToggleDark, onMenuClick }: TopBarProps) {
  const [orgIdx, setOrgIdx] = useState(0);
  const [orgOpen, setOrgOpen] = useState(false);
  const org = organizations[orgIdx];

  return (
    <header
      className="flex items-center gap-3 px-3 md:px-6 py-3 flex-shrink-0 relative z-10"
      style={{
        background: "oklch(var(--card) / 80%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid oklch(var(--border))",
        boxShadow: "0 1px 0 oklch(1 0 0 / 4%), 0 4px 20px oklch(0 0 0 / 15%)",
        height: 64,
      }}
    >
      {/* Hamburger - mobile only */}
      <button
        type="button"
        data-ocid="topbar.menu.button"
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Greeting */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Good {getTimeGreeting()}, Ethan
        </p>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Smart City Authority Dashboard
        </p>
      </div>

      {/* Search */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: "oklch(var(--muted) / 60%)",
          border: "1px solid oklch(var(--border))",
          width: 260,
        }}
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <input
          data-ocid="topbar.search_input"
          type="text"
          placeholder="Search cameras, plates…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
        />
      </div>

      {/* Org switcher */}
      <div className="relative">
        <button
          type="button"
          data-ocid="topbar.org.select"
          onClick={() => setOrgOpen((o) => !o)}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
          style={{ border: "1px solid oklch(var(--border))" }}
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: "oklch(var(--primary))" }}
          >
            {org.name.charAt(0)}
          </div>
          <span className="max-w-[120px] truncate">{org.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {orgOpen && (
          <div
            className="absolute top-full mt-2 right-0 rounded-xl py-1 min-w-[220px] z-50"
            style={{
              background: "oklch(var(--popover))",
              border: "1px solid oklch(var(--border))",
              boxShadow: "0 16px 40px oklch(0 0 0 / 40%)",
            }}
          >
            {organizations.map((o, i) => (
              <button
                type="button"
                key={o.id}
                data-ocid={`topbar.org.item.${i + 1}`}
                onClick={() => {
                  setOrgIdx(i);
                  setOrgOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                  i === orgIdx ? "text-primary" : "text-foreground"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: "oklch(var(--primary))" }}
                >
                  {o.name.charAt(0)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium truncate">{o.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {o.plan} Plan
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <button
          type="button"
          data-ocid="topbar.notifications.button"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background" />
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          data-ocid="topbar.theme.toggle"
          onClick={onToggleDark}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: "oklch(var(--primary))",
              boxShadow: "0 0 12px oklch(var(--primary) / 40%)",
            }}
          >
            EC
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-foreground leading-none">
              Ethan Clarke
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
