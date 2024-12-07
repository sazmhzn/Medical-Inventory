import { Activity, BookOpen, FileText } from "lucide-react";

export const reportCategories = [
  { title: "Favorites", icon: BookOpen, link: "/reports/favorites" },
  { title: "Sales", icon: FileText, link: "/reports/sales" },
  { title: "Inventory", icon: FileText, link: "#inventory" },
  { title: "Receivable", icon: FileText, link: "/reports/receivable" },
  { title: "Payable", icon: FileText, link: "/reports/payable" },
  { title: "Purchases", icon: FileText, link: "/reports/purchases" },
  { title: "Activity", icon: Activity, link: "/reports/activity" },
];
