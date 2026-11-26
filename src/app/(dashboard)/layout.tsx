import { Children } from "@/props/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import DashboardHeader from "./_components/header";

const Layout = ({ children }: Children) => {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen w-full flex-col bg-paper px-4 pb-6 sm:px-6">
          <DashboardHeader />
          <div className="w-full flex-1 rounded-band bg-fog p-6 sm:p-8">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default Layout;
