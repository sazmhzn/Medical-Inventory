import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PlusIcon, MoreVertical } from "lucide-react";

interface PageHeaderProps {
  title: string;
  newButtonLink: string;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  newButtonLink,
  actions = [],
}) => {
  return (
    <header className="flex justify-between px-6">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="inline-flex gap-4 items-center">
        <Button asChild>
          <Link to={newButtonLink} className="flex items-center gap-1">
            <PlusIcon /> New
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                {action.icon}
                <span>{action.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
