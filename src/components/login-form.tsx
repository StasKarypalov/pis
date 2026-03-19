 "use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function LoginForm() {
  const [email, setEmail] = useState("manager");
  const [password, setPassword] = useState("12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/dashboard",
      email,
      password
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card className="glass-card shadow-2xl border border-white/20 dark:border-white/10">
        <CardHeader className="space-y-2">
          <Badge variant="outline" className="w-fit gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Duty Shift Management
          </Badge>
          <CardTitle className="text-2xl md:text-3xl font-semibold">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to manage shifts and duty reports. Use manager demo credentials or your Google account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>
            {error && (
              <p className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <Info className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative flex items-center justify-center py-1 text-xs text-muted-foreground">
            <span className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="relative bg-card px-2">or continue with</span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 bg-white/80 dark:bg-background"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white">
              <span className="text-xs font-bold text-[#4285F4]">G</span>
            </span>
            Sign in with Google
          </Button>

          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-200 flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5" />
            <div>
              <p className="font-medium">Demo manager account</p>
              <p>
                Email: <span className="font-mono text-xs">manager</span>, Password:{" "}
                <span className="font-mono text-xs">12345</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>New here?</p>
            <Button
              variant="link"
              size="sm"
              className="gap-1 px-0"
              asChild
            >
              <a href="/auth/register">
                Create employee account
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

