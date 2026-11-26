"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  RiFilePdf2Fill,
  RiHardDrive2Fill,
  RiImageFill,
  RiPieChart2Fill,
  RiUserShared2Fill,
  RiVideoFill,
} from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SearchBar } from "./search-bar";
import { KipVaultLogo } from "@/components/brand/logo";

const items = [
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: RiFilePdf2Fill,
  },
  {
    title: "Images",
    url: "/dashboard/images",
    icon: RiImageFill,
  },
  {
    title: "Videos",
    url: "/dashboard/videos",
    icon: RiVideoFill,
  },
  {
    title: "Others",
    url: "/dashboard/others",
    icon: RiPieChart2Fill,
  },
  {
    title: "Shared with me",
    url: "/dashboard/shared",
    icon: RiUserShared2Fill,
  },
  {
    title: "Storage",
    url: "/dashboard/storage",
    icon: RiHardDrive2Fill,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-fog bg-paper text-ink"
    >
      <SidebarContent className="bg-paper px-1">
        <SidebarHeader className="pt-4">
          <SidebarMenu className="space-y-4">
            <SidebarMenuItem className="flex items-center px-2">
              <Link href="/dashboard" className="w-fit">
                <KipVaultLogo
                  size="sm"
                  variant={state === "collapsed" ? "mark" : "default"}
                  showWordmark={state !== "collapsed"}
                />
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SearchBar />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-display text-xs font-bold uppercase tracking-[-0.02em] text-mist">
            Vault Rooms
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "h-11 rounded-pill px-4 text-sm font-semibold tracking-[-0.018em] text-ink transition-colors",
                        isActive
                          ? "border-[1.5px] border-ink bg-butter text-ink hover:bg-butter hover:text-ink"
                          : "border-[1.5px] border-transparent hover:bg-fog hover:text-ink"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
