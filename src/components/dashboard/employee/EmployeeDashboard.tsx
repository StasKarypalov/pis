 "use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Inbox,
  KeyRound,
  ShieldCheck,
  User,
  Wallet
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ShiftStatus = "CONFIRMED" | "PENDING" | "COMPLETED";

type UpcomingShift = {
  id: string;
  title: string;
  place: string;
  start: Date;
  end: Date;
  status: ShiftStatus;
};

type ResultRow = {
  id: string;
  shiftTitle: string;
  summary: string;
  submittedAt: Date;
};

function msToClock(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export function EmployeeDashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "upcoming";

  const [isLoading, setIsLoading] = React.useState(true);
  const [resultDialogOpen, setResultDialogOpen] = React.useState(false);
  const [activeShiftId, setActiveShiftId] = React.useState<string | null>(null);

  const now = React.useMemo(() => new Date(), []);
  const [ticker, setTicker] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const i = setInterval(() => setTicker((v) => v + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const upcoming = React.useMemo<UpcomingShift[]>(() => {
    const base = Date.now();
    const mk = (id: string, offsetHoursStart: number, durationHours: number, status: ShiftStatus, title: string, place: string) => {
      const start = new Date(base + offsetHoursStart * 3600_000);
      const end = new Date(start.getTime() + durationHours * 3600_000);
      return { id, title, place, start, end, status };
    };
    return [
      mk("s1", 2, 8, "CONFIRMED", "Front desk duty", "Main Office Zone A"),
      mk("s2", 18, 7, "PENDING", "Warehouse patrol", "Warehouse Gate 3"),
      mk("s3", 44, 6, "CONFIRMED", "Evening parking coverage", "Parking Area East")
    ];
  }, [now, ticker]);

  const results = React.useMemo<ResultRow[]>(
    () => [
      {
        id: "r1",
        shiftTitle: "Front desk duty",
        summary: "No incidents. Completed access check and sign-in verification.",
        submittedAt: new Date(Date.now() - 2 * 24 * 3600_000)
      },
      {
        id: "r2",
        shiftTitle: "Warehouse patrol",
        summary: "Inventory spot-check done. Minor delay at Gate 3.",
        submittedAt: new Date(Date.now() - 8 * 24 * 3600_000)
      }
    ],
    []
  );

  const connectionStatus: "CONNECTED" | "NEEDS_UPDATE" = "CONNECTED";

  function openResult(shiftId: string) {
    setActiveShiftId(shiftId);
    setResultDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {tab === "upcoming" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Next duty assignments</p>
                <h2 className="text-xl font-semibold tracking-tight">Upcoming shifts</h2>
              </div>
              <Badge variant="success" className="rounded-full">Synced</Badge>
            </div>

            {isLoading ? (
              <div className="grid gap-3 md:grid-cols-3">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-3">
                {upcoming.slice(0, 3).map((s) => {
                  const ms = s.start.getTime() - Date.now();
                  const statusBadge =
                    s.status === "CONFIRMED"
                      ? { variant: "success" as const, label: "Confirmed" }
                      : s.status === "PENDING"
                        ? { variant: "warning" as const, label: "Pending" }
                        : { variant: "default" as const, label: "Completed" };

                  return (
                    <Card key={s.id} className="glass-card border-primary/10 overflow-hidden">
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <CardTitle className="text-base truncate">{s.title}</CardTitle>
                            <CardDescription className="mt-1 text-xs truncate">{s.place}</CardDescription>
                          </div>
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            Starts in
                          </span>
                          <span className="font-mono text-emerald-600">{msToClock(ms)}</span>
                        </div>
                        <Separator className="bg-border/50" />
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-muted-foreground">
                            {s.start.toLocaleDateString(undefined, { month: "short", day: "2-digit" })}{" "}
                            {s.start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => toast.message("Add to calendar would run here (mock)")}
                          >
                            Add
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="w-full rounded-xl gap-2"
                          onClick={() => openResult(s.id)}
                          disabled={s.status !== "CONFIRMED" && s.status !== "COMPLETED"}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Submit result
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "results" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Completed duty feedback</p>
                <h2 className="text-xl font-semibold tracking-tight">Shift results</h2>
              </div>
              <Badge variant="secondary">Google Forms → Sheets</Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-40" />
                  <Skeleton className="h-40" />
                </>
              ) : (
                results.map((r) => (
                  <Card key={r.id} className="glass-card border-primary/10">
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-base">{r.shiftTitle}</CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            Submitted {r.submittedAt.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="text-sm text-muted-foreground">{r.summary}</p>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => toast.message("View/Edit result (mock)")}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl gap-2"
                          onClick={() => {
                            setActiveShiftId("new-shift");
                            setResultDialogOpen(true);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          New submission
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
              <p className="text-sm font-semibold">Submission flow</p>
              <p className="text-xs text-muted-foreground mt-1">
                Employees submit duty outcomes through a Google Form. The backend reads responses from the linked Google Sheet and shows results here.
              </p>
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Account & integrations</p>
                <h2 className="text-xl font-semibold tracking-tight">Profile settings</h2>
              </div>
              <Badge variant={connectionStatus === "CONNECTED" ? "success" : "warning"}>
                {connectionStatus === "CONNECTED" ? "Calendar connected" : "Needs update"}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Card className="glass-card border-primary/10">
                <CardHeader>
                  <CardTitle className="text-base">Google Calendar</CardTitle>
                  <CardDescription>
                    Used to create shift events for your account (including reminders).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Status</p>
                        <p className="text-xs text-muted-foreground">
                          {connectionStatus === "CONNECTED"
                            ? "Tokens are stored and should be valid."
                            : "Your tokens are missing or expired. Update them in registration or via a token update flow."}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-xl gap-2"
                    variant={connectionStatus === "CONNECTED" ? "outline" : "default"}
                    onClick={() => toast.message("Update tokens flow would open (mock)")}
                  >
                    <KeyRound className="h-4 w-4" />
                    Update calendar tokens
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card border-primary/10">
                <CardHeader>
                  <CardTitle className="text-base">Notification preferences</CardTitle>
                  <CardDescription>
                    Configure how managers get notified about confirmations and reports.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Shift reminders</p>
                        <p className="text-xs text-muted-foreground">1 day before and 1 hour before</p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                    <p className="text-sm font-semibold">Activity feed</p>
                    <p className="text-xs text-muted-foreground mt-1">New confirmations and report links (mock)</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-xl" disabled>
                        Enable email
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl" disabled>
                        Enable push
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </motion.div>

      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submit shift result</DialogTitle>
            <DialogDescription>
              This will open your Google Form submission for shift <span className="font-mono">{activeShiftId ?? "—"}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
              <p className="text-sm font-semibold">Google Form</p>
              <p className="text-xs text-muted-foreground mt-1">
                The final implementation will show an embedded form or open a new tab. The backend will ingest the related Google Sheet.
              </p>
              <Input
                readOnly
                className="mt-3 rounded-xl font-mono text-xs"
                value="https://docs.google.com/forms/d/<FORM_ID>/viewform?usp=pp_url"
                aria-label="Google Form URL"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  className="rounded-xl gap-2"
                  onClick={() => {
                    toast.success("Opened form in new tab (mock)");
                    setResultDialogOpen(false);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open form
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    toast.message("Form iframe embed will go here (mock)");
                  }}
                >
                  Embed
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

