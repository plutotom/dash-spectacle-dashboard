"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, CheckCircle, AlertCircle, X, File } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  id: string;
}

interface MultiImageUploadProps {
  maxFiles?: number;
  currentCount?: number;
  onUploadComplete?: () => void;
}

export function MultiImageUpload({
  maxFiles = 5,
  currentCount = 0,
  onUploadComplete,
}: MultiImageUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveImage = useMutation(api.images.saveImage);

  const remainingSlots = maxFiles - currentCount;

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const fileArray = Array.from(selectedFiles);

      // Filter to only image files
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/"),
      );

      // Check how many we can add
      const pendingCount = files.filter((f) => f.status === "pending").length;
      const availableSlots = remainingSlots - pendingCount;

      if (availableSlots <= 0) {
        return;
      }

      const filesToAdd = imageFiles.slice(0, availableSlots);

      const newFiles: FileWithProgress[] = filesToAdd.map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
        id: Math.random().toString(36).substr(2, 9),
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files, remainingSlots],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFile = async (fileWithProgress: FileWithProgress) => {
    const { file, id } = fileWithProgress;

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "uploading" as const, progress: 10 } : f,
      ),
    );

    try {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 30 } : f)),
      );

      // Upload to Vercel Blob
      let blobUrl = "";
      const blobSize = file.size;

      try {
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        blobUrl = newBlob.url;
      } catch (error) {
        const msg = (error as Error).message;
        if (msg.includes("already exists")) {
          // Auto-overwrite for batch uploads
          const newBlob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload?overwrite=true",
          });
          blobUrl = newBlob.url;
        } else {
          throw error;
        }
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 70 } : f)),
      );

      // Save to Convex
      await saveImage({
        url: blobUrl,
        name: file.name,
        size: blobSize,
      });

      // Update status to success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "success" as const, progress: 100 } : f,
        ),
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f,
        ),
      );
    }
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Upload files sequentially
    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    setIsUploading(false);
    onUploadComplete?.();
  };

  const clearAll = () => {
    setFiles([]);
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "success"));
  };

  const getStatusIcon = (status: FileWithProgress["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case "uploading":
        return (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
        );
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const hasCompletedFiles = files.some((f) => f.status === "success");
  const canAddMore =
    remainingSlots - files.filter((f) => f.status === "pending").length > 0;

  return (
    <Card className="bg-white/10 border-white/10 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-white flex items-center justify-between">
          <span>Upload Images</span>
          <span className="text-sm font-normal text-gray-400">
            {currentCount} / {maxFiles} used
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-purple-400 bg-purple-500/10"
              : canAddMore
                ? "border-white/20 hover:border-purple-400/50 hover:bg-white/5"
                : "border-white/10 opacity-50 cursor-not-allowed"
          }`}
          onDrop={canAddMore ? handleDrop : undefined}
          onDragOver={canAddMore ? handleDragOver : undefined}
          onDragLeave={handleDragLeave}
          onClick={() => canAddMore && fileInputRef.current?.click()}
        >
          <Upload
            className={`mx-auto mb-3 h-10 w-10 ${
              isDragging ? "text-purple-400" : "text-gray-400"
            }`}
          />
          <p className="mb-1 font-medium text-white">
            {canAddMore
              ? "Drop images here or click to browse"
              : "Upload limit reached"}
          </p>
          <p className="text-sm text-gray-400">
            {canAddMore
              ? `You can add ${remainingSlots - pendingCount} more image(s)`
              : "Delete some images to upload more"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={!canAddMore}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">
                Selected Files ({files.length})
              </p>
              <div className="flex gap-2">
                {hasCompletedFiles && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompleted}
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-7 text-xs"
                  >
                    Clear Completed
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  {getStatusIcon(f.status)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {f.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        {formatFileSize(f.file.size)}
                      </p>
                      {f.status === "uploading" && (
                        <div className="flex-1">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full bg-purple-500 transition-all duration-300"
                              style={{ width: `${f.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {f.error && (
                        <p className="text-xs text-red-400">{f.error}</p>
                      )}
                    </div>
                  </div>
                  {f.status !== "uploading" && (
                    <button
                      onClick={() => removeFile(f.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={isUploading}
                className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || pendingCount === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isUploading
                  ? "Uploading..."
                  : `Upload ${pendingCount} image(s)`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
