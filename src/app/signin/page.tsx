"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPasswordAuthErrorMessage } from "@/lib/auth-errors";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate name for signup
    if (flow === "signUp" && !name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow,
        // Only pass name during signup
        ...(flow === "signUp" && { name: name.trim() }),
      });
      // Use full page navigation to ensure auth state is fresh
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      console.error("[error] signin error", err);
      setError(getPasswordAuthErrorMessage(err, flow));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="w-full max-w-md bg-background/90 backdrop-blur-xl border-border/60 shadow-lg shadow-slate-950/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {flow === "signIn" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {flow === "signIn"
              ? "Sign in to continue"
              : "Sign up to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field - only shown during signup */}
            {flow === "signUp" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required={flow === "signUp"}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
            >
              {loading
                ? "Loading..."
                : flow === "signIn"
                  ? "Sign In"
                  : "Sign Up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Button
            variant="link"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError("");
            }}
            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            {flow === "signIn"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
