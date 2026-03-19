 "use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  MapPin,
  Settings,
  ShieldCheck,
  SquareDashedMousePointer,
  StickyNote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
};

const managerNav: NavItem[] = [
  {
    href: "/dashboard/admin?tab=pending",
    label: "Pending",
    icon: <ShieldCheck className="h-4 w-4" />
  },
  {
    href: "/dashboard/admin?tab=shifts",
    label: "Shifts",
    icon: <CalendarCheck className="h-4 w-4" />
  },
  {
    href: "/dashboard/admin?tab=places",
    label: "Places",
    icon: <MapPin className="h-4 w-4" />
  },
  {
    href: "/dashboard/admin?tab=reports",
    label: "Reports",
    icon: <StickyNote className="h-4 w-4" />
  }
];

const employeeNav: NavItem[] = [
  {
    href: "/dashboard/employee?tab=upcoming",
    label: "Upcoming",
    icon: <CalendarCheck className="h-4 w-4" />
  },
  {
    href: "/dashboard/employee?tab=results",
    label: "Results",
    icon: <SquareDashedMousePointer className="h-4 w-4" />
  },
  {
    href: "/dashboard/employee?tab=profile",
    label: "Profile",
    icon: <Settings className="h-4 w-4" />
  }
];

export function Sidebar({ role, pendingCount = 3 }: { role: string; pendingCount?: number }) {
  const pathname = usePathname();
  const nav = role === "MANAGER" ? managerNav : employeeNav;

  return (
    <aside className="w-full">
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <Bell className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">DutyShift</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {role === "MANAGER" ? "Manager console" : "Employee space"}
          </p>
        </div>
      </div>

      <div className="px-2 pb-2">
        <nav aria-label="Sidebar navigation" className="space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href.replace(/\?.*$/, "")) || pathname === "/dashboard/admin";
            const itemPending = item.label === "Pending";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition",
                  active
                    ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(99,102,241,0.08)]"
                    : "border-border/70 bg-card/30 hover:bg-card/60 hover:border-border/90"
                )}
                aria-label={item.label}
              >
                <span className="flex items-center gap-3">
                  <span className="text-muted-foreground group-hover:text-primary transition">
                    {item.icon}
                  </span>
                  <span className={cn("text-sm font-medium", active ? "text-primary" : "text-foreground")}>
                    {item.label}
                  </span>
                </span>
                {itemPending && role === "MANAGER" ? (
                  <Badge variant="warning" className="ml-auto">
                    {pendingCount}
                  </Badge>
                ) : (
                  item.badge && <Badge variant="default">{item.badge}</Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-4">
        <div className="glass-card p-3">
          <p className="text-xs font-medium text-muted-foreground">Quick actions</p>
          <div className="mt-2 grid gap-2">
            <Link
              href={role === "MANAGER" ? "/dashboard/admin?tab=shifts" : "/dashboard/employee?tab=upcoming"}
              className="rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-sm hover:bg-card/70 transition"
            >
              Open workspace
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

