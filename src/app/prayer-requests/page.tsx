"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  X,
  Check,
  Plus,
  ArrowLeft,
  CheckCircle,
  Circle,
  Shield,
} from "lucide-react";

type FilterType = "all" | "answered" | "unanswered";

export default function PrayerRequestsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");

  const requests = useQuery(api.prayerRequests.listAll, { filter, limit: 100 });
  const isAdmin = useQuery(api.profile.isAdmin);
  const createRequest = useMutation(api.prayerRequests.create);
  const updateRequest = useMutation(api.prayerRequests.update);
  const markAnswered = useMutation(api.prayerRequests.markAnswered);
  const deleteRequest = useMutation(api.prayerRequests.remove);

  const [editingId, setEditingId] = useState<Id<"prayerRequests"> | null>(null);
  const [editFrom, setEditFrom] = useState("");
  const [editFor, setEditFor] = useState("");
  const [editRequest, setEditRequest] = useState("");

  const [showNewForm, setShowNewForm] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newFor, setNewFor] = useState("");
  const [newRequest, setNewRequest] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  const handleEdit = (request: {
    _id: Id<"prayerRequests">;
    prayerRequestFrom?: string;
    prayerFor?: string;
    prayerRequest?: string;
  }) => {
    setEditingId(request._id);
    setEditFrom(request.prayerRequestFrom || "");
    setEditFor(request.prayerFor || "");
    setEditRequest(request.prayerRequest || "");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await updateRequest({
      id: editingId,
      prayerRequestFrom: editFrom,
      prayerFor: editFor,
      prayerRequest: editRequest,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleToggleAnswered = async (
    id: Id<"prayerRequests">,
    currentStatus: boolean,
  ) => {
    await markAnswered({ id, isAnswered: !currentStatus });
  };

  const handleDelete = async (id: Id<"prayerRequests">) => {
    if (confirm("Are you sure you want to delete this prayer request?")) {
      await deleteRequest({ id });
    }
  };

  const handleCreate = async () => {
    await createRequest({
      prayerRequestFrom: newFrom || undefined,
      prayerFor: newFor || undefined,
      prayerRequest: newRequest || undefined,
    });
    setNewFrom("");
    setNewFor("");
    setNewRequest("");
    setShowNewForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Prayer Requests</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Request
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "unanswered", "answered"] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-teal-600" : "text-gray-400"}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* New Request Form - Admin Only */}
        {showNewForm && isAdmin && (
          <Card className="mb-6 bg-white/10 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                New Prayer Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">From</Label>
                  <Input
                    placeholder="Who is requesting prayer?"
                    value={newFrom}
                    onChange={(e) => setNewFrom(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">For</Label>
                  <Input
                    placeholder="Who/what is the prayer for?"
                    value={newFor}
                    onChange={(e) => setNewFor(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Prayer Request</Label>
                <textarea
                  placeholder="Details of the prayer request..."
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  className="w-full h-24 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreate}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowNewForm(false)}
                  className="text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Non-admin notice */}
        {!isAdmin && (
          <Card className="mb-6 bg-yellow-500/10 border-yellow-500/30 backdrop-blur-xl">
            <CardContent className="p-4 text-center text-yellow-300 text-sm">
              You are viewing prayer requests in read-only mode. Contact an
              admin to make changes.
            </CardContent>
          </Card>
        )}

        {/* Prayer Requests List */}
        <div className="space-y-4">
          {requests?.map((request) => (
            <Card
              key={request._id}
              className={`bg-white/10 border backdrop-blur-xl transition-all ${
                request.isAnswered
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-white/10"
              }`}
            >
              <CardContent className="p-4">
                {editingId === request._id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="From"
                        value={editFrom}
                        onChange={(e) => setEditFrom(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <Input
                        placeholder="For"
                        value={editFor}
                        onChange={(e) => setEditFor(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <textarea
                      value={editRequest}
                      onChange={(e) => setEditRequest(e.target.value)}
                      className="w-full h-20 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {/* Status Icon - Admin can toggle */}
                    {isAdmin ? (
                      <button
                        onClick={() =>
                          handleToggleAnswered(request._id, request.isAnswered)
                        }
                        className="mt-1 transition-colors"
                      >
                        {request.isAnswered ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500 hover:text-teal-400" />
                        )}
                      </button>
                    ) : (
                      <div className="mt-1">
                        {request.isAnswered ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        {request.prayerRequestFrom && (
                          <span className="text-sm text-gray-400">
                            🙏 {request.prayerRequestFrom}
                          </span>
                        )}
                        {request.prayerFor && (
                          <span className="text-sm text-teal-400 font-medium">
                            For: {request.prayerFor}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-white ${request.isAnswered ? "line-through opacity-60" : ""}`}
                      >
                        {request.prayerRequest}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Created{" "}
                          {format(
                            new Date(request._creationTime),
                            "MMM d, yyyy",
                          )}
                        </span>
                        {request.isAnswered && request.answeredAt && (
                          <span className="text-green-400">
                            ✅ Answered{" "}
                            {format(
                              new Date(request.answeredAt),
                              "MMM d, yyyy",
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions - Admin Only */}
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(request)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(request._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {requests?.length === 0 && (
            <Card className="bg-white/10 border-white/10 backdrop-blur-xl">
              <CardContent className="p-8 text-center text-gray-500">
                No prayer requests found.{isAdmin && " Create one above!"}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
