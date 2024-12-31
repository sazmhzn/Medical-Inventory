import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/commons/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";
const DashboardLayout = () => {
  const data = {
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
        url: "/admin/settings/orgprofile",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Users & Roles",
        url: "/admin/settings/users",
        icon: SquareTerminal,
      },
      {
        title: "Supplier",
        url: "/admin/settings/suppliers",
        icon: Bot,
      },
      {
        title: "Orders",
        url: "/admin/settings/orders",
        icon: BookOpen,
      },

      {
        title: "Inventory Adjustment",
        url: "/admin/settings/inventory_adjustment",
        icon: BookOpen,
      },
    ],
  };

  return (
    <div className="flex">
      <SidebarProvider className="grid lg:grid-cols-[auto_1fr]">
        <AppSidebar data={data} />

        <main className="w-full">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
