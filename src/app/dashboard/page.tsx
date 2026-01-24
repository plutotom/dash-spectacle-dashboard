"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="md:col-span-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Welcome! 🎉</CardTitle>
              <CardDescription className="text-gray-300">
                You&apos;re authenticated and viewing the protected dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Stat Cards */}
          {[
            { label: "Total Users", value: "1,234", icon: "👥" },
            { label: "Active Sessions", value: "56", icon: "🔗" },
            { label: "Messages", value: "89", icon: "💬" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition"
            >
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Section */}
        <Card className="mt-8 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { text: "You signed in successfully", time: "Just now" },
                { text: "Account created", time: "Earlier" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-gray-300">{item.text}</span>
                  <span className="text-muted-foreground text-sm">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
