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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  X,
  Check,
  Plus,
  ArrowLeft,
  User,
  Shield,
} from "lucide-react";

export default function MessagesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const messages = useQuery(api.messages.list, { limit: 100 });
  const profile = useQuery(api.profile.getProfile);
  const isAdmin = useQuery(api.profile.isAdmin);
  const createMessage = useMutation(api.messages.create);
  const updateMessage = useMutation(api.messages.update);
  const deleteMessage = useMutation(api.messages.remove);

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  // Check if current user owns a message
  const isMessageOwner = (messageUserId: Id<"users">) => {
    return profile?._id === messageUserId;
  };

  // Can edit/delete if admin or owner
  const canModifyMessage = (messageUserId: Id<"users">) => {
    return isAdmin || isMessageOwner(messageUserId);
  };

  const handleEdit = (message: {
    _id: Id<"messages">;
    name: string;
    content: string;
  }) => {
    setEditingId(message._id);
    setEditName(message.name);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await updateMessage({
      id: editingId,
      name: editName,
      content: editContent,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditContent("");
  };

  const handleDelete = async (id: Id<"messages">) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteMessage({ id });
    }
  };

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    await createMessage({
      content: newContent.trim(),
    });
    setNewContent("");
    setShowNewForm(false);
  };

  const handleShowNewForm = () => {
    setShowNewForm(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Current User Badge */}
            {profile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-gray-300">
                <User className="w-4 h-4" />
                {profile.name || profile.email}
              </div>
            )}
            <Button
              onClick={handleShowNewForm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Message
            </Button>
          </div>
        </div>

        {/* New Message Form */}
        {showNewForm && (
          <Card className="mb-6 bg-white/10 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">New Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                Posting as{" "}
                <span className="text-purple-400">
                  {profile?.name || profile?.email || "..."}
                </span>
              </p>
              <Input
                placeholder="Message content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
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

        {/* Messages Table */}
        <Card className="bg-white/10 border-white/10 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-400">
                <div className="col-span-2">Name</div>
                <div className="col-span-4">Content</div>
                <div className="col-span-2">User</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Message Rows */}
              {messages?.map((message) => (
                <div
                  key={message._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center"
                >
                  {editingId === message._id ? (
                    <>
                      <div className="col-span-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-white/5 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="bg-white/5 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div className="col-span-2 text-gray-500 text-sm truncate">
                        {message.userEmail}
                      </div>
                      <div className="col-span-2 text-gray-500 text-sm">
                        {format(new Date(message._creationTime), "MMM d, yyyy")}
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2 text-white text-sm">
                        {message.name}
                      </div>
                      <div className="col-span-4 text-gray-300 text-sm truncate">
                        {message.content}
                      </div>
                      <div className="col-span-2 text-purple-400 text-xs truncate">
                        {message.userEmail}
                      </div>
                      <div className="col-span-2 text-gray-500 text-sm">
                        {format(new Date(message._creationTime), "MMM d, yyyy")}
                      </div>
                      <div className="col-span-2 flex gap-2">
                        {canModifyMessage(message.userId) ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(message)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(message._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {messages?.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No messages yet. Create one above!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
