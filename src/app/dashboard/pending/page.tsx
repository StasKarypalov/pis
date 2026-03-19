import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const role = ((session.user as any)?.role as string | undefined) ?? "PENDING";

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
      <Card className="glass-card border-primary/10">
        <CardHeader>
          <div className="space-y-2">
            <Badge variant="warning" className="w-fit">
              Pending confirmation
            </Badge>
            <CardTitle className="text-2xl">Your account is waiting for approval</CardTitle>
            <CardDescription>
              Managers need to confirm your registration before you can access shift scheduling features.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            We received your registration for <span className="font-medium">{session.user?.email}</span>.
          </p>
          <div className="rounded-xl border border-border/70 bg-card/40 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">What happens next?</p>
            <ol className="list-decimal ml-5 text-sm space-y-1">
              <li>Manager reviews your details</li>
              <li>Manager assigns you the employee role</li>
              <li>You will start seeing assigned shifts</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
          <CardDescription>Your current role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card/40 p-4">
            <div className="text-sm font-semibold">{role}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Once confirmed, you can access employee features.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/40 p-4">
            <p className="text-xs font-semibold text-muted-foreground">Tip</p>
            <p className="text-sm mt-1">
              Keep your Google Calendar OAuth tokens up to date so managers can sync shifts to your calendar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

