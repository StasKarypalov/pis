 "use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Manager",
  employee: "Employee"
};

export function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const displaySegments = segments.map((s) => ({
    raw: s,
    label: labelMap[s] ?? s.charAt(0).toUpperCase() + s.slice(1)
  }));

  if (displaySegments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
      {displaySegments.map((seg, idx) => (
        <React.Fragment key={seg.raw + idx}>
          {idx !== 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="font-medium text-muted-foreground">
            {seg.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

