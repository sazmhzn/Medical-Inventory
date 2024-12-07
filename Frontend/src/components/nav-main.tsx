import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const [activeLink, setActiveLink] = useState("Dasboard");

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel className="">Platform</SidebarGroupLabel>
      <SidebarMenu className="bg-transparent">
        {items.map((item) => (
          <Link
            to={item.url}
            key={item.title}
            className="p-1"
            onClick={() => setActiveLink(item.title)}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                className={`"text-base font-normal" ${item.title === activeLink && " bg-neutral-200 text-neutral-800 font-semibold"}`}
                tooltip={item.title}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
