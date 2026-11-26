"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const SidebarTrigger = () => {
  const { toggleSidebar, state } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      variant="outline"
      size="icon"
      className={cn("size-10 shrink-0 rounded-pill border-[1.5px] border-ink bg-paper hover:bg-butter")}
      onClick={() => {
        toggleSidebar();
      }}
    >
      {state === "expanded" ? (
        <PanelLeftClose className="size-[18px] text-ink" strokeWidth={2} />
      ) : (
        <PanelLeftOpen className="size-[18px] text-ink" strokeWidth={2} />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarTrigger;
