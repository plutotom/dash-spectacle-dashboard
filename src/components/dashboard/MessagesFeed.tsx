"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MessagesFeed() {
  const { isAuthenticated } = useConvexAuth();
  const messages = useQuery(api.messages.list, { limit: 20 });
  const profile = useQuery(api.profile.getProfile);
  const createMessage = useMutation(api.messages.create);

  const [isIdle, setIsIdle] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Idle detection
  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;

    const handleActivity = () => {
      resetIdleTimer();
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => setIsIdle(true), 10000); // 10 seconds
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Start the idle timer
    idleTimeout = setTimeout(() => setIsIdle(true), 10000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearTimeout(idleTimeout);
    };
  }, [resetIdleTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;

    setSubmitting(true);
    try {
      await createMessage({
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to send message:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex flex-col h-full">
      <h3 className="text-lg font-medium text-white mb-3">Messages</h3>

      {/* Messages List */}
      <div
        className="flex-1 overflow-y-auto space-y-3 max-h-[30vh]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {messages?.map((message) => (
          <div
            key={message._id}
            className="bg-white/5 rounded-lg p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">{message.name}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(message._creationTime), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-white text-sm">{message.content}</p>
          </div>
        ))}

        {messages?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No messages yet
          </p>
        )}
      </div>

      {/* Message Composer - only shown for authenticated users, fades when idle */}
      {isAuthenticated ? (
        <div
          className={`mt-4 transition-opacity duration-300 ${
            isIdle ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Show posting as name */}
            <p className="text-xs text-gray-400">
              Posting as{" "}
              <span className="text-purple-400">
                {profile?.name || profile?.email || "..."}
              </span>
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                disabled={submitting || !newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div
          className={`mt-4 transition-opacity duration-300 ${
            isIdle ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <p className="text-sm text-gray-400 text-center py-2">
            <a href="/signin" className="text-purple-400 hover:text-purple-300">
              Sign in
            </a>{" "}
            to post a message
          </p>
        </div>
      )}
    </div>
  );
}
