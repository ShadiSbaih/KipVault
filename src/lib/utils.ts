import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseError(error: unknown) {
  if (error instanceof Error) return error.message;

  if (error instanceof Response) return error.statusText;

  if (error instanceof ErrorEvent) return error.message;

  if (error instanceof AxiosError) return error.response?.data?.message || error.message;

  if (typeof error === "string") return error;
  

  return JSON.stringify(error);
}

export function formatFileSize(sizeInBytes: number): string {
  if (!sizeInBytes || sizeInBytes <= 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const k = 1024; // 1 KB = 1024 Bytes
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(sizeInBytes) / Math.log(k))
  );

  const size = (sizeInBytes / Math.pow(k, i)).toFixed(2); // Convert size to the appropriate unit
  return `${size} ${units[i]}`; // Combine size with unit
}

type FileCategory = "document" | "video" | "image" | "other";

const DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/rtf",
  "text/plain",
  "text/csv",
  "text/markdown",
]);

export function getCategoryFromMimeType(mimeType: string): FileCategory {
  const normalized = mimeType.toLowerCase().split(";")[0].trim();

  if (DOCUMENT_MIME_TYPES.has(normalized)) return "document";

  if (normalized.startsWith("video/")) return "video";

  if (normalized.startsWith("image/")) return "image";

  return "other";
}

export function generatePageKey(page: string): string {
  if (page === "documents") return "document";

  if (page === "images") return "image";

  if (page === "videos") return "video";

  if (page === "others") return "other";

  return page;
}

export function dynamicDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function ActionResponse<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}