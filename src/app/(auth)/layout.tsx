import Image from "next/image";
import { KipVaultLogo } from "@/components/brand/logo";
import { Children } from "@/props/types";

const Layout = ({ children }: Children) => {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-paper text-ink md:grid-cols-2">
      {/* Left Butter-Highlight Poster Panel */}
      <div className="hidden bg-paper p-5 md:flex lg:p-6">
        <div className="flex w-full flex-col justify-between rounded-band border-[1.5px] border-ink bg-butter p-8 lg:p-10">
          {/* Top Brand & Badge Row */}
          <div className="flex items-center justify-between gap-4">
            <KipVaultLogo size="md" />
            <span className="inline-flex items-center gap-2 rounded-chip border-[1.5px] border-ink bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-[-0.018em] text-ink">
              <span className="size-2 rounded-full bg-signal" />
              IPFS-Backed Vault
            </span>
          </div>

          {/* Center Illustration & Display Typography */}
          <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
            <div className="w-full overflow-hidden rounded-card border-[1.5px] border-ink bg-paper p-4 shadow-card-lg">
              <Image
                src="/auth-vault.png"
                width={960}
                height={717}
                alt="KipVault secure IPFS file vault illustration"
                priority
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-[44px] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-ink lg:text-[54px]">
                LOCK IT. PIN IT. KEEP IT.
              </h1>
              <p className="mx-auto max-w-md text-base font-medium leading-[1.5] tracking-[-0.018em] text-ink">
                Your private IPFS vault for documents, images, videos, and
                permissioned team sharing.
              </p>
            </div>
          </div>

          {/* Bottom Capability Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-pill border-[1.5px] border-ink bg-paper px-4 py-1.5 text-xs font-semibold text-ink">
              Auto-sorted rooms
            </span>
            <span className="rounded-pill border-[1.5px] border-ink bg-paper px-4 py-1.5 text-xs font-semibold text-ink">
              Signed Pinata URLs
            </span>
            <span className="rounded-pill border-[1.5px] border-ink bg-paper px-4 py-1.5 text-xs font-semibold text-ink">
              Role-scoped sharing
            </span>
          </div>
        </div>
      </div>

      {/* Right Paper Auth Form */}
      <div className="flex flex-col items-center justify-center bg-paper p-6 sm:p-10">
        <div className="mb-8 md:hidden">
          <KipVaultLogo size="lg" />
        </div>

        {children}
      </div>
    </main>
  );
};

export default Layout;
