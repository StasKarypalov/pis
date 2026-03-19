 "use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, MapPin, Settings, StickyNote, SquareDashedMousePointer, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav({ role }: { role: string }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "";

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/70 backdrop-blur-xl"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-4 px-3 py-2 gap-2">
        {role === "MANAGER" ? (
          <>
            <Link
              href={`/dashboard/admin?tab=pending`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "pending"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Pending
            </Link>
            <Link
              href={`/dashboard/admin?tab=shifts`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "shifts"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <CalendarCheck className="h-4 w-4" />
              Shifts
            </Link>
            <Link
              href={`/dashboard/admin?tab=places`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "places"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <MapPin className="h-4 w-4" />
              Places
            </Link>
            <Link
              href={`/dashboard/admin?tab=reports`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "reports"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <StickyNote className="h-4 w-4" />
              Reports
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/dashboard/employee?tab=upcoming`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "upcoming"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <CalendarCheck className="h-4 w-4" />
              Upcoming
            </Link>
            <Link
              href={`/dashboard/employee?tab=results`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "results"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <SquareDashedMousePointer className="h-4 w-4" />
              Results
            </Link>
            <Link
              href={`/dashboard/employee?tab=profile`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs border transition",
                tab === "profile"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/20 border-border/70 text-muted-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Profile
            </Link>
            <div className="rounded-xl border border-transparent bg-transparent" />
          </>
        )}
      </div>
    </nav>
  );
}

