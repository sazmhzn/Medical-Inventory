import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/commons/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  AudioWaveform,
  BarChart3,
  BookOpen,
  Bot,
  ClipboardList,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Package,
  PieChart,
  SquareTerminal,
  Truck,
} from "lucide-react";

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Determine if current path is under settings or reports
  const isSettingsPage = location.pathname.startsWith("/admin/settings");
  const isReportsPage = location.pathname.startsWith("/admin/reports");

  useEffect(() => {
    // Auto-collapse sidebar on reports page
    if (isReportsPage) {
      setIsSidebarOpen(false);
    }
  }, [isReportsPage]);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else if (!isReportsPage) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, [isReportsPage]);

  const dashboardData = {
    user: {
      name: "suron",
      email: "saz@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
        isActive: location.pathname === "/admin",
      },
      {
        title: "Inventory",
        url: "/admin/inventory",
        icon: Package,
        isActive: location.pathname.startsWith("/admin/inventory"),
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ClipboardList,
        isActive: location.pathname.startsWith("/admin/orders"),
      },
      {
        title: "Suppliers",
        url: "/admin/suppliers",
        icon: Truck,
        isActive: location.pathname.startsWith("/admin/suppliers"),
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: BarChart3,
        isActive: location.pathname.startsWith("/admin/reports"),
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  const settingsData = {
    user: {
      name: "suron",
      email: "saz@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Profile",
        url: "/admin/settings/preferences/orgprofile",
        icon: SquareTerminal,
        isActive:
          location.pathname === "/admin/settings/preferences/orgprofile",
      },
      {
        title: "Users & Roles",
        url: "/admin/settings/preferences/users",
        icon: SquareTerminal,
        isActive: location.pathname === "/admin/settings/preferences/users",
      },
      {
        title: "Supplier",
        url: "/admin/settings/preferences/suppliers",
        icon: Bot,
        isActive: location.pathname === "/admin/settings/preferences/suppliers",
      },
      {
        title: "Orders",
        url: "/admin/settings/preferences/orders",
        icon: BookOpen,
        isActive: location.pathname === "/admin/settings/preferences/orders",
      },
      {
        title: "Inventory",
        url: "/admin/settings/preferences/inventory",
        icon: Bot,
        isActive: location.pathname === "/admin/settings/preferences/inventory",
      },
    ],
  };

  const data = isSettingsPage ? settingsData : dashboardData;

  return (
    <div className="flex min-h-screen">
      <SidebarProvider
        className="grid sm:grid-cols-[auto_1fr]"
        defaultOpen={!isReportsPage}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      >
        <AppSidebar
          data={data}
          collapsible={isReportsPage ? "icon" : "offcanvas"}
          className="border-r border-gray-200"
        />
        <main className="w-full overflow-auto">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
