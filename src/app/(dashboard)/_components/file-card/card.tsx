"use client";

import { IFile } from "@/lib/database/schema/file.model";
import { cn, dynamicDownload, formatFileSize } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FileMenu from "./menu";
import { P } from "@/components/custom/p";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { generateUrl } from "@/action/file.action";
import { CategoryBadge } from "@/components/brand/category-badge";

const FileCard = ({ file }: { file: IFile }) => {
  const [isLinkInProgress, setIsLinkInProgress] = useState(false);

  const { name, size, createdAt, userInfo, category } = file;
  const formattedFileSize = formatFileSize(size);

  return (
    <Card className="flex w-full flex-col justify-between rounded-card border-[1.5px] border-ink bg-paper transition-colors hover:bg-stone/35">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <CategoryBadge category={category} size="lg" />

          <div className="flex flex-col items-end gap-3">
            <FileMenu
              file={file}
              isLinkInProgress={isLinkInProgress}
              setIsLinkInProgress={setIsLinkInProgress}
            />

            <span className="rounded-pill border border-ink bg-fog px-3 py-1 text-xs font-semibold tracking-[-0.018em] text-ink">
              {formattedFileSize}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <P
          size="large"
          weight="bold"
          title={name}
          className={cn(
            "truncate text-ink",
            category === "image" && "cursor-pointer hover:text-signal"
          )}
          onClick={async () => {
            if (category === "image") {
              setIsLinkInProgress(true);
              const { data, status } = await generateUrl(file.cid);

              if (status !== 201) {
                toast("Error", {
                  description: `${data}`,
                });
                setIsLinkInProgress(false);
                return;
              }

              setIsLinkInProgress(false);
              dynamicDownload(data as string, file.name);
            }
          }}
        >
          {name}
        </P>

        <div className="flex flex-col gap-0.5 border-t border-fog pt-2.5">
          <P size="small" variant="muted">
            {format(createdAt, "dd MMM yyyy")}
          </P>
          <P size="small" variant="muted" className="truncate">
            Pinned by <span className="font-semibold text-ink">{userInfo.name}</span>
          </P>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
