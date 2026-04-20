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
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-0 border border-white/5 flex flex-col h-[320px] relative overflow-hidden group/feed">
      <h3 className="absolute top-4 left-4 z-10 text-sm font-medium text-white/70 uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs pointer-events-none">
        Messages
      </h3>

      {/* Messages List - Full height, scrollable */}
      <div
        className="w-full h-full overflow-y-auto space-y-2 p-4 pt-12"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        {messages?.map((message) => (
          <div key={message._id} className="group">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-base font-medium text-white/90">
                {message.name}
              </span>
              <span className="text-xs text-white/30 ml-2">
                {formatDistanceToNow(new Date(message._creationTime), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-white/70 text-base leading-relaxed font-light">
              {message.content}
            </p>
          </div>
        ))}

        {messages?.length === 0 && (
          <p className="text-white/30 text-sm text-center py-10 italic">
            No messages yet
          </p>
        )}

        {/* Spacer at bottom for when input is visible */}
        <div className="h-10"></div>
      </div>

      {/* Message Composer - Floating at bottom */}
      {isAuthenticated ? (
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/80 to-transparent border-t border-white/5 transition-all duration-500 transform ${
            isIdle
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
        >
          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:bg-black/60 focus:border-white/20 transition-colors pr-16 h-9 text-sm backdrop-blur-md shadow-xl"
            />
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !newMessage.trim()}
              className="absolute right-1 top-0.5 h-8 bg-teal-600/80 hover:bg-teal-600 text-white border-none scale-90"
            >
              Send
            </Button>
          </form>
        </div>
      ) : (
        <div
          className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent border-t border-white/5 transition-all duration-500 ${
            isIdle
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
        >
          <p className="text-[10px] text-white/50 text-center backdrop-blur-md py-1">
            <a
              href="/signin"
              className="text-white/80 hover:text-white underline decoration-white/30 underline-offset-2"
            >
              Sign in
            </a>{" "}
            to join
          </p>
        </div>
      )}
    </div>
  );
}
