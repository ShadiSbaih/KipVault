"use client";

import { useSidebar } from "@/components/ui/sidebar";
import {
  RiArrowRightSLine,
  RiFileDownloadFill,
  RiLoader3Fill,
  RiSearch2Fill,
} from "@remixicon/react";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchFiles } from "@/lib/fetch/files.fetch";
import { cn, dynamicDownload } from "@/lib/utils";
import { generateUrl } from "@/action/file.action";
import { P } from "@/components/custom/p";
import { Card, CardContent } from "@/components/ui/card";
import { IFile } from "@/lib/database/schema/file.model";
import { format } from "date-fns";
import { CategoryBadge } from "@/components/brand/category-badge";

const SearchBar = () => {
  const { state } = useSidebar();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  function handleDialogOpen() {
    setIsSearchDialogOpen(true);
  }

  return (
    <>
      {state === "expanded" && (
        <button
          type="button"
          onClick={handleDialogOpen}
          className="flex w-full items-center justify-between gap-2 rounded-accordion border-[1.5px] border-transparent bg-fog px-4 py-2.5 text-left text-sm font-medium tracking-[-0.018em] text-ink transition-colors hover:border-ink"
        >
          <span className="flex items-center gap-2.5">
            <RiSearch2Fill className="size-4 text-ink" />
            <span className="text-mist">Quick search...</span>
          </span>

          <span className="flex size-6 items-center justify-center rounded-[6px] bg-mist text-paper">
            <RiArrowRightSLine className="size-4" />
          </span>
        </button>
      )}

      {state === "collapsed" && (
        <Button
          variant="outline"
          size="icon"
          className="mx-auto size-10"
          onClick={handleDialogOpen}
          aria-label="Quick search"
        >
          <RiSearch2Fill className="size-4" />
        </Button>
      )}

      <SearchDialog
        isSearchDialogOpen={isSearchDialogOpen}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
      />
    </>
  );
};

const SearchDialog = ({
  isSearchDialogOpen,
  setIsSearchDialogOpen,
}: {
  isSearchDialogOpen: boolean;
  setIsSearchDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const mutation = useMutation({
    mutationFn: searchFiles,
    onError: (error) => {
      toast(error.name, {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsSearching(false);
    },
  });

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      mutation.mutate(trimmed);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>SEARCH VAULT</DialogTitle>
          <DialogDescription>
            Find any pinned document, image, or video by filename.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-pill border-[1.5px] border-ink bg-fog px-4 py-1">
            <RiSearch2Fill className="size-5 shrink-0 text-ink" />
            <Input
              className="input bg-transparent px-0 text-base placeholder:text-mist"
              placeholder="Type a file name..."
              value={searchTerm}
              onChange={handleChange}
            />
            {isSearching && (
              <RiLoader3Fill className="size-5 shrink-0 animate-spin text-ink" />
            )}
          </div>

          <div
            className={cn(
              "max-h-[340px] space-y-3 overflow-y-auto pr-1",
              mutation.data && mutation.data.length > 0 && "pt-1"
            )}
          >
            {searchTerm.trim() &&
              mutation.data &&
              mutation.data.length === 0 &&
              !isSearching && (
                <div className="rounded-card bg-fog p-6 text-center">
                  <P size="small" variant="muted">
                    No matching files found in your vault.
                  </P>
                </div>
              )}

            {searchTerm.trim() &&
              mutation.data &&
              mutation.data.length > 0 &&
              mutation.data.map((file: IFile) => (
                <SearchDisplayCard file={file} key={file._id} />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchDisplayCard = ({ file }: { file: IFile }) => {
  const [isLinkInProgress, setIsLinkInProgress] = useState(false);

  const {
    name,
    category,
    createdAt,
    userInfo: { name: userName },
  } = file;

  return (
    <Card className="rounded-card border-[1.5px] border-ink bg-paper shadow-none">
      <CardContent className="py-3.5 px-4">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <CategoryBadge category={category} size="sm" />

            <div className="min-w-0 flex-1">
              <P size="medium" weight="bold" className="truncate" title={name}>
                {name}
              </P>

              <P size="small" variant="muted" className="truncate">
                {format(createdAt, "dd MMM yyyy")} ·{" "}
                <span className="font-semibold text-ink">{userName}</span>
              </P>
            </div>
          </div>

          <Button
            variant="default"
            size="icon"
            aria-label={`Download ${name}`}
            onClick={async () => {
              setIsLinkInProgress(true);
              const { data, status } = await generateUrl(file.cid);

              if (status !== 201) {
                toast(`${data}`, {
                  description: data as string,
                });
                setIsLinkInProgress(false);
                return;
              }

              setIsLinkInProgress(false);
              dynamicDownload(data as string, file.name);
            }}
          >
            {!isLinkInProgress ? (
              <RiFileDownloadFill className="size-4" />
            ) : (
              <RiLoader3Fill className="size-4 animate-spin" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { SearchBar };
