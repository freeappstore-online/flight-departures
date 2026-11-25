import type { ReactNode } from "react";

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface ShellProps {
  children: ReactNode;
  navItems?: NavItem[];
  title?: string;
}

export function Shell({ children, navItems = [], title = "Flight Departures" }: ShellProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col border-r h-full shrink-0"
        style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
      >
        <div className="p-6" style={{ fontFamily: "Fraunces, serif" }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-xl" style={{ color: "var(--ink)" }}>
              {title}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Live departure board
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
              style={{
                background: item.active ? "var(--accent)" : "transparent",
                color: item.active ? "#fff" : "var(--ink)",
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
          <a
            href="https://freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Part of FreeAppStore — free forever
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <header
        className="flex md:hidden items-center gap-2 px-4 h-14 border-b shrink-0"
        style={{ borderColor: "var(--line)", background: "var(--panel)" }}
      >
        <span className="text-xl">✈️</span>
        <span className="font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
          {title}
        </span>
      </header>

      {/* Rendered once: refs and data fetching in children must not be duplicated */}
      <main className="flex-1 overflow-auto" style={{ background: "var(--paper)" }}>
        {children}
      </main>

      {/* Mobile tab bar */}
      {navItems.length > 0 && (
        <nav
          className="flex md:hidden items-center justify-around h-16 border-t shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              style={{ color: item.active ? "var(--accent)" : "var(--muted)" }}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
