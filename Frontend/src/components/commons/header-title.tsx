import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import {
  Bell,
  CirclePlus,
  LayoutGrid,
  PlusIcon,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
          <SidebarTrigger className=" w-6 h-6" />
          <h1 className="text-xl font-bold"> {title} </h1>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" asChild>
                <Link to={"/"}>
                  <PlusIcon className="w-4 h-4" />
                </Link>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full  shadow-none p-8 px-4">
              <Card
                className={cn("w-full bg-transparent border-none shadow-none")}
              >
                <CardContent className="grid grid-cols-2 gap-16">
                  <div className="space-y-4">
                    <h4 className="flex gap-2 text-neutral-600 uppercase">
                      {" "}
                      <span>
                        <LayoutGrid className="w-4" />{" "}
                      </span>{" "}
                      general
                    </h4>

                    <div className="space-y-2 flex flex-col">
                      {" "}
                      <Link
                        to="/create-item"
                        className="text-sm font-[500] text-neutral-600 flex items-center gap-2"
                      >
                        Create New Item
                      </Link>
                      <Link
                        to="/inventory"
                        className="text-sm font-[500] text-neutral-600 flex items-center gap-2"
                      >
                        View Inventory
                      </Link>
                      <Link
                        to="/create-item"
                        className="text-sm font-[500] text-neutral-600 flex items-center gap-2"
                      >
                        Create New Order
                      </Link>
                      <Link
                        to="/inventory"
                        className="text-sm font-[500] text-neutral-600 flex items-center gap-2"
                      >
                        View Inventory
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="flex gap-2 text-neutral-600 uppercase">
                      <span>
                        <ShoppingCart className="w-4" />{" "}
                      </span>{" "}
                      sales
                    </h4>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/create-item"
                        className="text-sm font-[500] text-neutral-600 flex items-center gap-2"
                      >
                        <CirclePlus className="w-4 h-4" />
                        Customer
                      </Link>
                      <Link
                        to="/inventory"
                        className="text-sm font-[500] text-neutral-600"
                      >
                        Invoices
                      </Link>
                      <Link
                        to="/create-item"
                        className="text-sm font-[500] text-neutral-600"
                      >
                        Sales Receipts
                      </Link>
                      <Link
                        to="/inventory"
                        className="text-sm font-[500] text-neutral-600"
                      >
                        Sales Order
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" asChild>
                <Link to={"/"}>
                  <Bell className="w-4 h-4" />
                </Link>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full shadow-none">
              <Card
                className={cn(
                  "w-[380px] border-none bg-transparent shadow-none"
                )}
              >
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <BellIcon />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to device.
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <CheckIcon /> Mark all as read
                  </Button>
                </CardFooter>
              </Card>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" size="icon" asChild>
            <Link to="/admin/settings/orgprofile">
              {" "}
              <Settings />{" "}
            </Link>
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default HeaderTitle;
