import { generatePageKey } from "@/lib/utils";
import PageFiles from "./_components/page-files";
import SubscriptionPage from "./_components/page-subscription";

interface Props {
  params: Promise<{
    page:
      | "storage"
      | "documents"
      | "images"
      | "videos"
      | "others"
      | "shared";
  }>;
}

const roomDescriptions: Record<string, string> = {
  documents: "PDFs and formal records pinned to your private vault.",
  images: "Visual assets ready for instant preview and signed download.",
  videos: "High-capacity video files stored with IPFS permanence.",
  others: "Audio tracks, archives, and custom file formats.",
  shared: "Vault items teammates have shared directly with your email.",
  storage: "Monitor your active KipVault capacity and pinning allocation.",
};

const page = async ({ params }: Props) => {
  const pageName = (await params).page;
  const key = generatePageKey(pageName);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-silver pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-chip border border-ink bg-butter px-3 py-0.5 font-display text-xs font-bold uppercase tracking-[-0.02em] text-ink">
            KipVault Room
          </span>
          <h1 className="mt-2 font-display text-[44px] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-ink sm:text-[56px]">
            {pageName}
          </h1>
        </div>

        <p className="max-w-md text-sm leading-[1.5] tracking-[-0.018em] text-mist sm:text-right">
          {roomDescriptions[pageName] || "Browse your KipVault room."}
        </p>
      </div>

      {pageName === "storage" ? <SubscriptionPage /> : <PageFiles page={key} />}
    </div>
  );
};

export default page;
