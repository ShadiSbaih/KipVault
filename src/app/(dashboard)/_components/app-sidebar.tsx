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
  FileText,
  Film,
  HardDrive,
  Image as ImageIcon,
  Layers,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SearchBar } from "./search-bar";
import { KipVaultLogo } from "@/components/brand/logo";

const items = [
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Images",
    url: "/dashboard/images",
    icon: ImageIcon,
  },
  {
    title: "Videos",
    url: "/dashboard/videos",
    icon: Film,
  },
  {
    title: "Others",
    url: "/dashboard/others",
    icon: Layers,
  },
  {
    title: "Shared with me",
    url: "/dashboard/shared",
    icon: Users,
  },
  {
    title: "Storage",
    url: "/dashboard/storage",
    icon: HardDrive,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-fog bg-paper text-ink"
    >
      <SidebarContent className="bg-paper px-2 group-data-[collapsible=icon]:px-0">
        <SidebarHeader className="px-2 pt-4 pb-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pb-4">
          <SidebarMenu className="space-y-4 group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center px-0" : "px-2"
              )}
            >
              <Link
                href="/dashboard"
                className="flex w-fit items-center justify-center"
              >
                <KipVaultLogo
                  size="sm"
                  variant={isCollapsed ? "mark" : "default"}
                  showWordmark={!isCollapsed}
                />
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem
              className={cn(isCollapsed && "flex justify-center")}
            >
              <SearchBar />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarGroup className="px-2 py-2 group-data-[collapsible=icon]:border-t group-data-[collapsible=icon]:border-fog group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pt-4">
          <SidebarGroupLabel className="px-3 font-display text-xs font-bold uppercase tracking-[-0.02em] text-mist">
            Vault Rooms
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:space-y-0">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(isCollapsed && "flex justify-center")}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "h-11 rounded-pill px-4 text-sm font-semibold tracking-[-0.018em] text-ink transition-colors",
                        "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0",
                        isActive
                          ? "border-[1.5px] border-ink bg-butter text-ink hover:bg-butter hover:text-ink"
                          : "border-[1.5px] border-transparent hover:bg-fog hover:text-ink"
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon
                          className="size-[18px] shrink-0"
                          strokeWidth={2}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
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
