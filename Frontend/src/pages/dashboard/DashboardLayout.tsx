import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/commons/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <SidebarProvider className="grid lg:grid-cols-[auto_1fr]">
        <AppSidebar />

        <main className="w-full">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
