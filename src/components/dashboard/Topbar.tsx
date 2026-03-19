 "use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell, Menu, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function formatLocalDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit"
  });
}

export function Topbar({
  role
}: {
  role: string;
}) {
  const { data } = useSession();
  const pathname = usePathname();
  const userEmail = data?.user?.email;
  const name = (data?.user as any)?.name ?? userEmail ?? "User";

  const today = formatLocalDate(new Date());
  const pending = role === "MANAGER" ? 3 : 0;

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Welcome</p>
        <h1 className="text-xl font-semibold tracking-tight">
          {role === "MANAGER" ? "Manager Console" : "Employee Workspace"}
        </h1>
        <p className="text-xs text-muted-foreground">{today}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            aria-label="Notifications"
            className="rounded-xl bg-card/40 backdrop-blur-sm"
          >
            <Bell className="h-4 w-4" />
          </Button>
          {pending > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] border-2 border-background"
              aria-label={`${pending} pending items`}
            >
              {pending}
            </span>
          )}
        </div>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "rounded-xl px-2.5 bg-card/40 backdrop-blur-sm",
                pathname.includes("dashboard") && "border-border/90"
              )}
              aria-label="User menu"
            >
              <span className="sr-only">Open user menu</span>
              <Avatar className="h-8 w-8 border border-border/70">
                <AvatarImage src={undefined} alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <UserRound className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-flex ml-2 text-sm font-medium">
                {name.length > 18 ? name.slice(0, 18) + "…" : name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="space-y-0.5">
                <div className="text-sm font-semibold">{name}</div>
                <div className="text-xs text-muted-foreground">{userEmail}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-destructive"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

