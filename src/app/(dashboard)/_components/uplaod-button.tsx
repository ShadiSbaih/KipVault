"use client";

import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IFile } from "@/lib/database/schema/file.model";
import { parseError } from "@/lib/utils";

type PinataUploadResponse = {
  id: string;
  name: string;
  cid: string;
  size: number;
  mime_type: string;
};

const UploadButton = () => {
  const queryClient = useQueryClient();
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file: File) {
    const urlRes = await axios.post<{ url: string }>("/api/v1/files/upload-url", {
      name: file.name,
      size: file.size,
    });

    const signedUrl = urlRes.data?.url;
    if (!signedUrl) {
      throw new Error("Could not obtain upload URL");
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    const pinataRes = await axios.post<{ data: PinataUploadResponse }>(
      signedUrl,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size || 1;
          const loaded = progressEvent.loaded;
          const percent = Math.min(100, Math.round((loaded / total) * 100));

          setFileProgress((prev) => ({
            ...prev,
            [file.name]: percent,
          }));
        },
      }
    );

    const uploadData = pinataRes.data?.data;
    if (!uploadData?.id || !uploadData?.cid) {
      throw new Error("Invalid response from storage provider");
    }

    const completeRes = await axios.post("/api/v1/files/upload/complete", {
      pinataId: uploadData.id,
      name: uploadData.name || file.name,
      mimeType: uploadData.mime_type || file.type || "application/octet-stream",
      cid: uploadData.cid,
      size: uploadData.size ?? file.size,
    });

    return completeRes.data;
  }

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (newData) => {
      if (newData?.category && newData?.file) {
        queryClient.setQueryData(
          ["files", newData.category],
          (oldData: { files: IFile[] } | undefined) => {
            const uploadedFile = newData.file;
            const oldFiles = oldData?.files || [];

            return {
              ...oldData,
              files: [uploadedFile, ...oldFiles],
            };
          }
        );
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      }

      toast(newData?.message, {
        description: newData?.description,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data as
          | { message?: string; description?: string; error?: string }
          | undefined;
        const title = data?.message || "Upload failed";
        const description =
          data?.description ||
          data?.error ||
          (error.response?.status === 413
            ? "File exceeds the maximum single-request upload size."
            : error.message);

        toast(title, { description });
        return;
      }

      toast("Upload failed", {
        description: parseError(error),
      });
    },
  });

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const files = Array.from(input.files || []);

    if (!files.length) {
      toast("No file selected", {
        description: "Please select a file to upload",
      });
      return;
    }

    const progressMap: Record<string, number> = {};
    files.forEach((file) => {
      progressMap[file.name] = 0;
    });

    setFileProgress(progressMap);
    setIsUploading(true);

    try {
      await Promise.allSettled(files.map((file) => mutation.mutateAsync(file)));
    } finally {
      setIsUploading(false);
      input.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      {isUploading &&
        Object.entries(fileProgress).map(([fileName, progress], i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative flex size-10 cursor-default items-center justify-center rounded-full border border-ink bg-butter">
                  <svg
                    className="absolute h-full w-full -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      className="text-paper"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="transparent"
                      r="15"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="text-ink"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="transparent"
                      r="15"
                      cx="18"
                      cy="18"
                      strokeDasharray="94.2"
                      strokeDashoffset={94.2 - (94.2 * progress) / 100}
                    />
                  </svg>
                  <span className="text-[10px] font-bold text-ink">
                    {progress}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-xs font-bold">{fileName}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

      <Button
        onClick={() => {
          document.getElementById("file-upload")?.click();
        }}
      >
        <CloudUpload className="size-4" strokeWidth={2.1} />
        Upload
      </Button>

      <input
        type="file"
        className="hidden"
        id="file-upload"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadButton;
