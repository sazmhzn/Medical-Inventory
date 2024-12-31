import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <TeamSwitcher teams={data.teams} />
          <SidebarTrigger className="lg:hidden text-gray-500 hover:text-gray-700" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <div className="space-y-6">
          <div>
            <NavMain items={data.navMain} />
          </div>
        </div>
      </SidebarContent>
      <SidebarRail className="hover:bg-gray-50" />
    </Sidebar>
  );
}
