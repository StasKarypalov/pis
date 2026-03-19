 "use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";

export function DashboardShell({
  role,
  children
}: {
  role: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto w-full max-w-screen-2xl px-4 pt-6 pb-28 md:pb-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[280px_1fr]">
          <aside className="hidden md:block">
            <div className="glass-card p-2.5 border-primary/10">
              <Sidebar role={role} />
            </div>
          </aside>

          <section className="space-y-4">
            <div className="glass-card p-4 border-primary/10">
              <Topbar role={role} />
            </div>

            <div className="flex items-center justify-between gap-4 px-1">
              <Breadcrumbs />
            </div>

            <div className="space-y-4">{children}</div>
          </section>
        </div>
      </div>

      <MobileBottomNav role={role} />
    </div>
  );
}

