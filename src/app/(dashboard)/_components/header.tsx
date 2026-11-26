"use client";

import SidebarTrigger from "@/components/custom/sidebar-trigger";
import DashboardBreadcrumb from "./breadcrumb";
import UploadButton from "./uplaod-button";
import HeaderProfile from "./header-profile";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-fog bg-paper py-4 mb-4">
      <div className="flex flex-1 items-center justify-start gap-3">
        <SidebarTrigger />
        <DashboardBreadcrumb />
      </div>

      <div className="flex items-center justify-end gap-3">
        <UploadButton />
        <HeaderProfile />
      </div>
    </header>
  );
};

export default DashboardHeader;
