import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  MoreVertical,
  ArrowLeft,
  LayoutGridIcon,
  List,
  LayoutGrid,
} from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  newButtonLink?: string;
  backButtonLink?: string;
  handleViewMode?: (viewMode: string) => void;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  actions?: {
    label: string;
    icon?: React.ReactNode;
    link?: string;
    onClick?: () => void;
    disabled?: boolean;
  }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  newButtonLink,
  backButtonLink,
  actions = [],
  handleViewMode,
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("Table");

  return (
    <header className=" flex justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium">{title}</h1>
      </div>

      <div className=" flex gap-4">
        {newButtonLink && (
          <>
            <Button
              asChild
              className="whitespace-nowrap rounded-md bg-slate-900 px-4 py-2 font-medium text-white shadow-xl transition-colors hover:bg-slate-700"
            >
              <Link to={newButtonLink}>
                {" "}
                <PlusIcon /> Add new
              </Link>
            </Button>
            <div className="flex gap-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleViewMode("Card")}
                className="rounded-s-full"
              >
                <LayoutGridIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleViewMode("Table")}
                className="rounded-e-full"
              >
                <List />
              </Button>
            </div>
          </>
        )}
        {backButtonLink && (
          <Button variant="link" asChild>
            <Link to={backButtonLink}>
              <Cross1Icon className="stroke-red-600" />{" "}
            </Link>
          </Button>
        )}

        {actions && actions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.link ? (
                    <Link to={action.link} className="flex items-center gap-2">
                      {action.icon}
                      <span>{action.label}</span>
                    </Link>
                  ) : (
                    <>
                      {action.icon}
                      <span>{action.label}</span>{" "}
                    </>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

interface HeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  link?: string;
}

interface BaseHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

// Basic Header with just title and subtitle
export const SimpleHeader: React.FC<BaseHeaderProps> = ({
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn("pb-4", className)}>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};

// Header with back button
interface BackHeaderProps extends BaseHeaderProps {
  backTo: string;
}

export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  subtitle,
  backTo,
  className,
}) => {
  return (
    <div
      className={cn(
        "px-4 w-full pb-4 space-y-2 flex items-center justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <Button variant="ghost" asChild>
        <Link to={backTo}>
          <Cross1Icon className="stroke-red-600" />{" "}
        </Link>
      </Button>
    </div>
  );
};

// Header with actions
interface ActionHeaderProps extends BaseHeaderProps {
  actions?: HeaderAction[];
}

export const ActionHeader: React.FC<ActionHeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
}) => {
  return (
    <div className={cn("pb-4", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-2">
          {actions?.map((action, index) =>
            action.link ? (
              <Button key={index} variant="outline" asChild>
                <Link to={action.link}>
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button key={index} variant="outline" onClick={action.onClick}>
                {action.icon}
                {action.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// List/Grid view header with actions
interface ListHeaderProps extends ActionHeaderProps {
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
  newItemProps?: {
    label: string;
    link: string;
  };
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  subtitle,
  actions,
  viewMode,
  onViewModeChange,
  newItemProps,
  className,
}) => {
  return (
    <div className={cn("pb-4", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {viewMode && onViewModeChange && (
            <div className="flex gap-1">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          )}
          {newItemProps && (
            <Button asChild>
              <Link to={newItemProps.link}>
                <PlusIcon className="h-4 w-4 mr-2" />
                {newItemProps.label}
              </Link>
            </Button>
          )}
          {actions?.map((action, index) =>
            action.link ? (
              <Button key={index} variant="outline" asChild>
                <Link to={action.link}>
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button key={index} variant="outline" onClick={action.onClick}>
                {action.icon}
                {action.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Form header with save/cancel actions
interface FormHeaderProps extends BaseHeaderProps {
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  className,
}) => {
  return (
    <div className={cn("pb-4", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : saveLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
