"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";

export function PrayerRequestsWidget() {
  const requests = useQuery(api.prayerRequests.listForDashboard);
  const settings = useQuery(api.settings.getPublic);

  // Don't render if prayer requests are hidden
  if (settings && !settings.showPrayerRequests) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex flex-col h-full">
      <h3 className="text-lg font-medium text-white mb-3">Prayer Requests</h3>

      <div
        className="flex-1 overflow-y-auto space-y-2 max-h-[60vh]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {requests?.map((request) => (
          <div
            key={request._id}
            className={`bg-white/5 rounded-lg p-3 border transition-all ${
              request.isAnswered
                ? "border-green-500/30 opacity-60"
                : "border-white/5"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{request.isAnswered ? "●" : "○"}</span>
              <div className="flex-1 min-w-0">
                {request.prayerRequestFrom && (
                  <div className="text-xs text-gray-400">
                    From: {request.prayerRequestFrom}
                  </div>
                )}
                {request.prayerFor && (
                  <div className="text-sm text-teal-400 font-medium">
                    For: {request.prayerFor}
                  </div>
                )}
                <p
                  className={`text-sm text-white mt-1 ${
                    request.isAnswered ? "line-through" : ""
                  }`}
                >
                  {request.prayerRequest}
                </p>
                {request.isAnswered && request.answeredAt && (
                  <div className="text-xs text-green-400 mt-1">
                    Answered{" "}
                    {formatDistanceToNow(new Date(request.answeredAt), {
                      addSuffix: true,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {requests?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No prayer requests
          </p>
        )}
      </div>
    </div>
  );
}
