"use client";

import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function UsersPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const users = useQuery(api.profile.listUsers);
  const profile = useQuery(api.profile.getProfile);
  const setUserRole = useMutation(api.profile.setUserRole);
  const updateUserLimit = useMutation(api.profile.updateUserLimit);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated || (profile && profile.role !== "admin")) {
    router.push("/dashboard");
    return null;
  }

  const handleToggleRole = async (userId: Id<"users">, currentRole: string) => {
    // Prevent changing your own role
    if (userId === profile?._id) {
      alert("You cannot change your own role.");
      return;
    }

    const newRole = currentRole === "admin" ? "user" : "admin";
    if (
      confirm(`Are you sure you want to change this user's role to ${newRole}?`)
    ) {
      await setUserRole({ userId, role: newRole });
    }
  };

  const handleLimitChange = async (userId: Id<"users">, newLimit: number) => {
    await updateUserLimit({ userId, limit: newLimit });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
        </div>

        <Card className="bg-white/10 border-white/10 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-400">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Usage</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* User Rows */}
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs">
                      {user.name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-white font-medium truncate">
                        {user.name || "No name"}
                      </div>
                      <div className="text-xs text-gray-500 md:hidden truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 text-gray-300 hidden md:block truncate">
                    {user.email}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm text-gray-300">
                      {user.imageCount} /
                    </span>
                    <Input
                      type="number"
                      defaultValue={user.maxUploads}
                      className="w-16 h-8 text-xs bg-black/20 border-white/10 text-white"
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val !== user.maxUploads) {
                          handleLimitChange(user._id, val);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    {user._id !== profile?._id ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleRole(user._id, user.role)}
                        className="text-gray-400 hover:text-white"
                      >
                        {user.role === "admin" ? "Demote" : "Promote"}
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-500 italic">You</span>
                    )}
                  </div>
                </div>
              ))}

              {users?.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No users found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
