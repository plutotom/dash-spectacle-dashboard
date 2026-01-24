"use client";

import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, User, Crown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const profile = useQuery(api.profile.getProfile);
  const updateProfile = useMutation(api.profile.updateProfile);
  const claimAdmin = useMutation(api.profile.claimAdmin);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [claimingAdmin, setClaimingAdmin] = useState(false);
  const [claimError, setClaimError] = useState("");

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  // Populate form with current profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleClaimAdmin = async () => {
    setClaimingAdmin(true);
    setClaimError("");

    try {
      await claimAdmin();
      // Success
      alert("Successfully claimed admin access! The page will now refresh.");
      window.location.href = window.location.href;
    } catch (err) {
      setClaimError(
        err instanceof Error ? err.message : "Failed to claim admin access",
      );
      setClaimingAdmin(false);
    }
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

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-xl border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Badge */}
            <div className="flex justify-center flex-col items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  isAdmin
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                }`}
              >
                {isAdmin ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {isAdmin ? "Admin" : "User"}
              </div>

              {!isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      disabled={claimingAdmin}
                      className="text-yellow-500/70 hover:text-yellow-400 text-xs h-auto p-0"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      {claimingAdmin ? "Checking..." : "Claim Admin Access"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Claim Admin Access?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This action will grant you Super Admin privileges. It is
                        only available because no other admins exist in the
                        system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/10 hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClaimAdmin}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {claimError && (
                <p className="text-xs text-red-400">{claimError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-white/5 border-white/10 text-gray-400"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
              <p className="text-xs text-gray-500">
                This name will appear on your messages
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500/50 bg-green-500/10 text-green-400">
                <AlertDescription>
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1 border-white/10 hover:bg-white/10"
              >
                Back to Dashboard
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
