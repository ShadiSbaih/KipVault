"use client";

import { P } from "@/components/custom/p";
import {
  RiHardDrive2Fill,
  RiLoader3Fill,
  RiShieldCheckFill,
  RiUploadCloud2Fill,
} from "@remixicon/react";
import { formatFileSize } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ISubscription } from "@/lib/database/schema/subscription.model";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  isLoading: boolean;
  subs: ISubscription;
}

const StorageCard = ({ isLoading, subs }: Props) => {
  const usedBytes = subs?.usedStorage ?? 0;
  const totalBytes = subs?.selectedStorage ?? 0;
  const usedStorage = formatFileSize(usedBytes);
  const selectedStorage = formatFileSize(totalBytes);
  const percentageUsedStorage =
    totalBytes > 0 ? Math.min(100, (usedBytes / totalBytes) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Band 1: Butter Highlight (#fbda5f) Storage Meter */}
      <section className="rounded-band border-[1.5px] border-ink bg-butter p-6 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-chip border-[1.5px] border-ink bg-paper text-ink">
                {!isLoading ? (
                  <RiHardDrive2Fill className="size-6" />
                ) : (
                  <RiLoader3Fill className="size-6 animate-spin" />
                )}
              </div>
              <div>
                <span className="inline-block rounded-pill border border-ink bg-paper px-3 py-0.5 text-xs font-semibold text-ink">
                  ACTIVE VAULT QUOTA
                </span>
                <h2 className="mt-1 font-display text-[32px] font-bold uppercase leading-none tracking-[-0.02em] text-ink sm:text-[40px]">
                  VAULT CAPACITY
                </h2>
              </div>
            </div>

            {!isLoading ? (
              <span className="rounded-pill border-[1.5px] border-ink bg-ink px-4 py-1.5 font-display text-lg font-bold uppercase text-butter">
                {percentageUsedStorage.toFixed(1)}% USED
              </span>
            ) : (
              <Skeleton className="h-9 w-28 rounded-pill bg-paper/70" />
            )}
          </div>

          {!isLoading ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <P size="large" weight="bold" className="text-ink">
                  {usedStorage} used of {selectedStorage}
                </P>
                <P size="small" className="font-medium text-ink">
                  Remaining:{" "}
                  {formatFileSize(Math.max(0, totalBytes - usedBytes))}
                </P>
              </div>
              <Progress
                value={percentageUsedStorage}
                className="h-4 bg-paper"
                indicatorClassName="bg-ink"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-6 w-56 rounded-chip bg-paper/70" />
              <Skeleton className="h-4 w-full rounded-pill bg-paper/70" />
            </div>
          )}
        </div>
      </section>

      {/* Band 2: Paper (#ffffff) Vault Specs */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-card border-[1.5px] border-ink bg-paper p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-chip bg-fog text-ink">
            <RiShieldCheckFill className="size-5" />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-ink">
            PINATA IPFS PINNING
          </h3>
          <P variant="muted" className="mt-2">
            Every uploaded file receives an immutable Content ID (CID) and
            retrieves via signed, authenticated gateway URLs.
          </P>
        </div>

        <div className="rounded-card border-[1.5px] border-ink bg-paper p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-chip bg-fog text-ink">
            <RiUploadCloud2Fill className="size-5" />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-ink">
            LIVE QUOTA ACCOUNTING
          </h3>
          <P variant="muted" className="mt-2">
            Deleting files from any room immediately reclaims bytes in your
            KipVault storage allocation.
          </P>
        </div>
      </section>

      {/* Band 3: Pure Black (#000000) Inverted Band */}
      <section className="rounded-band bg-pure-black px-6 py-10 text-center sm:px-10">
        <h3 className="font-display text-[32px] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-butter sm:text-[40px]">
          BUILT FOR PERMANENT KEEPSAKES
        </h3>
        <P className="mx-auto mt-3 max-w-xl text-paper">
          Keep your most important documents, images, and videos pinned in one
          editorial-grade vault with zero clutter.
        </P>
      </section>
    </div>
  );
};

export { StorageCard };
