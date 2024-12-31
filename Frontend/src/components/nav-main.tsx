import { Link } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({ items }) {
  return (
    <SidebarMenu className="space-y-1 pt-2">
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <Link to={item.url}>
            <SidebarMenuButton
              isActive={item.isActive}
              className={cn(
                "w-full flex flex-col items-start gap-0.5 px-4 py-2",
                "group hover:bg-gray-50",
                item.isActive && "bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3 text-gray-700">
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    item.isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                <span
                  className={cn(
                    "font-medium ",
                    item.isActive ? "text-blue-600" : "text-gray-700"
                  )}
                >
                  {item.title}
                </span>
              </div>
              {item.description && (
                <span className="pl-7 text-xs text-gray-500">
                  {item.description}
                </span>
              )}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
