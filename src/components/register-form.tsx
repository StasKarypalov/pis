 "use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [calendarTokenJson, setCalendarTokenJson] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = Math.min(100, calendarTokenJson.length / 4);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, calendarTokenJson })
    });
    const data = await res.json();
    setIsSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
    } else {
      setMessage("Registration submitted. A manager will confirm your account before you can access the system.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-2xl"
    >
      <Card className="glass-card shadow-2xl border border-white/20 dark:border-white/10">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="w-fit gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wide"
            >
              <UserPlus className="h-3 w-3 text-primary" />
              Employee registration
            </Badge>
            <CardTitle className="text-2xl md:text-3xl">
              Join the duty shift team
            </CardTitle>
            <CardDescription>
              Create an account and connect your Google Calendar so managers can schedule your shifts seamlessly.
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-500">
              <ShieldCheck className="h-3 w-3" />
              Secure OAuth tokens
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-1 text-indigo-500">
              <CalendarDays className="h-3 w-3" />
              Google Calendar integration
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-4 text-xs font-medium">
            <button
              type="button"
              className={`flex flex-1 items-center gap-2 rounded-full border px-3 py-2 transition ${
                step === 1
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/60 text-muted-foreground"
              }`}
              onClick={() => setStep(1)}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                1
              </span>
              Basic information
            </button>
            <button
              type="button"
              className={`flex flex-1 items-center gap-2 rounded-full border px-3 py-2 transition ${
                step === 2
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/60 text-muted-foreground"
              }`}
              onClick={() => setStep(2)}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                2
              </span>
              Calendar connection
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    You will appear as <span className="font-medium">pending</span> until a manager confirms your account.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tokens">
                    Google Calendar OAuth tokens JSON
                  </Label>
                  <textarea
                    id="tokens"
                    required
                    className="min-h-[120px] w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm font-mono leading-relaxed text-muted-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={calendarTokenJson}
                    onChange={(e) => setCalendarTokenJson(e.target.value)}
                    placeholder='{"access_token":"...","refresh_token":"...","scope":"https://www.googleapis.com/auth/calendar","token_type":"Bearer","expiry_date":1234567890}'
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the JSON output you received after completing the Google OAuth consent flow for the{" "}
                    <span className="font-mono text-[11px]">
                      https://www.googleapis.com/auth/calendar
                    </span>{" "}
                    scope (see README for a helper script).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Token strength</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {passwordStrength.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 transition-all"
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <span>
                    I understand that my Google Calendar tokens will be stored securely and used only to create and manage duty shift events on my behalf.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
            {message && (
              <p className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5" />
                {message}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(step === 1 ? 1 : 1)}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                type={step === 2 ? "submit" : "button"}
                onClick={step === 1 ? () => setStep(2) : undefined}
                disabled={isSubmitting}
                className="gap-2"
              >
                {step === 2 ? (
                  <>
                    {isSubmitting ? "Creating account..." : "Submit registration"}
                  </>
                ) : (
                  <>
                    Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

