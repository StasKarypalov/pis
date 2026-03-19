 "use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Users,
  Activity,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, TR, THead } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PendingUser = {
  id: string;
  email: string;
  name: string;
};

type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const pendingMock: PendingUser[] = [
  { id: "u1", email: "alice@example.com", name: "Alice Johnson" },
  { id: "u2", email: "bob@example.com", name: "Bob Smith" },
  { id: "u3", email: "cara@example.com", name: "Cara Williams" }
];

const placesMock: Place[] = [
  { id: "p1", name: "Main Office Zone A", lat: 55.75, lng: 37.61 },
  { id: "p2", name: "Warehouse Gate 3", lat: 55.76, lng: 37.62 },
  { id: "p3", name: "Parking Area East", lat: 55.74, lng: 37.6 }
];

const statCards = [
  { id: "employees", icon: Users, label: "Total employees", value: "42", hint: "+3 this month" },
  { id: "shifts", icon: Activity, label: "Active shifts", value: "7", hint: "+1 week" },
  { id: "pending", icon: ShieldCheck, label: "Pending confirmations", value: "3", hint: "needs review" }
];

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? "pending";

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const [placeDialogOpen, setPlaceDialogOpen] = React.useState(false);
  const [placeName, setPlaceName] = React.useState("");
  const [placeLat, setPlaceLat] = React.useState("55.75");
  const [placeLng, setPlaceLng] = React.useState("37.61");

  const [shiftDialogOpen, setShiftDialogOpen] = React.useState(false);
  const [shiftDate, setShiftDate] = React.useState(() => formatDate(new Date()));

  const [reportFrom, setReportFrom] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [reportTo, setReportTo] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const pendingFiltered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pendingMock;
    return pendingMock.filter(
      (u) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedIds = React.useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected]
  );

  function navigateTo(nextTab: string) {
    router.push(`/dashboard/admin?tab=${encodeURIComponent(nextTab)}`);
  }

  async function confirmUser(ids: string[]) {
    toast.message("Confirming users…", { duration: 1200 });
    setTimeout(() => {
      toast.success(`Confirmed ${ids.length} user(s) (mock)`);
      setSelected({});
    }, 650);
  }

  async function rejectUser(id: string) {
    toast.message("Rejecting user…", { duration: 1200 });
    setTimeout(() => toast.error(`Rejected ${id} (mock)`), 650);
  }

  function applyPreset(preset: "today" | "week" | "month") {
    const now = new Date();
    const from = new Date(now);
    if (preset === "today") from.setDate(now.getDate());
    if (preset === "week") from.setDate(now.getDate() - 7);
    if (preset === "month") from.setDate(now.getDate() - 30);
    setReportFrom(from.toISOString().slice(0, 10));
    setReportTo(now.toISOString().slice(0, 10));
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.id} className="glass-card border-primary/10">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{s.hint}</div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "pending", label: "Pending confirmations" },
            { id: "shifts", label: "Shift management" },
            { id: "places", label: "Places & zones" },
            { id: "reports", label: "Reports" }
          ].map((t) => (
            <Button
              key={t.id}
              type="button"
              variant={tab === t.id ? "default" : "outline"}
              className={cn(
                "rounded-xl border border-border/70 backdrop-blur-sm",
                tab === t.id && "shadow-[0_0_0_1px_rgba(99,102,241,0.15)]"
              )}
              onClick={() => navigateTo(t.id)}
              aria-label={t.label}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {tab === "places" && (
            <Button className="rounded-xl gap-2" onClick={() => setPlaceDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New place
            </Button>
          )}
          {tab === "shifts" && (
            <Button className="rounded-xl gap-2" onClick={() => setShiftDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create shift
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="glass-card border-primary/10">
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">Unconfirmed employees</CardTitle>
                  <CardDescription>
                    Review registrations and confirm users. This section uses mock data; wire it to your DB later.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by email or name…"
                    aria-label="Search users"
                    className="w-full md:w-64 rounded-xl"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <Table>
                      <THead>
                        <TR>
                          <TH className="w-14">Select</TH>
                          <TH>User</TH>
                          <TH>Email</TH>
                          <TH className="text-right">Actions</TH>
                        </TR>
                      </THead>
                      <TBody>
                        {pendingFiltered.map((u) => {
                          const isChecked = !!selected[u.id];
                          return (
                            <TR key={u.id}>
                              <TD>
                                <input
                                  type="checkbox"
                                  aria-label={`Select ${u.name}`}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    setSelected((prev) => ({ ...prev, [u.id]: e.target.checked }))
                                  }
                                  className="h-4 w-4 rounded border-border/80 text-primary focus:ring-ring"
                                />
                              </TD>
                              <TD>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                      {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="leading-tight">
                                    <div className="text-sm font-semibold">{u.name}</div>
                                    <Badge variant="warning" className="mt-1">
                                      Pending
                                    </Badge>
                                  </div>
                                </div>
                              </TD>
                              <TD className="text-muted-foreground">{u.email}</TD>
                              <TD className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="rounded-xl gap-2"
                                    onClick={() => confirmUser([u.id])}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="rounded-xl gap-2"
                                    onClick={() => rejectUser(u.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                              </TD>
                            </TR>
                          );
                        })}
                        {pendingFiltered.length === 0 && (
                          <TR>
                            <TD colSpan={4}>
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                No users match your search.
                              </div>
                            </TD>
                          </TR>
                        )}
                      </TBody>
                    </Table>

                    <Separator />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="text-sm text-muted-foreground">
                        Selected: <span className="font-semibold text-foreground">{selectedIds.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setSelected({})}
                          disabled={selectedIds.length === 0}
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                        <Button
                          className="rounded-xl gap-2"
                          onClick={() => confirmUser(selectedIds)}
                          disabled={selectedIds.length === 0}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Confirm selected
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "places" && (
          <motion.div
            key="places"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="glass-card border-primary/10">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-xl">Places & zones</CardTitle>
                  <CardDescription>
                    Draw zone polygons on an interactive map (placeholder UI). Save/edit/delete will be wired later.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
                  <div className="space-y-3">
                    <div className="h-[420px] rounded-2xl border border-border/70 bg-card/40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
                      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/40 px-3 py-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold">React Leaflet map here</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Implement polygon drawing with React Leaflet. Existing zones will be displayed with markers/polygons.
                          </p>
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" className="rounded-xl" disabled>
                              Draw polygon
                            </Button>
                            <Button variant="outline" className="rounded-xl" disabled>
                              Fullscreen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                      <p className="text-sm font-semibold">How to define a zone</p>
                      <ul className="mt-2 text-sm text-muted-foreground list-disc ml-5 space-y-1">
                        <li>Click “Draw polygon”.</li>
                        <li>Click to place vertices around the zone boundary.</li>
                        <li>Save to store polygon GeoJSON in `Place.polygon`.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Zones</p>
                      <Badge variant="secondary">{placesMock.length} places</Badge>
                    </div>
                    <div className="space-y-2">
                      {placesMock.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-2xl border border-border/70 bg-card/40 p-3 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl" disabled>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" className="rounded-xl" disabled>
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm font-semibold">Next</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Wire save/edit actions to Prisma and enable polygon persistence.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "shifts" && (
          <motion.div
            key="shifts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="glass-card border-primary/10">
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Shift management</CardTitle>
                  <CardDescription>
                    Assign shifts to employees and sync them to their external Google Calendar.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="rounded-xl" disabled>
                    Month
                  </Button>
                  <Button variant="outline" className="rounded-xl" disabled>
                    Week
                  </Button>
                  <Button variant="outline" className="rounded-xl" disabled>
                    Day
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Calendar view</p>
                      <Badge variant="success">Ready to assign</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-16 rounded-xl border border-border/50 bg-background/30"
                        />
                      ))}
                    </div>
                    <div className="mt-4 rounded-2xl border border-border/70 bg-background/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        Drag-and-drop assignment UI will be implemented once shifts and employee lists are connected.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Recent shifts</p>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setShiftDialogOpen(true)}>
                        Create
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {[
                        { id: "s1", title: "Security duty", place: "Main Office Zone A", time: "08:00–16:00", status: "CONFIRMED" },
                        { id: "s2", title: "Warehouse patrol", place: "Warehouse Gate 3", time: "16:00–23:00", status: "PENDING" }
                      ].map((s) => (
                        <div key={s.id} className="rounded-2xl border border-border/70 bg-card/40 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">{s.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{s.place}</p>
                            </div>
                            <Badge
                              variant={s.status === "CONFIRMED" ? "success" : "warning"}
                              className="whitespace-nowrap"
                            >
                              {s.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Time: {s.time}</p>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl" disabled>
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-xl"
                              onClick={() => toast.message("Calendar sync would run here (mock)")}
                            >
                              Sync
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="glass-card border-primary/10">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-xl">Generate duty report</CardTitle>
                  <CardDescription>
                    Creates a Google Doc report for the selected period. (UI + mock preview; API wiring later.)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Input id="from" type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">Presets</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => applyPreset("today")}>
                        Today
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => applyPreset("week")}>
                        This week
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => applyPreset("month")}>
                        This month
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Preview range: <span className="font-semibold text-foreground">{reportFrom}</span> →{" "}
                    <span className="font-semibold text-foreground">{reportTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="rounded-xl gap-2"
                      disabled={isGenerating}
                      onClick={() => {
                        setIsGenerating(true);
                        toast.message("Generating Google Doc…", { duration: 1400 });
                        setTimeout(() => {
                          setIsGenerating(false);
                          toast.success("Report generated (mock). Shareable link would appear.");
                        }, 1500);
                      }}
                    >
                      {isGenerating ? <Clock3 className="h-4 w-4 animate-spin" /> : <Timer className="h-4 w-4" />}
                      {isGenerating ? "Generating…" : "Generate report"}
                    </Button>
                    <Button variant="outline" className="rounded-xl" disabled>
                      Download PDF
                    </Button>
                    <Button variant="outline" className="rounded-xl" disabled>
                      Open in Google Docs
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { k: "Total shifts", v: "12", tone: "primary" },
                    { k: "Completed results", v: "10", tone: "success" },
                    { k: "Issues flagged", v: "2", tone: "warning" }
                  ].map((m) => (
                    <Card key={m.k} className="glass-card border-primary/10">
                      <CardContent className="p-5 space-y-2">
                        <p className="text-xs text-muted-foreground">{m.k}</p>
                        <p className="text-2xl font-semibold tracking-tight">{m.v}</p>
                        <div
                          className={cn(
                            "text-xs inline-flex items-center gap-2 rounded-full px-2 py-1 border",
                            m.tone === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
                            m.tone === "warning" && "border-amber-500/30 bg-amber-500/10 text-amber-600",
                            m.tone === "primary" && "border-primary/30 bg-primary/10 text-primary"
                          )}
                        >
                          Key metric
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                  <p className="text-sm font-semibold">Report shareable link</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    After generation, the backend will return a Google Doc link to this manager.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      value="https://docs.google.com/document/d/<id>/edit?usp=sharing"
                      readOnly
                      aria-label="Report link"
                      className="rounded-xl"
                    />
                    <Button variant="outline" className="rounded-xl" disabled>
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Place creation */}
      <Dialog open={placeDialogOpen} onOpenChange={setPlaceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New place</DialogTitle>
            <DialogDescription>
              Define the place name and store coordinates. Polygon drawing UI will be added next.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor="placeName">Place name</Label>
              <Input id="placeName" value={placeName} onChange={(e) => setPlaceName(e.target.value)} placeholder="e.g. Lobby Entrance" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeLat">Latitude</Label>
              <Input id="placeLat" value={placeLat} onChange={(e) => setPlaceLat(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeLng">Longitude</Label>
              <Input id="placeLng" value={placeLng} onChange={(e) => setPlaceLng(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Zone polygon</Label>
              <div className="rounded-xl border border-border/70 bg-card/50 p-3 text-xs text-muted-foreground">
                Polygon editor (React Leaflet) placeholder
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setPlaceDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-xl gap-2"
              onClick={() => {
                toast.success("Place saved (mock). Polygon will be stored in GeoJSON.");
                setPlaceDialogOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Save place
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shift creation */}
      <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create shift</DialogTitle>
            <DialogDescription>Assign date/time and pick place/employee (UI placeholder).</DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shiftDate">Date</Label>
              <Input id="shiftDate" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Start time</Label>
              <Input type="time" defaultValue="08:00" />
            </div>
            <div className="space-y-2">
              <Label>End time</Label>
              <Input type="time" defaultValue="16:00" />
            </div>
            <div className="space-y-2">
              <Label>Place</Label>
              <select className="w-full h-10 rounded-xl border border-input bg-background/80 px-3 text-sm" defaultValue={placesMock[0]?.id}>
                {placesMock.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Employee</Label>
              <select className="w-full h-10 rounded-xl border border-input bg-background/80 px-3 text-sm" defaultValue="emp1" disabled>
                <option value="emp1">Connect employee selection</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Employee selection + drag-drop will be wired to DB after manager confirmation flow is implemented.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setShiftDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-xl gap-2"
              onClick={() => {
                toast.success("Shift created (mock). Calendar event with reminders will be created.");
                setShiftDialogOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Create shift
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

