import { KipVaultLogo } from "@/components/brand/logo";
import { Children } from "@/props/types";

const Layout = ({ children }: Children) => {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-paper text-ink md:grid-cols-2">
      {/* Left Pure Black Poster Panel */}
      <div className="hidden flex-col justify-between bg-pure-black p-10 text-paper md:flex lg:p-14">
        <div className="w-fit">
          <KipVaultLogo variant="inverted" size="lg" />
        </div>

        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-chip border border-butter bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-[-0.018em] text-butter">
            <span className="size-2 rounded-full bg-butter" />
            IPFS-Backed Storage
          </span>

          <h1 className="font-display text-[56px] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-butter lg:text-[72px]">
            LOCK IT.
            <br />
            PIN IT.
            <br />
            KEEP IT.
          </h1>

          <p className="max-w-md text-lg leading-[1.5] tracking-[-0.02em] text-paper">
            The only vault you ever need for secure, decentralized file storage
            and granular team sharing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-pill bg-charcoal px-4 py-1.5 text-xs font-medium text-silver">
            Auto-categorized rooms
          </span>
          <span className="rounded-pill bg-charcoal px-4 py-1.5 text-xs font-medium text-silver">
            Signed Pinata URLs
          </span>
          <span className="rounded-pill bg-charcoal px-4 py-1.5 text-xs font-medium text-silver">
            Role-scoped sharing
          </span>
        </div>
      </div>

      {/* Right Paper Canvas */}
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
