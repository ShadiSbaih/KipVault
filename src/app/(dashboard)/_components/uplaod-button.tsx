"use client";

import { Button } from "@/components/ui/button";
import { RiFileAddFill } from "@remixicon/react";
import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IFile } from "@/lib/database/schema/file.model";

const UploadButton = () => {
  const queryClient = useQueryClient();
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/v1/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total || 1;
        const loaded = progressEvent.loaded;
        const percent = Math.round((loaded / total) * 100);

        setFileProgress((prev) => ({
          ...prev,
          [file.name]: percent,
        }));
      },
    });

    return res.data;
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
    onError: (c) => {
      toast(c.name, {
        description: c.message,
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

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

    await Promise.all(files.map((file) => mutation.mutateAsync(file)));
    e.target.value = "";
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
        <RiFileAddFill />
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
