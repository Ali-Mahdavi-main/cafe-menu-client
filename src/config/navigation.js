import {
  LayoutDashboard,
  Folder,
  UtensilsCrossed,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/categories",
    icon: Folder,
  },
  {
    title: "آیتم‌های منو",
    href: "/menu-items",
    icon: UtensilsCrossed,
  },
  {
    title: "تنظیمات",
    href: "/settings",
    icon: Settings,
  },
];