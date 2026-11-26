"use client";

import FileCard from "@/app/(dashboard)/_components/file-card/card";
import { P } from "@/components/custom/p";
import { Button } from "@/components/ui/button";
import { IFile } from "@/lib/database/schema/file.model";
import { getFiles } from "@/lib/fetch/files.fetch";
import { CloudUpload, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

interface PageFilesProps {
  page: string;
}

const PageFiles = ({ page }: PageFilesProps) => {
  const { ref, inView } = useInView();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageFull, setIsPageFull] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["files", page],
    queryFn: async () => await getFiles({ page, currentPage }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: getFiles,
    onSuccess: (newData) => {
      if (currentPage === newData.totalPages) {
        setIsPageFull(true);
      }

      queryClient.setQueryData(["files", page], (oldData: unknown) => {
        const oldFiles = (oldData as { files: IFile[] })?.files || [];
        const newFiles = (newData.files as IFile[]) || [];

        const mergedFiles = [
          ...oldFiles,
          ...newFiles.filter(
            (newFile) =>
              !oldFiles.some((oldFile) => oldFile._id === newFile._id)
          ),
        ];

        return {
          files: mergedFiles,
          total: newData.totalFiles,
          currentPage: newData.currentPage,
          totalPages: newData.totalPages,
        };
      });
    },
    onError(e) {
      toast(e.name, {
        description: e.message,
      });
    },
  });

  useEffect(() => {
    if (currentPage === data?.totalPages) {
      setIsPageFull(true);
      return;
    }
    if (inView && !isPageFull) {
      setCurrentPage((prev) => {
        const nextPage = prev + 1;
        mutation.mutateAsync({ page, currentPage: nextPage });
        return nextPage;
      });
    }
  }, [inView, data]);

  if (isLoading) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-band border-[1.5px] border-ink bg-paper p-8">
        <Loader2 className="size-8 animate-spin text-ink" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-band border-[1.5px] border-ink bg-paper p-8 text-center">
        <P size="large" weight="bold">
          Error: {error.message}
        </P>
      </div>
    );
  }

  const files = (data?.files as IFile[]) || [];

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-band border-[1.5px] border-ink bg-paper px-6 py-12 text-center">
        <Image
          src="/not-found.png"
          width={220}
          height={220}
          alt="Empty vault room"
          className="mb-4 h-44 w-44 object-contain"
        />
        <h2 className="font-display text-[32px] font-bold uppercase leading-none tracking-[-0.02em] text-ink">
          NOTHING IN THIS ROOM YET
        </h2>
        <P variant="muted" className="mt-3 max-w-md text-center">
          {page === "shared"
            ? "Files shared with your email will appear here automatically."
            : "Upload your first file to pin it securely to IPFS inside KipVault."}
        </P>
        {page !== "shared" && (
          <Button
            className="mt-6"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <CloudUpload className="size-4" strokeWidth={2.1} />
            Upload to Vault
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {files.map((file) => (
          <FileCard file={file} key={file._id} />
        ))}
      </div>

      {!isLoading && !isPageFull && (
        <div
          ref={ref}
          className="flex h-fit w-full items-center justify-center py-6"
        >
          {inView && <Loader2 className="size-6 animate-spin text-ink" />}
        </div>
      )}
    </>
  );
};

export default PageFiles;
