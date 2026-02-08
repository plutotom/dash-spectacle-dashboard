"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import ButtonNavigation from "../section/ButtonNavigation";
import { MultiImageUpload } from "@/components/MultiImageUpload";

export default function GalleryPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);
  const profile = useQuery(api.profile.getProfile);
  const images = useQuery(api.images.getImages, {});
  // Only query all images if user is admin
  const isAdmin = profile?.role === "admin";
  const allImages = useQuery(api.images.getAllImages, isAdmin ? {} : "skip");

  const deleteImage = useMutation(api.images.deleteImage);
  const deleteImages = useMutation(api.images.deleteImages);

  const [activeTab, setActiveTab] = useState<"gallery" | "admin">("gallery");

  // Multi-select state for admin view
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive counts from profile
  const count = profile?.imageCount || 0;
  const max = profile?.maxUploads || 5;

  // Handle image click with modifier keys
  const handleImageClick = (
    imageId: string,
    index: number,
    event: React.MouseEvent,
  ) => {
    const isMeta = event.metaKey || event.ctrlKey;
    const isShift = event.shiftKey;

    setSelectedIds((prev) => {
      const newSet = new Set(prev);

      if (isShift && lastClickedIndex !== null && allImages) {
        // Shift+click: select range
        const start = Math.min(lastClickedIndex, index);
        const end = Math.max(lastClickedIndex, index);
        for (let i = start; i <= end; i++) {
          newSet.add(allImages[i]._id);
        }
      } else if (isMeta) {
        // Cmd/Ctrl+click: toggle single item
        if (newSet.has(imageId)) {
          newSet.delete(imageId);
        } else {
          newSet.add(imageId);
        }
      } else {
        // Regular click: select only this item
        newSet.clear();
        newSet.add(imageId);
      }

      return newSet;
    });

    setLastClickedIndex(index);
  };

  const handleSelectAll = () => {
    if (!allImages) return;
    if (selectedIds.size === allImages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allImages.map((img) => img._id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (
      !confirm(
        `Delete ${selectedIds.size} selected image(s)? This cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteImages({
        imageIds: Array.from(selectedIds) as Parameters<
          typeof deleteImages
        >[0]["imageIds"],
      });
      setSelectedIds(new Set());
      setLastClickedIndex(null);
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const MyGalleryContent = () => (
    <div className="space-y-8">
      {/* Upload Section */}
      <MultiImageUpload maxFiles={max} currentCount={count} />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images?.map((img) => (
          <div
            key={img._id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (confirm("Delete this image?")) {
                    deleteImage({ imageId: img._id });
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm truncate">{img.name}</p>
              <p className="text-gray-400 text-xs">
                {(img.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ))}
        {!images?.length && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No images uploaded yet.
          </div>
        )}
      </div>
    </div>
  );

  const AdminContent = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">All User Images</h2>
          <span className="text-sm text-gray-400">
            Total: {allImages?.length || 0}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <span className="text-sm text-purple-300">
              {selectedIds.size} selected
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
          >
            {selectedIds.size === allImages?.length
              ? "Deselect All"
              : "Select All"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Selected
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Cmd/Ctrl+Click to toggle selection, Shift+Click to select range
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {allImages?.map((img, index) => {
          const isSelected = selectedIds.has(img._id);
          return (
            <div
              key={img._id}
              onClick={(e) => handleImageClick(img._id, index, e)}
              className={`group relative aspect-square rounded-xl overflow-hidden bg-black/40 border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-purple-500 ring-2 ring-purple-500/50"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {/* Selection indicator */}
              <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-purple-500 border-purple-500"
                    : "bg-black/40 border-white/40"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 right-10 flex justify-between items-start">
                <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm truncate max-w-[90%]">
                  {img.authorName || "Unknown"}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-transparent">
                <p className="text-white text-sm truncate">{img.name}</p>
                <p className="text-gray-400 text-xs truncate">
                  User: {img.authorEmail || "Unknown"}
                </p>
              </div>
            </div>
          );
        })}
        {!allImages?.length && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No images found.
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        Loading
      </div>
    );

  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Gallery</h1>
          <div className="flex gap-2">
            <ButtonNavigation />
          </div>

          {isAdmin ? (
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg backdrop-blur-sm">
              <Button
                variant={activeTab === "gallery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("gallery")}
                className={
                  activeTab === "gallery"
                    ? "bg-purple-600"
                    : "text-gray-300 hover:text-white"
                }
              >
                My Gallery
              </Button>
              <Button
                variant={activeTab === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("admin")}
                className={
                  activeTab === "admin"
                    ? "bg-purple-600"
                    : "text-gray-300 hover:text-white"
                }
              >
                Admin Management
              </Button>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-300">
                Usage: {count} / {max}
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min((count / max) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {activeTab === "gallery" && (
          <>
            {isAdmin && (
              <div className="flex justify-end mb-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-300">
                    Usage: {count} / {max}
                  </div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{
                        width: `${Math.min((count / max) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <MyGalleryContent />
          </>
        )}

        {activeTab === "admin" && isAdmin && <AdminContent />}
      </div>
    </div>
  );
}
