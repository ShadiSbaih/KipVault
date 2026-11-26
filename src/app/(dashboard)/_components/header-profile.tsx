"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiLogoutCircleFill } from "@remixicon/react";

const HeaderProfile = () => {
  const session = useSession();
  const router = useRouter();

  const { isPending, data } = session;

  return (
    <>
      {isPending && <Skeleton className="size-10 rounded-full" />}

      {!isPending && (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
            <Avatar className="size-10 border-[1.5px] border-ink bg-butter">
              <AvatarImage src={data?.user?.image as string} />
              <AvatarFallback className="bg-butter font-display text-base font-bold uppercase text-ink">
                {(data?.user?.name as string)?.slice(0, 1) || "K"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-2">
            <DropdownMenuLabel className="truncate font-display text-sm font-bold uppercase tracking-[-0.02em] text-ink">
              {data?.user?.name || "Vault Member"}
            </DropdownMenuLabel>
            {data?.user?.email && (
              <p className="truncate px-3 pb-1 text-xs text-mist">
                {data.user.email}
              </p>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-start gap-2.5 px-3 py-2.5 font-semibold text-ink"
              onClick={async () => {
                await signOut();
                router.push("/sign-in");
              }}
            >
              <RiLogoutCircleFill className="size-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default HeaderProfile;
